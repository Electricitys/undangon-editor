import { Select } from "@/components/component/Select";
import {
  CSSUnitValue,
  CSSUnitInput,
  uncss,
} from "@/components/ui/css_unit_input";
import { useEditor, useNode } from "@craftjs/core";
import {
  AlignCenterHorizontallyIcon,
  AlignCenterVerticallyIcon,
  AngleIcon,
  BoxIcon,
  CornerBottomLeftIcon,
  CornerBottomRightIcon,
  CornerTopLeftIcon,
  CornerTopRightIcon,
  CornersIcon,
  Crosshair1Icon,
  Crosshair2Icon,
  SpaceBetweenHorizontallyIcon,
  SpaceBetweenVerticallyIcon,
} from "@radix-ui/react-icons";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import React from "react";
import { CSSValueInput } from "@/components/ui/css_value_input";
import { parseIntSafeForInput } from "@/components/utils/parseIntSafe";
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { BoxSizingController } from "./Controller";

const POSITION_OPTIONS = [
  {
    label: "Absolute",
    value: "absolute",
    icon: <Crosshair1Icon />,
  },
  {
    label: "Relative",
    value: "relative",
    icon: <Crosshair2Icon />,
  },
  {
    label: "Unset",
    value: "",
    icon: <BoxIcon />,
  },
];

export interface BoxSizingProps {
  position: "absolute" | "relative" | undefined;
  top: string;
  left: string;
  width: string;
  height: string;
  minWidth: string;
  minHeight: string;
  maxWidth: string;
  maxHeight: string;
  h_sizing: "fixed" | "fill" | "hug";
  v_sizing: "fixed" | "fill" | "hug";
  borderTopLeftRadius: string;
  borderTopRightRadius: string;
  borderBottomLeftRadius: string;
  borderBottomRightRadius: string;
  transform: {
    rotate?: string;
  };
}

const defaultValue: Partial<BoxSizingProps> = {
  position: undefined,
  top: undefined,
  left: undefined,
  width: undefined,
  height: undefined,
  minWidth: undefined,
  minHeight: undefined,
  maxWidth: undefined,
  maxHeight: undefined,
  h_sizing: "hug",
  v_sizing: "hug",
  borderTopLeftRadius: undefined,
  borderTopRightRadius: undefined,
  borderBottomLeftRadius: undefined,
  borderBottomRightRadius: undefined,
  transform: {
    rotate: undefined,
  },
};

export const BoxSizing = () => {
  const {
    actions: { history },
  } = useEditor();
  const {
    actions: { setProp },
    values,
    clientWidth,
    clientHeight,
    clientTop,
    clientLeft,
  } = useNode((node) => {
    return {
      values: _pick(node.data.props, ["boxSizing"]),
      dom: node.dom,
      clientWidth: node.dom?.clientWidth,
      clientHeight: node.dom?.clientHeight,
      clientTop: node.dom?.clientTop,
      clientLeft: node.dom?.clientLeft,
    };
  });

  const boxSizing: BoxSizingProps = values.boxSizing;

  const _setPropsValue = React.useCallback(
    (path: string, value?: string) => {
      setProp(
        (props: any) =>
          _set(props, path, value === undefined ? undefined : value),
        1000
      );
    },
    [setProp]
  );

  return (
    <BoxSizingController
      values={boxSizing}
      placeholders={undefined}
      options={undefined}
      onChange={(path, value) => {
        if (path === "borderRadius") {
          setProp((prop: any) => {
            for (let [p, v] of Object.entries(value)) {
              _set(prop, `boxSizing.${p}`, v);
            }
          }, 1000);
        } else {
          _setPropsValue(`boxSizing.${path}`, value);
        }
      }}
    />
  );
};

BoxSizing.defaultValue = defaultValue as BoxSizingProps;

const resizingOptions = [
  {
    value: "fill",
    label: "Fill",
  },
  {
    value: "fixed",
    label: "Fixed",
  },
  {
    value: "hug",
    label: "Hug",
  },
];
