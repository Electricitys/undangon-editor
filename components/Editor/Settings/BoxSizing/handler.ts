import { BoxSizing, BoxSizingProps } from ".";
import _omit from "lodash/omit";
import _get from "lodash/get";
import { ProcessUnitForViewport } from "../../utils/processViewportUnit";
import { MediaProps } from "../../Viewport/useViewport";
import _isEmpty from "lodash/isEmpty";

type Context = {
  media?: MediaProps;
  isProduction?: boolean;
};

export type TransformProps = {
  rotate?: string;
};

export const BoxSizingHandler = (
  props: BoxSizingProps,
  context: Context
): Omit<BoxSizingProps, "transform"> => {
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

  return _omit(result, ["transform"]) as Omit<BoxSizingProps, "transform">;
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

export const TransformHandler = (
  props: Partial<TransformProps>,
  context?: Context
): string => {
  const result = Object.keys(props).reduce((p, c) => {
    let value = (props as any)[c];
    if (!_isEmpty(value)) {
      p += `${c}(${value})`;
    }
    return p;
  }, "");
  return result;
};
