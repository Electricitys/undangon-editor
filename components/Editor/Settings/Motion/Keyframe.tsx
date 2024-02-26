import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import _remove from "lodash/remove";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNode } from "@craftjs/core";
import { MotionProps } from ".";
import {
  MotionKeyframeProperties,
  MotionTransformInput,
} from "./MotionTransformInput";
import { Button } from "@/components/ui/button";
import { GripVerticalIcon } from "lucide-react";
import React from "react";
import { TrashIcon } from "@radix-ui/react-icons";

export const Keyframe = ({
  index,
  value,
}: {
  index: any;
  value: MotionKeyframeProperties;
}) => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["motion"]),
  }));

  const motion = values.motion as MotionProps;
  const keyframes = _get(motion, "keyframes") || [];

  const isMany = keyframes.length > 1;
  const isStart = isMany && index === 0;
  const isEnd = isMany && index === keyframes.length - 1;
  const currentPercentage = (100 / keyframes.length) * index;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: value.id, disabled: !isMany });

  const _setPropsValue = React.useCallback(
    (path: string, value?: string) => {
      setProp(
        (props: any) =>
          _set(props, path, value === undefined ? undefined : value),
        1000
      );
    },
    [setProp]
  );
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="border bg-white py-2 rounded-md mb-2 group"
      ref={setNodeRef}
      style={style}
    >
      <div className="pl-1 flex items-center">
        <div>
          <Button
            disabled={!isMany}
            size={"icon-sm"}
            variant="ghost"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon size={15} />
          </Button>
        </div>
        <div className="ml-1 text-sm flex-grow">{value.id}</div>

        <Button
          className="hidden group-hover:flex mr-1"
          size={"icon-sm"}
          variant={"ghost"}
          onClick={() => {
            setProp((prop: any) => {
              const keyframes = _get(prop, "motion.keyframes");
              _set(
                prop,
                "motion.keyframes",
                keyframes.filter((v: any) => v.id !== value.id)
              );
            });
          }}
        >
          <TrashIcon />
        </Button>
        {isMany && (
          <div className="text-sm text-slate-400 mr-3  group-hover:hidden">
            {isStart
              ? "Start"
              : isEnd
              ? "End"
              : `${currentPercentage.toFixed()}%`}
          </div>
        )}
      </div>
      <MotionTransformInput
        values={value}
        // placeholders={keyframes[index - 1]}
        onChange={function () {}}
        onValueChange={function (path, value) {
          _setPropsValue(`motion.keyframes[${index}].${path}`, value);
        }}
      />
    </div>
  );
};
