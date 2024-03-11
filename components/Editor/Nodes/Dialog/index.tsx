"use client";

import { Element, UserComponent, useNode } from "@craftjs/core";
import React from "react";
import { Spacing, SpacingProps } from "../../Settings/Spacing";
import { ClassList, ClassListProps } from "../../Settings/ClassList";
import { TypographyProps } from "../../Settings/Typography";
import { CSSProperties } from "react";
import { Generic, GenericProps } from "../../Settings/Generic";
import { SpacingHandler } from "../../Settings/Spacing/handler";
import { useViewport } from "../../Viewport/useViewport";
import { DialogSettings } from "./DialogSettings";
import { Button } from "@/components/ui/button";
import { BoxSizing, BoxSizingProps } from "../../Settings/BoxSizing";
import { BoxSizingHandler } from "../../Settings/BoxSizing/handler";
import { cn } from "@/lib/utils";
import * as UIDialog from "./ui";
import { Portal } from "@radix-ui/react-portal";
import { generateId } from "@/components/utils/generateId";
import * as Components from "../";

type DialogType = {
  defaultValue: boolean;
  stayOpen: boolean;

  closeOnClickOutside?: boolean;
};
type DialogTriggerButtonType = {
  text: string;

  hide: boolean;
};

export type DialogProps = {
  children?: React.ReactNode;

  boxSizing: BoxSizingProps;
  spacing: SpacingProps;
  classList: ClassListProps;
  typography: TypographyProps;
  generic: GenericProps;

  dialog: DialogType;
  dialogTriggerButton: DialogTriggerButtonType;
};

export const Dialog: UserComponent<Partial<DialogProps>> & {
  defaultComponent: (component: any, props: any) => React.ReactElement;
} = ({
  children,

  boxSizing,
  spacing,
  classList,
  typography,
  generic,

  dialog,
  dialogTriggerButton,
}) => {
  const {
    connectors: { connect },
    actions: { setProp },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));

  const { isProduction, media, containerRef } = useViewport();

  const style: CSSProperties = {
    ...SpacingHandler(spacing as SpacingProps, { media, isProduction }),
    ...BoxSizingHandler(boxSizing as BoxSizingProps, { media, isProduction }),
    ...typography,
  };

  const className = cn(
    (classList as ClassListProps).map(({ className }) => className)
  );

  const render = (
    <UIDialog.Root
      // defaultOpen={dialog?.defaultValue}
      defaultOpen={true}
      open={!isProduction ? (dialog?.stayOpen ? true : undefined) : undefined}
      modal={isProduction}
    >
      {dialogTriggerButton?.hide ? null : (
        <UIDialog.Trigger asChild>
          <Button>{dialogTriggerButton?.text}</Button>
        </UIDialog.Trigger>
      )}
      <Portal
        container={containerRef.current ? containerRef.current : undefined}
      >
        <UIDialog.Overlay />
        <UIDialog.Content
          {...(generic as any)}
          style={style as any}
          className={className}
        >
          {children}
        </UIDialog.Content>
      </Portal>
    </UIDialog.Root>
  );

  if (isProduction) return render;

  return <div ref={(ref: any) => connect(ref)}>{render}</div>;
};

Dialog.craft = {
  name: "Dialog",
  custom: {
    alias: undefined,
    id: `dialog_${generateId()}`,
    name: "Dialog",
    type: "component",
    strictProps: ["spacing", "generic"],
  },
  props: {
    dialog: {
      defaultValue: false,
      stayOpen: false,
    },
    dialogTriggerButton: {
      text: "Open",
      hide: true,
    },
    boxSizing: BoxSizing.defaultValue,
    spacing: Spacing.defaultValue,
    classList: ClassList.defaultValue,
    generic: Generic.defaultValue,
  },
  related: {
    settings: DialogSettings,
  },
};

Dialog.defaultComponent = (component, props) =>
  React.createElement(
    Element,
    {
      is: component,
      canvas: true,
      ...props,
    },
    React.createElement(
      Element,
      {
        key: generateId(),
        is: Components.NativeTag,
        canvas: true,
        generic: {},
        boxSizing: {
          height: "100vh",
          maxHeight: "100vh",
          h_sizing: "hug",
          v_sizing: "fixed",
          transform: {},
        },
        spacing: {
          paddingRight: "12px",
          paddingLeft: "12px",
        },
        typography: {
          color: "inherit",
          fontFamily: "Roboto",
        },
        classList: [],
        fill: {},
        autoLayout: {
          display: "flex",
          flexFlow: "column",
          justifyContent: "center",
        },
      },
      React.createElement(
        Element,
        {
          key: generateId(),
          is: Components.DialogTrigger,
          canvas: true,
        },

        React.createElement(
          Element,
          {
            key: generateId(),
            is: Components.NativeTag,
            canvas: true,
            generic: {
              id: "OPEN_BUTTON",
            },
            boxSizing: {
              h_sizing: "hug",
              v_sizing: "hug",
              borderTopLeftRadius: "9px",
              borderTopRightRadius: "9px",
              borderBottomLeftRadius: "9px",
              borderBottomRightRadius: "9px",
              transform: {},
            },
            spacing: {
              paddingTop: "12px",
              paddingRight: "12px",
              paddingBottom: "12px",
              paddingLeft: "12px",
            },
            typography: {
              color: "inherit",
              fontFamily: "Roboto",
              textAlign: "center",
            },
            classList: [],
            fill: {
              background: "#ffffff",
            },
            autoLayout: {},
            stroke: {
              borderColor: "#000000",
              borderStyle: "solid",
              borderTopWidth: "1px",
              borderRightWidth: "1px",
              borderBottomWidth: "1px",
              borderLeftWidth: "1px",
            },
          },
          React.createElement(Element, {
            key: generateId(),
            is: Components.Text,
            canvas: true,
            text: {
              type: "text",
              value: "Buka Invitation",
            },
            spacing: {},
            typography: {
              color: "inherit",
              fontFamily: "Roboto",
            },
            classList: [],
            generic: {},
          })
        )
      )
    )
  );
