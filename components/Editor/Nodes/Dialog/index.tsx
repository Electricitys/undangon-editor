"use client";

import { UserComponent, useEditor, useNode } from "@craftjs/core";
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

export const Dialog: UserComponent<Partial<DialogProps>> = ({
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
    "absolute left-[50%] top-[50%] z-10 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full",
    (classList as ClassListProps).map(({ className }) => className)
  );

  return (
    <div ref={(ref: any) => connect(ref)}>
      <UIDialog.Root
        defaultOpen={dialog?.defaultValue}
        open={dialog?.stayOpen ? true : undefined}
      >
        {dialogTriggerButton?.hide ? null : (
          <UIDialog.Trigger asChild>
            <Button>{dialogTriggerButton?.text}</Button>
          </UIDialog.Trigger>
        )}
        <Portal container={containerRef.current}>
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
    </div>
  );
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
