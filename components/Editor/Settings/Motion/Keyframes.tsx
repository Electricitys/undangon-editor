import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { useNode } from "@craftjs/core";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MotionProps } from ".";
import { Keyframe } from "./Keyframe";

export const Keyframes = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["motion"]),
  }));
  const motion = values.motion as MotionProps;
  const keyframes = _get(motion, "keyframes") || [];
  const keyframeIds = keyframes.map((k) => k.id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setProp((prop: any) => {
        const oldIndex = keyframes.findIndex((v: any) => v.id === active.id);
        const newIndex = keyframes.findIndex((v: any) => v.id === over?.id);
        _set(
          prop,
          "motion.keyframes",
          arrayMove(keyframes, oldIndex, newIndex)
        );
      });
    }
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={keyframeIds}
        strategy={verticalListSortingStrategy}
      >
        {keyframes.map((keyframe, index) => {
          return <Keyframe key={keyframe.id} index={index} value={keyframe} />;
        })}
      </SortableContext>
    </DndContext>
  );
};
