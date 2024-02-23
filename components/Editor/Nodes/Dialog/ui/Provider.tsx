import { useDisclosure } from "@mantine/hooks";
import React from "react";

export type DialogContextProps = {
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
};
export interface DialogContextValue extends Omit<DialogContextProps, "open"> {
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const DialogContext = React.createContext<DialogContextValue>(
  null as any
);

export const DialogContextProvider: React.FC<
  React.PropsWithChildren<DialogContextProps>
> = ({ children, open: overideOpen, defaultOpen = false, modal }) => {
  const [isOpen, { open: openDialog, close: closeDialog }] =
    useDisclosure(defaultOpen);
  return (
    <DialogContext.Provider
      value={{ open: overideOpen || isOpen, openDialog, closeDialog, modal }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => React.useContext(DialogContext);
