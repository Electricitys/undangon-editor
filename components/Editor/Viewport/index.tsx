"use client";

import {
  Editor,
  SerializedNode,
  serializeNode,
  useEditor,
} from "@craftjs/core";
export { ViewportFrame } from "./Frames/Frame";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { getCloneTree } from "../utils/getCloneTree";
import { useToast } from "@/components/ui/use-toast";
import { FontFaceProvider } from "../Nodes/Text/FontFaceProvider";
import {
  ViewportProvider,
  ViewportProviderProps,
  useViewport,
} from "./useViewport";
import { RenderNode } from "../Nodes/RenderNode";

import * as ResolverNodes from "../Nodes";
import { Toolbar } from "./Toolbar";
import { AdditionalPanel } from "./Additional";
import { LayerPanel } from "./Layer";
import { SettingPanel } from "./Settings";
import { TemplatesPanel } from "./Templates";
import { ViewportFrameProvider } from "./Frames/Frame";
import { FramesPanel } from "./Frames";
import { PropertiesPanel } from "./PropertiesPanel";
import { Toaster } from "@/components/ui/toaster";
import { TemplateNodeManagerProvider } from "../Nodes/Template/useTemplateNodeManager";
import { PropertiesPanelSimple } from "./PropertiesPanel/simple";
// import * as ResolverComponents from "../Components";

type ViewportWrapperProps = {
  children: ReactNode;
  enableToolbar?: boolean;
  mode?: "advanced" | "simple";
};

interface ViewportProps extends ViewportProviderProps, ViewportWrapperProps {}

export const ViewportWrapper: FC<ViewportWrapperProps> = ({
  children,
  enableToolbar = true,
  mode = "advanced",
}) => {
  const { toast } = useToast();
  const { media } = useViewport();
  const {
    connectors,
    actions,
    selected,
    isSelected,
    parseSerializedNode,
    getSerializedNodeById,
    getNodeById,
    getParentNodeById,
    getCloneNodeById,
  } = useEditor((state, query) => {
    const selected = state.events.selected;
    const [currentNodeId] = selected;
    return {
      selected,
      isSelected: typeof currentNodeId === "string",
      parseSerializedNode: (nodeId: string, serializedNode: SerializedNode) => {
        return query
          .parseSerializedNode(serializedNode)
          .toNode((node) => (node.id = nodeId));
      },
      getSerializedNodeById: (nodeId: string) => {
        const nodeTree = getCloneTree(query, nodeId);
        const serialized: any = { rootNodeId: nodeTree.rootNodeId, nodes: {} };
        for (const node in nodeTree.nodes) {
          serialized.nodes[node] = serializeNode(
            nodeTree.nodes[node].data,
            state.options.resolver
          );
        }
        return JSON.stringify(serialized);
      },
      getNodeById: (nodeId: string) => query.node(nodeId),
      getParentNodeById: (nodeId: string) =>
        query.node(nodeId).get().data.parent,
      getCloneNodeById: (nodeId: string) => getCloneTree(query, nodeId),
    };
  });

  const duplicateNode = useCallback(() => {
    const [selectedNodeId] = selected;
    if (!selectedNodeId) return;
    const freshNode = getCloneNodeById(selectedNodeId);
    const parent = getParentNodeById(selectedNodeId);
    actions.addNodeTree(freshNode, parent as any);
  }, [selected]);

  const copyNode = useCallback(async () => {
    if (typeof window === "undefined") return;
    const [selectedNodeId] = selected;
    if (!selectedNodeId) return;
    if (selectedNodeId === "ROOT") return;
    const freshNode = getSerializedNodeById(selectedNodeId);
    const data = [
      new ClipboardItem({
        ["web text/undangon"]: new Blob([freshNode], {
          type: "web text/undangon",
        }),
        // ["text/plain"]: new Blob([freshNode], { type: "text/plain" }),
      }),
    ];
    try {
      await window.navigator.clipboard.write(data);
      toast({
        description: `Node ${selectedNodeId} was copied`,
        variant: "default",
      });
    } catch (err) {
      console.error(err);
      toast({
        description: `Node cannot copied`,
      });
    }
  }, [selected]);

  const pasteNode = useCallback(
    async (e: any) => {
      if (typeof window === "undefined") return;
      let [selectedNodeId] = selected;
      if (!selectedNodeId) selectedNodeId = "ROOT";
      const items = await window.navigator.clipboard.read();
      let nodeTree = null;
      try {
        for (const item of items) {
          for (const type of item.types) {
            if (type === "web text/undangon") {
              nodeTree = JSON.parse(await (await item.getType(type)).text());
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
      if (!nodeTree) return;
      for (const node in nodeTree.nodes) {
        nodeTree.nodes[node] = parseSerializedNode(node, nodeTree.nodes[node]);
      }
      actions.addNodeTree(nodeTree, selectedNodeId);
    },
    [selected]
  );

  useHotkeys("ctrl+c", copyNode);
  useHotkeys("ctrl+v", pasteNode);
  useHotkeys("ctrl+d", () => duplicateNode());
  useHotkeys("ctrl+shift+z", () => actions.history.redo());
  useHotkeys("ctrl+z", () => actions.history.undo());
  useHotkeys("del", (e: any) => {
    const [selectedNodeId] = selected;
    if (!selectedNodeId) return;
    const node = getNodeById(selectedNodeId);
    if (node.isDeletable()) {
      actions.delete(selectedNodeId);
    }
  });

  if (!enableToolbar) {
    return children;
  }

  return (
    <>
      <div tabIndex={0}>
        <div className="fixed inset-0 bg-gray-200" />
        <div
          className="page-container pt-16 mr-72 ml-72 min-h-screen relative"
          ref={(ref) =>
            connectors.select(
              connectors.hover(ref as any, null as any),
              null as any
            )
          }
        >
          <div className="prevent-select editor-renderer bg-gray-200">
            <div className="py-4 px-2">
              <div
                className="relative mx-auto bg-white after:border-b-1 after:border-dashed after:border-red-400 after:w-full after:top-1/2"
                style={{
                  maxWidth: media.currentMedia.width,
                  transition: "max-width 500ms ease",
                }}
              >
                {children}
                <div className="absolute bottom-full left-0">
                  {media.currentMedia.width} x {media.currentMedia.height}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed top-0 left-0 bottom-0 pt-14 overflow-auto w-72 border-r border-gray-300 bg-white">
          <FramesPanel />
          <TemplatesPanel />
          <AdditionalPanel />
          {/* <ComponentPanel /> */}
          <LayerPanel />
        </div>
        <div className="fixed top-0 right-0 bottom-0 pt-14 overflow-auto w-72 border-l border-gray-300 bg-white pb-32">
          {isSelected}
          {isSelected ? (
            <SettingPanel />
          ) : mode === "advanced" ? (
            <PropertiesPanel />
          ) : (
            <PropertiesPanelSimple />
          )}
        </div>
        <div className="border-b border-gray-300 fixed right-0 left-0 top-0 bg-white">
          <Toolbar />
        </div>
      </div>
    </>
  );
};

export const Viewport: FC<ViewportProps> = ({
  children,
  enableToolbar,
  mode,
  ...props
}) => {
  const { isProduction } = props;
  if (isProduction) {
    return (
      <Editor
        enabled={false}
        resolver={{
          ...ResolverNodes,
          // ...ResolverComponents,
        }}
      >
        <FontFaceProvider>
          <ViewportProvider isProduction={true}>
            <ViewportFrameProvider>
              <TemplateNodeManagerProvider>
                {children}
              </TemplateNodeManagerProvider>
            </ViewportFrameProvider>
          </ViewportProvider>
        </FontFaceProvider>
      </Editor>
    );
  }
  return (
    <Editor
      resolver={{
        ...ResolverNodes,
        // ...ResolverComponents,
      }}
      onRender={RenderNode}
    >
      <FontFaceProvider>
        <ViewportProvider {...props}>
          <Toaster />
          <ViewportFrameProvider>
            <TemplateNodeManagerProvider>
              <ViewportWrapper mode={mode} enableToolbar={enableToolbar}>
                {children}
              </ViewportWrapper>
            </TemplateNodeManagerProvider>
          </ViewportFrameProvider>
        </ViewportProvider>
      </FontFaceProvider>
    </Editor>
  );
};
