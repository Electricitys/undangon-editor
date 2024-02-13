import { EditProps } from "@refinedev/mantine";
import React from "react";

interface EditPageProviderProps
  extends React.PropsWithChildren,
    EditProps {}

const EditPageContext = React.createContext<EditPageProviderProps>(
  null as any
);

export const EditPageProvider: React.FC<EditPageProviderProps> = (
  props
) => {
  return (
    <EditPageContext.Provider value={props}>
      {props.children}
    </EditPageContext.Provider>
  );
};

export const useEditPageContext = () => React.useContext(EditPageContext);
