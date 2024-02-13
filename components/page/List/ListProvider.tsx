import { ListProps } from "@refinedev/mantine";
import React from "react";

interface ListProviderProps extends React.PropsWithChildren, ListProps {}

const ListContext = React.createContext<ListProviderProps>(null as any);

export const ListProvider: React.FC<ListProviderProps> = (props) => {
  return (
    <ListContext.Provider value={props}>{props.children}</ListContext.Provider>
  );
};

export const useListContext = () => React.useContext(ListContext);
