import { ShowProps } from "@refinedev/mantine";
import React from "react";

interface ShowPageProviderProps extends React.PropsWithChildren, ShowProps {}

const ShowPageContext = React.createContext<ShowPageProviderProps>(null as any);

export const ShowPageProvider: React.FC<ShowPageProviderProps> = (props) => {
  return (
    <ShowPageContext.Provider value={props}>{props.children}</ShowPageContext.Provider>
  );
};

export const useShowPageContext = () => React.useContext(ShowPageContext);
