"use client";

import { UserComponent, useNode } from "@craftjs/core";
import React from "react";
import _get from "lodash/get";
import _pick from "lodash/pick";
import { AutoLayout, AutoLayoutProps } from "../../Settings/AutoLayout";
import { BoxSizingProps, BoxSizing } from "../../Settings/BoxSizing";
import {
  BoxSizingHandler,
  TransformHandler,
} from "../../Settings/BoxSizing/handler";
import { ClassList, ClassListProps } from "../../Settings/ClassList";
import { Fill, FillProps } from "../../Settings/Fill";
import { SpacingProps, Spacing } from "../../Settings/Spacing";
import { SpacingHandler } from "../../Settings/Spacing/handler";
import { Typography, TypographyProps } from "../../Settings/Typography";
import { useViewport } from "../../Viewport/useViewport";
import { StrokeProps } from "../../Settings/Stroke";
import { GuestBookFormButtonSettings } from "./Settings";

type GuestBookFormButtonProps = {
  children?: React.ReactNode;

  boxSizing: BoxSizingProps;
  spacing: SpacingProps;
  classList: ClassListProps;
  typography: TypographyProps;
  fill: FillProps;
  stroke: StrokeProps;
  autoLayout: AutoLayoutProps;
};

export const GuestBookFormButton: UserComponent<
  Partial<GuestBookFormButtonProps>
> = ({
  children,

  boxSizing,
  spacing,
  classList,
  typography,
  fill,
  stroke,
  autoLayout,
}) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    isActive: node.events.selected,
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

  return (
    <button ref={(ref) => connect(ref as any)} type="submit">
      {children}
    </button>
  );
};

GuestBookFormButton.craft = {
  name: "GuestBookFormButton",
  custom: {
    alias: undefined,
    name: "FormButton",
    type: "component",
  },
  props: {
    children: undefined,

    boxSizing: BoxSizing.defaultValue,
    spacing: Spacing.defaultValue,
    typography: Typography.defaultValue,
    classList: ClassList.defaultValue,
    fill: Fill.defaultValue,
    autoLayout: AutoLayout.defaultValue,
  },

  related: {
    settings: GuestBookFormButtonSettings,
  },
};
