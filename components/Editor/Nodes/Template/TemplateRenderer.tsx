import { NodeData, SerializedNode } from "@craftjs/core";
import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { Properties } from "../../Settings/Properties";
import jexl from "jexl";
import { Context } from "jexl/Expression";
import { generateId } from "@/components/utils/generateId";
import { useInternalTemplate } from "./useInternalTemplate";
import _get from "lodash/get";
import _fpset from "lodash/fp/set";

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
    let ctx: Context = {};
    for (let p of parentProperties) {
      ctx[`$${p.name}`] = p.value;
    }
    return ctx;
  }, [parentProperties]);

  const compiled = React.useMemo(() => {
    let result: any = { ...node.props };
    if (node.custom?.functionProps) {
      for (let props of node.custom.functionProps) {
        const path = typeof props === "string" ? props : props.path;
        let inputValue = _get(result, path);
        const compiledProps = compileProps(inputValue, context);
        result = _fpset(path, compiledProps, result);
      }
    }

    return result;
  }, [node.props, context]);

  return <Comp {...props} {...compiled} />;
};

const compileProps = (value: string, context: Context = {}) => {
  let result = value || "null";
  const expr = jexl.createExpression(result);
  try {
    result = expr.evalSync(context);
  } catch (err) {
    console.error("Template Error Compiling Props:", err);
  }
  return result;
};
