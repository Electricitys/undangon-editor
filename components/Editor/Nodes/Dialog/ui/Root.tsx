import React from "react";
import { DialogContextProps, DialogContextProvider } from "./Provider";

type DialogRootProps = React.PropsWithChildren<DialogContextProps> & {};

export const Root: React.FC<DialogRootProps> = ({ children, ...props }) => {
  return <DialogContextProvider {...props}>{children}</DialogContextProvider>;
};
