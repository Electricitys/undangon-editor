"use client";

import {
  Node,
  NodeData,
  NodeId,
  NodeTree,
  SerializedNode,
  UserComponent,
  useEditor,
  useEditorReturnType,
  useNode,
} from "@craftjs/core";
import React from "react";
import { deserializeNode } from "../../utils/deserializeNode";
import _sortBy from "lodash/sortBy";
import _get from "lodash/get";
import _set from "lodash/set";
import { NativeTag } from "../NativeTag";
import { TemplateSettings } from "./TemplateSetting";
import { PropsProps } from "../../Settings/Properties";
import { TemplateAdditional } from "./TemplateAdditional";
import { PropertiesPanel } from "../../Viewport/PropertiesPanel";
import { generateId } from "@/components/utils/generateId";

type TemplateProps = React.PropsWithChildren & {
  nodeTree: { rootNodeId: NodeId; nodes: { [nodeId: NodeId]: SerializedNode } };
  props: PropsProps[];
};

export const Template: UserComponent<Partial<TemplateProps>> = ({
  children,
  props,
  nodeTree,
}) => {
  const { query, actions, deserialize } = useEditor((state) => ({
    parseSerializedNode: (nodeId: string, node: any) => {
      return query
        .parseSerializedNode(node)
        .toNode((node) => (node.id = nodeId));
    },
    deserialize: (node: SerializedNode) => {
      return deserializeNode(node, state.options.resolver);
    },
  }));
  const {
    id,
    connectors: { connect },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));

  const dezerializedNodes = React.useMemo<{
    rootNodeId: NodeId;
    nodes: Record<string, Omit<NodeData, "event">>;
  }>(() => {
    const nodes: { [nodeId: NodeId]: Omit<NodeData, "event"> } = {};
    for (const id in nodeTree?.nodes) {
      let node = nodeTree.nodes[id];
      nodes[id] = deserialize(node as any);
    }
    return {
      nodes,
      rootNodeId: nodeTree?.rootNodeId as string,
    };
  }, [nodeTree, id]);

  const elements = React.useMemo<React.ReactNode>(() => {
    const rootNodeId = dezerializedNodes.rootNodeId;
    return createReactElements(rootNodeId, dezerializedNodes.nodes);
  }, [dezerializedNodes]);

  if (elements) return <div ref={(ref) => connect(ref as any)}>{elements}</div>;
  return <span ref={(ref) => connect(ref as any)}>{"Some child"}</span>;
};

Template.craft = {
  name: "Template",
  custom: {
    unique: generateId(),
    name: "Template",
    type: "template",
  },
  isCanvas: true,
  props: {
    nodeTree: undefined,
    props: [],
  },
  related: {
    settings: TemplateSettings,
    properties: PropertiesPanel,
  },
};

function createReactElements(
  nodeId: string,
  nodes: Record<string, Omit<NodeData, "event">>
): React.ReactNode {
  if (!nodeId) return null;
  const node = nodes[nodeId];
  const { type: Component, nodes: childNodeIds, custom } = node;
  const childElements = (childNodeIds || []).map((childNodeId) =>
    createReactElements(childNodeId, nodes)
  );

  const props = {
    ...node.props,
  };

  if (Component === NativeTag) props.as = custom.name;

  return (
    <Component key={nodeId} {...props}>
      {childElements}
    </Component>
  );
}
