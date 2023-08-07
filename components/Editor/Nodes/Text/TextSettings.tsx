import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _get from "lodash/get";
import _set from "lodash/set";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FontPicker } from "@/components/ui/font-picker";

export const TextSettings = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, [
      "lineHeight",
      "textAlign",
      "fontWeight",
      "textShadow",
      "fontSize",
      "fontFamily",
      "color",
      "margin",
      "padding",
    ]),
  }));

  return (
    <>
      <div>Text settings</div>
    </>
  );
};
