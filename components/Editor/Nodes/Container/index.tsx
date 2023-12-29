"use client";

import { Element, UserComponent, useNode } from "@craftjs/core";
import { CSSProperties, ReactNode } from "react";
import { BoxSizing, BoxSizingProps } from "../../Settings/BoxSizing";
import { ContainerSettings } from "./ContainerSetting";
import { TypographyProps } from "../../Settings/Typogrphy";
import { Spacing, SpacingProps } from "../../Settings/Spacing";
import { ClassList, ClassListProps } from "../../Settings/ClassList";
import { cx } from "class-variance-authority";
import { Text } from "../Text";
import { generateId } from "@/components/utils/generateId";
import { Generic, GenericProps } from "../../Settings/Generic";
import { useViewport } from "../../Viewport/useViewport";
import { BoxSizingHandler } from "../../Settings/BoxSizing/handler";

type ContainerProps = {
  children?: ReactNode;
  boxSizing: BoxSizingProps;
  spacing: SpacingProps;
  classList: ClassListProps;
  typography: TypographyProps;
  generic: GenericProps;
};

export const Container: UserComponent<Partial<ContainerProps>> = ({
  children,
  boxSizing,
  spacing,
  classList,
  typography,
  generic,
}) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));

  const { isProduction, media } = useViewport();

  let style: CSSProperties = {
    ...spacing,
    ...boxSizing,
    ...typography,
  };

  if(isProduction) {
    style = {
      ...spacing,
      ...BoxSizingHandler(boxSizing, {
        media,
      }),
      ...typography,
    }
  }

  const className = cx(
    (classList as ClassListProps).map(({ className }) => className)
  );

  return (
    <div
      ref={(ref) => connect(ref as any)}
      {...generic}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
};

Container.craft = {
  name: "Container",
  custom: {
    type: "component",
    strictProps: ["spacing", "boxSizing", "classList"],
    functionProps: [],
  },
  props: {
    boxSizing: BoxSizing.defaultValue,
    spacing: Spacing.defaultValue,
    classList: ClassList.defaultValue,
    generic: Generic.defaultValue,
  },
  related: {
    settings: ContainerSettings,
  },
};
