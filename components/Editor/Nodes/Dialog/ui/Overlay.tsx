import React from "react";
import { useDialogContext } from "./Provider";
import { Presence } from "@radix-ui/react-presence";

export const Overlay: React.FC<{}> = () => {
  const { open } = useDialogContext();
  return (
    <Presence present={open}>
      <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    </Presence>
  );
};
