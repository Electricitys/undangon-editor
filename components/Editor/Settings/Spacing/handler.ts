import _get from "lodash/get";
import { ProcessUnitForViewport } from "../../utils/processViewportUnit";
import { MediaProps } from "../../Viewport/useViewport";
import { uncss } from "@/components/ui/css_unit_input";
import { SpacingProps } from ".";

type Context = {
  media: MediaProps;
};

export const SpacingHandler = (
  props?: SpacingProps,
  context?: Context
): SpacingProps | undefined => {
  if (!props) return undefined;
  if (!context) return undefined;
  return Object.keys(props).reduce((prev, key: any) => {
    let value = ProcessUnitForViewport(uncss.parse(_get(props, key)), {
      height: context.media.currentMedia.height,
      width: context.media.currentMedia.width,
    });
    return {
      ...prev,
      [key]: value,
    };
  }, props);
};
