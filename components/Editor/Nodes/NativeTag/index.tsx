import React from "react";
import { NativeTagSettings } from "./NativeTagSetting";
import { Spacing, SpacingProps } from "../../Settings/Spacing";
import { ClassList, ClassListProps } from "../../Settings/ClassList";
import { Typography, TypographyProps } from "../../Settings/Typogrphy";
import { BoxSizing, BoxSizingProps } from "../../Settings/BoxSizing";
import { UserComponent, useNode } from "@craftjs/core";
import { cx } from "class-variance-authority";
import { Generic, GenericProps } from "../../Settings/Generic";
import { BoxSizingHandler } from "../../Settings/BoxSizing/handler";
import { useViewport } from "../../Viewport/useViewport";

interface NativeTagProps<T = any> {
  children?: React.ReactNode;

  boxSizing: BoxSizingProps;
  spacing: SpacingProps;
  classList: ClassListProps;
  typography: TypographyProps;

  generic: GenericProps;

  as: string;
}

export const NativeTag: UserComponent<Partial<NativeTagProps>> = ({
  boxSizing,
  spacing,
  classList,
  typography,

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

  let style: React.CSSProperties = {
    ...boxSizing,
    ...spacing,
    ...typography,
  };

  if (!isProduction) {
    style = {
      ...spacing,
      ...BoxSizingHandler(boxSizing, {
        media,
      }),
      ...typography,
    };
  }

  const className = cx(
    (classList as ClassListProps).map(({ className }) => className)
  );

  return React.createElement(
    as || tag || "div",
    { style, className, ref: (ref: any) => connect(ref as any), ...generic },
    children
  );
};

NativeTag.craft = {
  name: "NativeTag",
  custom: {
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
  },
  related: {
    settings: NativeTagSettings,
  },
};
