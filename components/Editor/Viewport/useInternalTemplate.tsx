import React, { useContext } from "react";

type InternalTemplateProps = {
  id: string;
};

export const InternalTemplateContext =
  React.createContext<InternalTemplateProps>({} as any);

export const InternalTemplateProvider: React.FC<
  React.PropsWithChildren<InternalTemplateProps>
> = ({ children, ...props }) => {
  return (
    <InternalTemplateContext.Provider value={props}>
      {children}
    </InternalTemplateContext.Provider>
  );
};

export const useInternalTemplate = () => {
  const internalTemplate = useContext(InternalTemplateContext);
  return internalTemplate;
};
