import React from "react";
import { Template } from ".";
import { NodeId } from "@craftjs/core";

type TemplateNodeManagerValue = {
  store: Record<NodeId, Template["_node"]>;
  setStore: React.Dispatch<
    React.SetStateAction<Record<NodeId, Template["_node"]>>
  >;
};

const TemplateNodeManagerContext =
  React.createContext<TemplateNodeManagerValue>(null as any);

export const useTemplateNodeManager = () => {
  const { store, setStore } = React.useContext(TemplateNodeManagerContext);
  return {
    store,
    setStore,
    setTemplate: (storeId: string, template: Template["_node"]) => {
      if (!store[storeId]) {
        setStore((s) => ({
          ...s,
          [storeId]: template,
        }));
      } else {
        setStore((s) => {
          s[storeId] = template;
          return { ...s };
        });
      }
    },
  };
};

export const TemplateNodeManagerProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [store, setStore] = React.useState<TemplateNodeManagerValue["store"]>(
    {}
  );
  return (
    <TemplateNodeManagerContext.Provider
      value={{
        store,
        setStore,
      }}
    >
      {children}
    </TemplateNodeManagerContext.Provider>
  );
};
