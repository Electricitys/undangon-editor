import { AnimationScope, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";
import { MotionProps } from ".";
import { TransformProperties } from "./types";
import _pick from "lodash/pick";
import { transformObjectsToArray } from "./transformObjectsToArray";

type HandleMotionProps = MotionProps;
type HandleMotionValue = {
  scope: AnimationScope<any>;
};

const keyframesToAnimateProps = (
  keyframes: MotionProps["keyframes"]
): [TransformProperties] => {
  const transformProps = transformObjectsToArray(
    keyframes.map((props) =>
      _pick(props, [
        "x",
        "y",
        "z",
        "translateX",
        "translateY",
        "translateZ",
        "rotate",
        "rotateX",
        "rotateY",
        "rotateZ",
        "scale",
        "scaleX",
        "scaleY",
        "scaleZ",
        "skew",
        "skewX",
        "skewY",
        "originX",
        "originY",
        "originZ",
        "perspective",
        "transformPerspective",
      ])
    )
  );
  console.log(transformProps);
  return [transformProps];
};

export const useHandleMotion = (
  motion: HandleMotionProps
): HandleMotionValue => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    const run = async () => {
      if (!motion) return;
      if (motion.while === "inView")
        if (isInView) {
          // animate(scope.current, keyframesToAnimateProps(motion.keyframes));
          for (let b of motion.keyframes) {
            const currentKeyframe = { ...b };
            for (let p of Object.keys(b)) {
              if (["scaleX", "scaleY"].indexOf(p) != -1) {
                const currentValue = (b as any)[p];
                const parsed = parseFloat(currentValue);
                (currentKeyframe as any)[p] = isNaN(parsed)
                  ? currentValue
                  : parsed;
              }
            }
            console.log("TRIGGER", currentKeyframe.id, currentKeyframe);
            await animate(scope.current, currentKeyframe);
          }
        }
    };
    run();
  }, [scope, isInView, motion?.keyframes]);

  return {
    scope,
  };
};
