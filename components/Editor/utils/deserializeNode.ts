import {
  ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER,
  ERROR_NOT_IN_RESOLVER,
} from "@craftjs/utils";
import React from "react";
import invariant from "tiny-invariant";
import { resolveComponent } from "./resolveComponent";
import { Canvas, NodeData, Resolver, SerializedNode } from "@craftjs/core";

const restoreType = (type: any, resolver: any) =>
  typeof type === "object" && type.resolvedName
    ? type.resolvedName === "Canvas"
      ? Canvas
      : resolver[type.resolvedName]
    : typeof type === "string"
    ? type
    : null;

export const deserializeComp = (data: any, resolver: any, index?: any) => {
  let { type, props } = data;

  const main = restoreType(type, resolver);

  if (!main) {
    return;
  }

  props = Object.keys(props).reduce((result: any, key) => {
    const prop = props[key];
    if (prop === null || prop === undefined) {
      result[key] = null;
    } else if (typeof prop === "object" && prop.resolvedName) {
      result[key] = deserializeComp(prop, resolver);
    } else if (key === "children" && Array.isArray(prop)) {
      result[key] = prop.map((child) => {
        if (typeof child === "string") {
          return child;
        }
        return deserializeComp(child, resolver);
      });
    } else {
      result[key] = prop;
    }
    return result;
  }, {});

  if (index) {
    props.key = index;
  }

  const jsx = {
    ...React.createElement(main, {
      ...props,
    }),
  };

  return {
    ...jsx,
    name: resolveComponent(resolver, jsx.type),
  };
};

const toNode = (data: any) => {
  invariant(data.type, ERROR_NOT_IN_RESOLVER);
  return {};
};

export const deserializeNode = (
  data: SerializedNode,
  resolver: Resolver
): Omit<NodeData, "event"> => {
  const { type: Comp, props: Props, ...nodeData } = data;

  const isCompAnHtmlElement = Comp !== undefined && typeof Comp === "string";
  const isCompAUserComponent =
    Comp !== undefined && (Comp as any).resolvedName !== undefined;

  invariant(
    isCompAnHtmlElement || isCompAUserComponent,
    ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER.replace(
      "%displayName%",
      data.displayName
    ).replace("%availableComponents%", Object.keys(resolver).join(", "))
  );

  const { type, name, props }: any = deserializeComp(data, resolver);

  const { parent, custom, displayName, isCanvas, nodes, hidden } = nodeData;

  const linkedNodes = nodeData.linkedNodes || nodeData._childCanvas;

  const result = {
    type,
    name,
    displayName: displayName || name,
    props,
    custom: custom || {},
    isCanvas: !!isCanvas,
    hidden: !!hidden,
    parent,
    linkedNodes: linkedNodes || {},
    nodes: nodes || [],
  };

  return {
    ...result,
  };
};
