"use client";

import { UserComponent, useNode } from "@craftjs/core";
import React from "react";
import _get from "lodash/get";
import { GuestBook } from "../Guestbook";
import { GuestBookFormContextProvider } from "./context";

type GuestBookFormProps = {
  children?: React.ReactNode;
};

export const GuestBookForm: UserComponent<Partial<GuestBookFormProps>> = ({
  children,
}) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));

  return (
    <GuestBookFormContextProvider>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit} ref={(ref) => connect(ref as any)}>
          {children}
        </form>
      )}
    </GuestBookFormContextProvider>
  );
};

GuestBookForm.craft = {
  name: "GuestBookForm",
  custom: {
    alias: undefined,
    name: "Form",
    type: "component",
  },
  props: {
    children: undefined,
  },
  rules: {
    canDrop(dropTarget, self, helpers) {
      return dropTarget.data.type === GuestBook;
    },
  },
};
