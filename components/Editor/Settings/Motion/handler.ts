import _get from "lodash/get";
import _pick from "lodash/pick";
import _set from "lodash/set";
import { MediaProps } from "../../Viewport/useViewport";
import { MotionProps } from ".";
import {
  AnimationControls,
  Target,
  TargetAndTransition,
  Transition,
  VariantLabels,
  Variants,
} from "framer-motion";
import { transformObjectsToArray } from "./transformObjectsToArray";
import { MotionKeyframeProperties } from "./MotionTransformInput";
import * as csstree from "css-tree";
import { parseNumber } from "@/components/utils/parseNumber";

type Context = {
  media?: MediaProps;
  isProduction?: boolean;
};

type MotionHandlerValue = {
  initial?: boolean | Target | VariantLabels;
  animate?: boolean | AnimationControls | TargetAndTransition | VariantLabels;
  exit?: TargetAndTransition | VariantLabels;
  variants?: Variants;
  transitions?: Transition;
  whileHover?: string;
  whileTap?: string;
  whileInView?: string;
};

export const MotionHandler = (
  props: MotionProps,
  context: Context
): MotionHandlerValue => {
  const result: MotionHandlerValue = {};
  const isSequence = props.keyframes.length > 1;
  let initialKeyframe = isSequence ? props.keyframes[0] : {};
  let keyframes = props.keyframes;

  if (isSequence) {
    result.initial = "initial";
    _set(result, "initial", "initial");
    _set(
      result,
      "variants.initial",
      MotionKeyframeValueParser(initialKeyframe as any)
    );
    _set(
      result,
      "variants.animate",
      transformObjectsToArray(
        keyframes.map((keyframe) => MotionKeyframeValueParser(keyframe))
      )
    );
  } else {
    _set(result, "variants.animate", MotionKeyframeValueParser(keyframes[0]));
  }
  if (props.while === "hover") {
    result.whileHover = "animate";
  } else if (props.while === "tap") {
    result.whileTap = "animate";
  } else if (props.while === "inView") {
    result.whileInView = "animate";
  }
  return result;
};

const MotionKeyframeValueParser = (
  keyframe: MotionKeyframeProperties
): Pick<MotionKeyframeProperties, "translateX" | "translateY"> => {
  const result: any = _pick(keyframe, [
    "translateX",
    "translateY",
    "translateZ",
    "scaleX",
    "scaleY",
    "originX",
    "originY",
    "rotate",
    "opacity",
  ]);
  for (let [key, value] of Object.entries(result)) {
    const temp = csstree.parse(value as string, {
      context: "value",
    }) as csstree.Value;
    const cssvalue = temp.children.first;
    const numberValue = parseNumber((cssvalue as any)?.value);

    result[key] = typeof numberValue === "number" ? numberValue : undefined;
  }
  return result;
};
