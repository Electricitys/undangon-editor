"use client";

import {
  Node,
  NodeData,
  NodeId,
  NodeTree,
  Resolver,
  SerializedNode,
  UserComponent,
  serializeNode,
  useEditor,
  useEditorReturnType,
  useNode,
} from "@craftjs/core";
import React, { useContext, useEffect, useState } from "react";
import { deserializeNode } from "../../utils/deserializeNode";
import _sortBy from "lodash/sortBy";
import _get from "lodash/get";
import _set from "lodash/set";
import _uniq from "lodash/uniq";
import { NativeTag } from "../NativeTag";
import { TemplateSettings } from "./TemplateSetting";
import { Properties } from "../../Settings/Properties";
import { PropertiesPanel } from "../../Viewport/PropertiesPanel";
import { TemplateRenderer } from "./TemplateRenderer";
import { useViewportFrame } from "../../Viewport/Frames/Frame";
import { useList } from "react-use";
import { ListActions } from "react-use/lib/useList";
import { useTemplateNodeManager } from "./useTemplateNodeManager";
import {
  InternalTemplateProvider,
  useInternalTemplate,
} from "./useInternalTemplate";
import { Slot } from "../Slot";

export type Template = React.PropsWithChildren & {
  nodeTree: { rootNodeId: NodeId; nodes: { [nodeId: NodeId]: SerializedNode } };
  props: Properties[];
  _parentTemplateId?: NodeId;
  _node: {
    id: NodeId;
    data: SerializedNode;
    _hydrationTimestamp: number;
    _parentTemplateId?: NodeId;
  };
};

export const TemplateNode: UserComponent<Partial<Template>> = (props) => {
  const { query } = useEditor();
  const { id } = useNode();

  const { setTemplate } = useTemplateNodeManager();

  let _node: Template["_node"] = {
    id: props._node?.id || id,
    data: props._node?.data || query.node(id).toSerializedNode(),
    _hydrationTimestamp:
      props._node?._hydrationTimestamp ||
      query.node(id).get()._hydrationTimestamp,
    _parentTemplateId: props._parentTemplateId,
  };

  React.useEffect(() => {
    setTemplate(_node.id, _node);
  }, [_node._hydrationTimestamp]);

  return (
    <InternalTemplateProvider id={_node.id}>
      <TemplateWrapper {...props} _node={_node} />
    </InternalTemplateProvider>
  );
};

export const TemplateWrapper: UserComponent<
  Partial<Template> & {
    _node: Template["_node"];
  }
> = ({ children, props, nodeTree, _node }) => {
  const internalTemplate = useInternalTemplate();
  const _properties = internalTemplate.parentProperties;
  const { query, actions, deserialize, nodeResolver } = useEditor((state) => ({
    nodeResolver: state.options.resolver,
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

  // const parentTemplate = useParentTemplate();

  const dezerializedNodes = React.useMemo<{
    rootNodeId: NodeId;
    nodes: Record<string, Omit<NodeData, "event">>;
  }>(() => {
    const nodes: { [nodeId: NodeId]: Omit<NodeData, "event"> } = {};
    for (const nodeId in nodeTree?.nodes) {
      let node = nodeTree.nodes[nodeId];
      nodes[nodeId] = deserialize(node as any);
    }
    return {
      nodes,
      rootNodeId: nodeTree?.rootNodeId as string,
    };
  }, [nodeTree]);

  const elements = React.useMemo<React.ReactNode | null>(() => {
    const rootNodeId = dezerializedNodes.rootNodeId;
    const El = createReactElements(
      _node.id,
      _node.data,
      rootNodeId,
      dezerializedNodes.nodes,
      _properties,
      nodeResolver,
      children
    );
    return El;
  }, [_node, dezerializedNodes, children]);

  if (elements) return <div ref={(ref) => connect(ref as any)}>{elements}</div>;
  return <span ref={(ref) => connect(ref as any)}>{"Some child"}</span>;
};

TemplateNode.craft = {
  name: "Template",
  custom: {
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
  templateId: string,
  templateNode: SerializedNode,
  nodeId: string,
  nodes: Record<string, Omit<NodeData, "event">>,
  properties: Properties[],
  resolver: Resolver,
  children: React.ReactNode
) {
  if (!nodeId) return null;
  const node = nodes[nodeId];
  const { type: Component, nodes: childNodeIds, custom } = node;
  const template = { id: templateId, node: templateNode };
  const childElements = (childNodeIds || []).map((childNodeId) => {
    return createReactElements(
      template.id,
      template.node,
      childNodeId,
      nodes,
      properties,
      resolver,
      children
    );
  });

  const props = {
    ...node.props,
  };

  if (Component === TemplateNode) {
    props._node = {
      id: nodeId,
      data: serializeNode(node, resolver),
    };
    props._parentTemplateId = templateId;
  }

  if (Component === NativeTag) props.as = custom.name;

  if (Component === Slot) return children;

  return (
    <TemplateRenderer
      key={nodeId}
      asChild
      template={template}
      properties={properties}
      node={node}
      {...props}
    >
      <Component>{childElements}</Component>
    </TemplateRenderer>
  );
}
