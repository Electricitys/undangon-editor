import React, { useEffect, useRef } from "react";
import { NativeTagSettings } from "./NativeTagSetting";
import { Spacing, SpacingProps } from "../../Settings/Spacing";
import { ClassList, ClassListProps } from "../../Settings/ClassList";
import { Typography, TypographyProps } from "../../Settings/Typography";
import { BoxSizing, BoxSizingProps } from "../../Settings/BoxSizing";
import { UserComponent, useNode } from "@craftjs/core";
import { cx } from "class-variance-authority";
import { Generic, GenericProps } from "../../Settings/Generic";
import {
  BoxSizingHandler,
  TransformHandler,
} from "../../Settings/BoxSizing/handler";
import { useViewport } from "../../Viewport/useViewport";
import _merge from "lodash/merge";
import _pick from "lodash/pick";
import _get from "lodash/get";
import { SpacingHandler } from "../../Settings/Spacing/handler";
import { Fill, FillProps } from "../../Settings/Fill";
import { AutoLayout, AutoLayoutProps } from "../../Settings/AutoLayout";
import { StrokeProps } from "../../Settings/Stroke";
import { MotionProps } from "../../Settings/Motion";
import { motion as FMotion } from "framer-motion";
import { useHandleMotion } from "../../Settings/Motion/hook";
import _concat from "lodash/concat";
import { MotionHandler } from "../../Settings/Motion/handler";
import { rest } from "lodash";

interface NativeTagProps<T = any> {
  children?: React.ReactNode;

  boxSizing: BoxSizingProps;
  spacing: SpacingProps;
  classList: ClassListProps;
  typography: TypographyProps;
  fill: FillProps;
  stroke: StrokeProps;
  autoLayout: AutoLayoutProps;
  motion: MotionProps;

  generic: GenericProps;

  as: string;
}

export const NativeTag: UserComponent<Partial<NativeTagProps>> = ({
  boxSizing,
  spacing,
  classList,
  typography,
  fill,
  stroke,
  autoLayout,
  motion,

  generic,

  as,
  children,
}) => {
  const {
    tag,
    connectors: { connect },
  } = useNode((node) => ({
    tag: node.data.custom.name,
  }));

  const { isProduction, media } = useViewport();

  let style: Record<string, any> = {
    ...SpacingHandler(spacing as SpacingProps, { media, isProduction }),
    ...BoxSizingHandler(boxSizing as BoxSizingProps, { media, isProduction }),
    ...typography,
    ...autoLayout,
    ...fill,
    ...stroke,
    transform: TransformHandler({
      ...(_pick(boxSizing as BoxSizingProps, ["transform"]).transform as {}),
    }),
  };

  const className = cx(
    (classList as ClassListProps).map(({ className }) => className)
  );

  let renderComponent = as || tag || "div";

  let renderProps = {
    style,
    className,
    ref: (ref: any) => {
      connect(ref as any);
    },
    ...generic,
  };

  if (motion && motion?.keyframes) {
    renderComponent = FMotion(as || tag || "div");
    renderProps = {
      ...renderProps,
      ...MotionHandler(motion!, { media, isProduction }),
    };
  }

  return React.createElement(renderComponent, renderProps, children);
};

NativeTag.craft = {
  name: "NativeTag",
  custom: {
    alias: undefined,
    name: "div",
    type: "tag",
  },
  props: {
    as: undefined,
    generic: Generic.defaultValue,
    boxSizing: BoxSizing.defaultValue,
    spacing: Spacing.defaultValue,
    typography: Typography.defaultValue,
    classList: ClassList.defaultValue,
    fill: Fill.defaultValue,
    autoLayout: AutoLayout.defaultValue,
  },
  related: {
    settings: NativeTagSettings,
  },
  rules: {
    canDrag(node, helpers) {
      if (_get(node, "data.props.boxSizing.position")) return true;
      else return false;
    },
  },
};
