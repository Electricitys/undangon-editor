"use client";

import { UserComponent, useNode } from "@craftjs/core";
import React from "react";
import _get from "lodash/get";
import { useGuestbookItemContext } from "../GuestbookLoop/context";
import { AutoLayout, AutoLayoutProps } from "../../Settings/AutoLayout";
import { BoxSizing, BoxSizingProps } from "../../Settings/BoxSizing";
import { ClassList, ClassListProps } from "../../Settings/ClassList";
import { Fill, FillProps } from "../../Settings/Fill";
import { Spacing, SpacingProps } from "../../Settings/Spacing";
import { Typography, TypographyProps } from "../../Settings/Typography";
import { StrokeProps } from "../../Settings/Stroke";
import { GuestBookSettings } from "./GuestBookSettings";

type GuestBookLoopContentProps = {
  part: "title" | "message" | "date";

  boxSizing: BoxSizingProps;
  spacing: SpacingProps;
  classList: ClassListProps;
  typography: TypographyProps;
  fill: FillProps;
  stroke: StrokeProps;
  autoLayout: AutoLayoutProps;
};

export const GuestBookLoopContent: UserComponent<
  Partial<GuestBookLoopContentProps>
> = ({
  part = "title",

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

  const content = useGuestbookItemContext();

  return (
    <div ref={(ref) => connect(ref as any)}>
      {_get(content, part) ? _get(content, part) : part}
    </div>
  );
};

GuestBookLoopContent.craft = {
  name: "GuestBookLoopContent",
  custom: {
    alias: undefined,
    name: "Item Content",
    type: "component",
  },
  props: {
    part: "title",

    boxSizing: BoxSizing.defaultValue,
    spacing: Spacing.defaultValue,
    typography: Typography.defaultValue,
    classList: ClassList.defaultValue,
    fill: Fill.defaultValue,
    autoLayout: AutoLayout.defaultValue,
  },
  related: {
    settings: GuestBookSettings,
  },
};
