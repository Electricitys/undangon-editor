import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { useDialogContext } from "./Provider";

type DialogTrigger = {
  asChild?: boolean;
  className?: string;
};

export const Trigger: React.FC<React.PropsWithChildren<DialogTrigger>> = ({
  children,
  asChild = false,
  className,
}) => {
  const Comp = asChild ? Slot : "button";
  const { openDialog } = useDialogContext();
  return <Comp onClick={() => openDialog()}>{children}</Comp>;
};
