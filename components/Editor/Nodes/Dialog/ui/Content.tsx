import React from "react";
import { useDialogContext } from "./Provider";
import { Presence } from "@radix-ui/react-presence";

export const Content: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { open } = useDialogContext();
  return (
    <Presence present={open}>
      <div
        data-state={open ? "open" : "closed"}
        className="absolute left-[50%] top-[50%] z-20 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] md:w-full"
      >
        {children}
      </div>
    </Presence>
  );
};
