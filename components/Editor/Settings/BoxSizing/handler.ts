import { BoxSizingProps } from ".";
import _get from "lodash/get";
import { ProcessUnitForViewport } from "../../utils/processViewportUnit";
import { MediaProps } from "../../Viewport/useViewport";
import { uncss } from "@/components/ui/css_unit_input";

type Context = {
  media: MediaProps;
};

export const BoxSizingHandler = (
  props?: BoxSizingProps,
  context?: Context
): BoxSizingProps | undefined => {
  if (!props) return undefined;
  if (!context) return undefined;
  return Object.keys(props).reduce((prev, key: any) => {
    let value = _get(props, key);
    if (["h_sizing", "v_sizing"].indexOf(key) < 0) {
      value = ProcessUnitForViewport(uncss.parse(value), {
        height: context.media.currentMedia.height,
        width: context.media.currentMedia.width,
      });
    }
    return {
      ...prev,
      [key]: value,
    };
  }, props);
};
