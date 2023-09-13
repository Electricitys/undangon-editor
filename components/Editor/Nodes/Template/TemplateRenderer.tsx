import { NodeData, SerializedNode } from "@craftjs/core";
import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { Properties } from "../../Settings/Properties";
import jexl from "jexl";
import { Context } from "jexl/Expression";
import { generateId } from "@/components/utils/generateId";
import { useInternalTemplate } from "./useInternalTemplate";

interface TemplateRenderer {
  node: Omit<NodeData, "event">;
  properties: Properties[];
  template: {
    id: string;
    node: SerializedNode;
  };
  asChild?: boolean;
}

export const TemplateRenderer: React.FC<
  React.PropsWithChildren<TemplateRenderer>
> = ({ asChild, template, node, properties, ...props }) => {
  const Comp = asChild ? Slot : "div";

  const { parentProperties } = useInternalTemplate();

  const context = React.useMemo<Context>(() => {
    return parentProperties.reduce((p, c) => {
      return { ...p, [`$${c.name}`]: c.value };
    }, {});
  }, [parentProperties]);

  const safeProps = Object.keys(node.props)
    .filter((name) => node.custom.functionProps?.indexOf(name) > -1)
    .map<Properties>((name) => {
      const value = node.props[name];
      return {
        id: generateId(),
        name: name,
        value: value,
        type: "string",
      };
    });

  const compiled = safeProps.reduce((p, c) => {
    delete context[c.name];
    let compiled = undefined;
    try {
      compiled = compileProps(c, context);
    } catch (err: any) {}
    return { ...p, [c.name]: compiled };
  }, {});
  // console.log(template.id);
  // console.log("frame_CTX", frameContext);
  // console.log("ctx", context);
  // console.log("props", safeProps);

  return <Comp {...props} {...compiled} />;
};

const propsToContext = (properties: Properties[], context: Context = {}) => {
  return properties.reduce((p, c) => {
    let compiled = undefined;
    try {
      compiled = compileProps(c, context);
    } catch (err: any) {}
    return { ...p, [`$${c.name}`]: compiled };
  }, {});
};

const compileProps = (props: Properties, context: Context = {}): any => {
  let result = props.value || "null";
  if (props.type === "string") {
    const expr = jexl.createExpression(result);
    result = expr.evalSync(context);
  }
  return result;
};
