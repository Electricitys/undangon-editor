import { Spacing, SpacingProps } from ".";
import _get from "lodash/get";
import { ProcessUnitForViewport } from "../../utils/processViewportUnit";
import { MediaProps } from "../../Viewport/useViewport";

type Context = {
  media?: MediaProps;
  isProduction?: boolean;
};

export const SpacingHandler = (
  props: SpacingProps,
  context: Context
): SpacingProps => {
  let result: any = { ...props };
  for (const [key, value] of Object.entries(props)) {
    result[key] = SpacingPropertyHandler(key, value, context);
  }
  return result as SpacingProps;
};

export const SpacingPropertyHandler = (
  path: string,
  value: any,
  context?: Context
): any => {
  let result = value;
  if (!context) return result;
  if (Object.keys(Spacing.defaultValue).indexOf(path) < 0) return result;
  if (!context.isProduction && context.media) {
    result = ProcessUnitForViewport(value, {
      height: context.media.currentMedia.height,
      width: context.media.currentMedia.width,
    });
  }
  return result;
};
