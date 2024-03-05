"use client";

import { UserComponent, useNode } from "@craftjs/core";
import React from "react";
import _get from "lodash/get";
import _pick from "lodash/pick";
import { useGuestbookFormContext } from "../GuestbookForm/context";
import { GuestBookFormInputSettings } from "./Settings";
import { AutoLayoutProps, AutoLayout } from "../../Settings/AutoLayout";
import { BoxSizingProps, BoxSizing } from "../../Settings/BoxSizing";
import { BoxSizingHandler, TransformHandler } from "../../Settings/BoxSizing/handler";
import { ClassListProps, ClassList } from "../../Settings/ClassList";
import { FillProps, Fill } from "../../Settings/Fill";
import { SpacingProps, Spacing } from "../../Settings/Spacing";
import { SpacingHandler } from "../../Settings/Spacing/handler";
import { StrokeProps } from "../../Settings/Stroke";
import { TypographyProps, Typography } from "../../Settings/Typography";
import { useViewport } from "../../Viewport/useViewport";

type GuestBookFormInputProps = {
  part: "title" | "message";

  boxSizing: BoxSizingProps;
  spacing: SpacingProps;
  classList: ClassListProps;
  typography: TypographyProps;
  fill: FillProps;
  stroke: StrokeProps;
  autoLayout: AutoLayoutProps;
};

export const GuestBookFormInput: UserComponent<
  Partial<GuestBookFormInputProps>
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

  const { handleChange, values } = useGuestbookFormContext();

  return (
    <input
      ref={(ref) => connect(ref as any)}
      style={style}
      name={part}
      onChange={handleChange}
      value={_get(values, part)}
    />
  );
};

GuestBookFormInput.craft = {
  name: "GuestBookFormInput",
  custom: {
    alias: undefined,
    name: "FormInput",
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
    settings: GuestBookFormInputSettings,
  },
};
