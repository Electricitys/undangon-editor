import React from "react";
import { Template } from ".";
import { NodeId } from "@craftjs/core";
import { useTemplateNodeManager } from "./useTemplateNodeManager";
import { Properties } from "../../Settings/Properties";
import { useViewportFrame } from "../../Viewport/Frames/Frame";
import { Context } from "jexl/Expression";
import jexl from "jexl";
import { isString } from "@/components/utils/isString";

type InternalTemplateValue = {
  template: Template["_node"];
  parentProperties: Properties[] | [];
};

const InternalTemplateContext = React.createContext<InternalTemplateValue>(
  null as any
);

export const useInternalTemplate = () => {
  return React.useContext(InternalTemplateContext);
};

export const InternalTemplateProvider: React.FC<
  React.PropsWithChildren & {
    id: NodeId;
  }
> = ({ children, id }) => {
  const { store } = useTemplateNodeManager();
  const template = store[id] || {};
  const { frame } = useViewportFrame();
  const parentProperties = template._parentTemplateId
    ? store[template._parentTemplateId].data.props.props
    : frame?.properties || [];
  const processedProperties = template.id
    ? processProperties(store, template.id, frame?.properties || [])
    : [];
  return (
    <InternalTemplateContext.Provider
      value={{
        template,
        parentProperties: processedProperties,
      }}
    >
      {children}
    </InternalTemplateContext.Provider>
  );
};

const processProperties = (
  store: Record<NodeId, Template["_node"]>,
  nodeId: NodeId,
  properties: Properties[]
) => {
  let currentNode: Template["_node"] | null = store[nodeId];
  let order: Properties[][] = [];
  while (currentNode) {
    order.push(currentNode.data.props.props);
    currentNode = currentNode._parentTemplateId
      ? store[currentNode._parentTemplateId]
      : null;
  }
  order = [properties, ...order.reverse()];
  return order.reduce((prev, curr) => {
    const context = prev.reduce((p, c) => {
      return { ...p, [`$${c.name}`]: c.value };
    }, {});
    const props = curr.map((c) => {
      const value = compileProps(c, context);
      return {
        ...c,
        value: value.result,
      };
    });
    return props;
  }, []);
};

const compileProps = (props: Properties, context: Context = {}) => {
  let result = props.value || "null";
  const expr = jexl.createExpression(result);
  if (props.type === "expression") {
    try {
      result = expr.evalSync(context);
      if (isString(result)) {
        result = `"${result}"`;
      }
    } catch (err) {}
  }
  return {
    result,
    expression: expr,
  };
};
