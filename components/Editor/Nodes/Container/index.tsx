"use client";

import { UserComponent, useNode } from "@craftjs/core";
import { CSSProperties, ReactNode } from "react";
import { BoxSizing, BoxSizingProps } from "../../Settings/BoxSizing";
import { ContainerSettings } from "./ContainerSetting";
import { TypographyProps } from "../../Settings/Typogrphy";

type ContainerProps = {
  children?: ReactNode;
  boxSizing: BoxSizingProps;
  typography: TypographyProps;
};

export const Container: UserComponent<Partial<ContainerProps>> = ({
  children,
  boxSizing,
  typography,
}) => {
  const {
    connectors: { connect },
    actions: { setProp },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));

  const style: CSSProperties = {
    ...boxSizing,
    ...typography,
  };

  return (
    <div ref={(ref) => connect(ref as any)} style={style}>
      {children}
    </div>
  );
};

Container.craft = {
  name: "Container",
  props: {
    boxSizing: BoxSizing.defaultValue,
  },
  related: {
    settings: ContainerSettings,
  },
};
