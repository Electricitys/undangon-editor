"use client";

import React, { useEffect } from "react";
import { useDialogContext } from "./Provider";
import { Presence } from "@radix-ui/react-presence";
import { cn } from "@/lib/utils";

export const Overlay: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ className }) => {
  const { open, modal } = useDialogContext();

  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("overflow-hidden");
    
    if (open) {
      body.classList.add("overflow-hidden");
    }
    return () => {
      body.classList.remove("overflow-hidden");
    };
  }, [modal, open]);

  return (
    <Presence present={open}>
      <div
        className={cn(
          modal ? "fixed" : "absolute",
          "inset-0 z-20 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className
        )}
      />
    </Presence>
  );
};
