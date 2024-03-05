"use client";

import { UserComponent, useNode } from "@craftjs/core";
import React from "react";
import _get from "lodash/get";
import { GuestBookSettings } from "./GuestBookSettings";
import { GuestBookContextProvider } from "./context";
import { useQuery } from "@tanstack/react-query";
import { feathers } from "@/components/client/feathers";
import { BoxSizing, BoxSizingProps } from "../../Settings/BoxSizing";
import { Spacing, SpacingProps } from "../../Settings/Spacing";
import { ClassList, ClassListProps } from "../../Settings/ClassList";
import { Typography, TypographyProps } from "../../Settings/Typography";
import { Fill, FillProps } from "../../Settings/Fill";
import { StrokeProps } from "../../Settings/Stroke";
import { AutoLayout, AutoLayoutProps } from "../../Settings/AutoLayout";
import { SpacingHandler } from "../../Settings/Spacing/handler";
import {
  BoxSizingHandler,
  TransformHandler,
} from "../../Settings/BoxSizing/handler";
import _pick from "lodash/pick";
import { useViewport } from "../../Viewport/useViewport";

type GuestBookProps = {
  children?: React.ReactNode;
  token: string;

  boxSizing: BoxSizingProps;
  spacing: SpacingProps;
  classList: ClassListProps;
  typography: TypographyProps;
  fill: FillProps;
  stroke: StrokeProps;
  autoLayout: AutoLayoutProps;
};

export const GuestBook: UserComponent<Partial<GuestBookProps>> = ({
  children,
  token = "example-message",
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

  const data = useQuery(["guestbook"], async () => {
    const data = await feathers.service("messages").find({
      query: {
        token,
      },
    });
    console.log(data);
    return data;
  });

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
    <div ref={(ref) => connect(ref as any)} style={style}>
      <GuestBookContextProvider token={token}>
        {children}
      </GuestBookContextProvider>
    </div>
  );
};

GuestBook.craft = {
  name: "GuestBook",
  custom: {
    alias: undefined,
    name: "Guest Book",
    type: "component",
  },
  props: {
    children: undefined,
    token: "example-message",

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
