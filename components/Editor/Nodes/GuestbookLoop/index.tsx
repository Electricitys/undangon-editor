"use client";

import { UserComponent, useNode } from "@craftjs/core";
import React from "react";
import _get from "lodash/get";
import _pick from "lodash/pick";
import { MotionProps } from "../../Settings/Motion";
import { GuestBookItemContextProvider } from "./context";
import { useGuestbookContext } from "../Guestbook/context";
import { GuestBook } from "../Guestbook";
import { BoxSizing, BoxSizingProps } from "../../Settings/BoxSizing";
import {
  BoxSizingHandler,
  TransformHandler,
} from "../../Settings/BoxSizing/handler";
import { Spacing, SpacingProps } from "../../Settings/Spacing";
import { SpacingHandler } from "../../Settings/Spacing/handler";
import { useViewport } from "../../Viewport/useViewport";
import { ClassList, ClassListProps } from "../../Settings/ClassList";
import { Typography, TypographyProps } from "../../Settings/Typography";
import { AutoLayout, AutoLayoutProps } from "../../Settings/AutoLayout";
import { Fill, FillProps } from "../../Settings/Fill";
import { StrokeProps } from "../../Settings/Stroke";
import { GuestBookSettings } from "../Guestbook/GuestBookSettings";

type GuestBookProps = {
  children?: React.ReactNode;

  boxSizing: BoxSizingProps;
  spacing: SpacingProps;
  classList: ClassListProps;
  typography: TypographyProps;
  fill: FillProps;
  stroke: StrokeProps;
  autoLayout: AutoLayoutProps;

  motion: MotionProps;
};

export const GuestBookLoop: UserComponent<Partial<GuestBookProps>> = ({
  boxSizing,
  spacing,
  classList,
  typography,
  fill,
  stroke,
  autoLayout,

  children,
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

  const { data } = useGuestbookContext();

  return (
    <div ref={(ref) => connect(ref as any)} style={style}>
      {data.length === 0 && children}
      {data?.map(({ title, message, created_at }, index) => {
        return (
          <GuestBookItemContextProvider
            key={index}
            title={title}
            message={message}
            date={created_at}
          >
            {children}
          </GuestBookItemContextProvider>
        );
      })}
    </div>
  );
};

GuestBookLoop.craft = {
  name: "GuestBookLoop",
  custom: {
    alias: undefined,
    name: "Looper",
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
    settings: GuestBookSettings
  },
  rules: {
    canDrop(dropTarget, self, helpers) {
      return dropTarget.data.type === GuestBook;
    },
  },
};
