import _get from "lodash/get";
import { ProcessUnitForViewport } from "../../utils/processViewportUnit";
import { MediaProps } from "../../Viewport/useViewport";
import { Motion, MotionProps } from ".";

type Context = {
  media?: MediaProps;
  isProduction?: boolean;
};

export const MotionHandler = (
  props: MotionProps,
  context: Context
): MotionProps => {
  let result: any = { ...props };
  for (const [key, value] of Object.entries(props)) {
    result[key] = MotionPropertyHandler(key, value, context);
  }
  return result as MotionProps;
};

export const MotionPropertyHandler = (
  path: string,
  value: any,
  context?: Context
): any => {
  let result = value;
  if (!context) return result;
  if (Object.keys(Motion.defaultValue).indexOf(path) < 0) return result;
  if (!context.isProduction && context.media) {
    result = ProcessUnitForViewport(value, {
      height: context.media.currentMedia.height,
      width: context.media.currentMedia.width,
    });
  }
  return result;
};
