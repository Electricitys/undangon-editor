import { AnimationScope, useAnimate, useInView } from "framer-motion";
import React, { CSSProperties, useEffect } from "react";
import { MotionProps } from ".";
import { TransformProperties } from "./types";
import _pick from "lodash/pick";
import { transformObjectsToArray } from "./transformObjectsToArray";
import { useHover } from "usehooks-ts";
import { useTap } from "../../utils/useHooks/useTap";
import { MotionKeyframeProperties } from "./MotionTransformInput";
import { toCssTransform } from "./toCssTransform";

type HandleMotionProps = MotionProps;
type HandleMotionValue = {
  setRef: (el: any) => void;
};

export const useHandleMotion = (
  motion: HandleMotionProps
): HandleMotionValue => {
  const [scope, animate] = useAnimate();
  const ref = React.useRef<any>(null);
  const setRef = React.useCallback((el: any) => {
    (scope as any).current = el;
    ref.current = el;
  }, []);
  const isInView = useInView(scope);
  const isHovered = useHover(ref);
  const isTap = useTap(ref);

  const keyframes = React.useMemo(() => {
    const keyframes = motion?.keyframes || [];

    return keyframes;
  }, [motion?.keyframes]);

  const { start } = React.useMemo(() => {
    const handler = async (keyframe: any) => {
      const currentKeyframe = { ...keyframe };
      for (let p of Object.keys(keyframe)) {
        if (["scaleX", "scaleY"].indexOf(p) != -1) {
          const currentValue = (keyframe as any)[p];
          const parsed = parseFloat(currentValue);
          (currentKeyframe as any)[p] = isNaN(parsed) ? currentValue : parsed;
        }
      }
      return animate(scope.current, currentKeyframe);
    };
    const start = async () => {
      for (let keyframe of keyframes) {
        handler(keyframe);
      }
    };
    const revert = async () => {
      handler(keyframes[0]);
    };
    // const reverse = async () => {
    //   for (let b of keyframes) {
    //     const currentKeyframe = { ...b };
    //     for (let p of Object.keys(b)) {
    //       if (["scaleX", "scaleY"].indexOf(p) != -1) {
    //         const currentValue = (b as any)[p];
    //         const parsed = parseFloat(currentValue);
    //         (currentKeyframe as any)[p] = isNaN(parsed) ? currentValue : parsed;
    //       }
    //     }
    //     await animate(scope.current, currentKeyframe);
    //   }
    // };
    return { start, revert };
  }, [scope, keyframes]);

  useEffect(() => {
    if (!motion) return;
    switch (motion.while) {
      case "inView":
        if (isInView) {
          start();
        } else {
        }
        break;
      case "hover":
        if (isHovered) {
          start();
        }
        break;
      case "tap":
        if (isTap) {
          start();
        }
        break;
    }
  }, [start, isInView, isHovered, isTap]);

  return {
    setRef,
  };
};
