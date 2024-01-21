import { generateId } from "@/components/utils/generateId";
import { UserComponent } from "@craftjs/core";
import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { DialogTriggerSettings } from "./DialogTriggerSettings";
import { useDialogContext } from "../Dialog/ui/Provider";

type DialogType = {
  asChild?: boolean;
};

export type DialogTriggerProps = {
  className?: string;

  dialog: DialogType;
};

export const DialogTrigger: UserComponent<
  React.PropsWithChildren<DialogTriggerProps>
> = ({ children, dialog }) => {
  // const Comp = dialog.asChild ? Slot : "div";
  const { closeDialog } = useDialogContext();
  return (
    <div
      onClick={() => {
        closeDialog();
      }}
    >
      {children}
    </div>
  );
};

DialogTrigger.craft = {
  name: "DialogTrigger",
  custom: {
    id: `dialog_${generateId()}`,
    alias: undefined,
    name: "DialogTrigger",
    type: "component",
    strictProps: ["spacing", "generic"],
  },
  props: {
    dialog: {
      asChild: false,
    },
  },
  related: {
    settings: DialogTriggerSettings,
  },
};
