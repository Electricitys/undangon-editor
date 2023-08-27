"use client";

import { UserComponent, useNode } from "@craftjs/core";
import React from "react";

type SlotProps = {
  children?: React.ReactNode;
};

export const Slot: UserComponent<Partial<SlotProps>> = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));
  if (children) return children;
  return <span ref={(ref) => connect(ref as any)}>{"Some child"}</span>;
};

Slot.craft = {
  name: "<slot />",
  custom: {
    type: "slot",
  },
  props: {},
  related: {},
};
