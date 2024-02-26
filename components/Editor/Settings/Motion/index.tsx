import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { useNode } from "@craftjs/core";
import {
  MotionKeyframeProperties,
} from "./MotionTransformInput";
import React from "react";
import { Button } from "@/components/ui/button";
import { generateId } from "@/components/utils/generateId";

import { Keyframes } from "./Keyframes";
import { Select } from "@/components/component/Select";

export interface MotionProps {
  keyframes: MotionKeyframeProperties[];
  duration?: number;
  while: "hover" | "tap" | "inView";
}

const defaultValue: Partial<MotionProps> = {
  keyframes: [],
};

export const Motion = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["motion"]),
  }));

  const motion = values.motion as MotionProps;

  return (
    <div className="px-1">
      <div className="flex items-center pl-3 pr-1 pb-2">
        <div className="grow text-sm w-full">When</div>
        <Select
          label={"When"}
          value={_get(motion, "while")}
          options={[
            { label: "Hover", value: "hover" },
            { label: "Tap", value: "tap" },
            { label: "In View", value: "inView" },
          ]}
          onChange={function (value) {
            setProp((prop: any) => {
              _set(prop, "motion.while", value);
            });
          }}
        />
      </div>
      <div className="flex items-center pl-3 pr-1 pb-2">
        <div className="grow text-sm w-full">Keyframes</div>
      </div>

      <Keyframes />
      <div className="px-3">
        <Button
          className="w-full"
          onClick={() => {
            setProp((prop: any) => {
              let keyframes = _get(prop, "motion.keyframes") || [];
              keyframes.push({
                id: generateId(),
              });
              _set(prop, `motion.keyframes`, keyframes);
            });
          }}
        >
          Add Keyframe
        </Button>
      </div>
    </div>
  );
};

Motion.defaultValue = defaultValue as MotionProps;
