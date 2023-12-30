import { BoxSizing, BoxSizingProps } from ".";
import _get from "lodash/get";
import { ProcessUnitForViewport } from "../../utils/processViewportUnit";
import { MediaProps } from "../../Viewport/useViewport";
import { uncss } from "@/components/ui/css_unit_input";

type Context = {
  media?: MediaProps;
  isProduction?: boolean;
};

export const BoxSizingHandler = (
  props: BoxSizingProps,
  context: Context
): BoxSizingProps => {
  let result: any = { ...props };
  for (const [key, value] of Object.entries(props)) {
    result[key] = BoxSizingPropertyHandler(key, value, context);
  }
  for (const [key, value] of Object.entries(props)) {
    let targetKey = key;
    if ("h_sizing" === key) targetKey = "width";
    else if ("v_sizing" === key) targetKey = "height";
    if (value === "fill") result[targetKey] = "100%";
    else if (value === "hug") result[targetKey] = undefined;
    else if (value === "fixed") result[targetKey] = result[targetKey];
  }
  return result as BoxSizingProps;
};

export const BoxSizingPropertyHandler = (
  path: string,
  value: any,
  context?: Context
): any => {
  let result = value;
  if (!context) return result;
  if (Object.keys(BoxSizing.defaultValue).indexOf(path) < 0) return result;
  if (
    !context.isProduction &&
    context.media &&
    ["h_sizing", "v_sizing"].indexOf(path) < 0
  ) {
    result = ProcessUnitForViewport(value, {
      height: context.media.currentMedia.height,
      width: context.media.currentMedia.width,
    });
  }
  return result;
};
