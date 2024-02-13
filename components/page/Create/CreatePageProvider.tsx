import { CreateProps } from "@refinedev/mantine";
import React from "react";

interface CreatePageProviderProps
  extends React.PropsWithChildren,
    CreateProps {}

const CreatePageContext = React.createContext<CreatePageProviderProps>(
  null as any
);

export const CreatePageProvider: React.FC<CreatePageProviderProps> = (
  props
) => {
  return (
    <CreatePageContext.Provider value={props}>
      {props.children}
    </CreatePageContext.Provider>
  );
};

export const useCreatePageContext = () => React.useContext(CreatePageContext);
