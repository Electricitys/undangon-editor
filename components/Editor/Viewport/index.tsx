"use client";

import {
  DerivedCoreEventHandlers,
  Editor,
  SerializedNode,
  serializeNode,
  useEditor,
} from "@craftjs/core";
export { ViewportFrame } from "./Frames/Frame";
import { FC, ReactNode, useCallback, useEffect, useMemo } from "react";
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
import { ProductionRenderNode } from "../Nodes/RenderNode/ProductionRenderNode";
// import * as ResolverComponents from "../Components";
import styles from "./viewport.module.css";
import { useMediaDevices, usePrevious } from "react-use";
import { useMediaQuery } from "@mantine/hooks";
import { useMediaSizing } from "../utils/useMediaSizing";
import { cn } from "@/lib/utils";

type ViewportWrapperProps = {
  children: ReactNode;
  enableToolbar?: boolean;
};

interface ViewportProps extends ViewportProviderProps, ViewportWrapperProps {}

export const ViewportWrapper: FC<ViewportWrapperProps> = ({
  children,
  enableToolbar = true,
}) => {
  const mediaSizing = useMediaSizing();
  const previewMediaSizingLG = usePrevious(mediaSizing.lg);
  const { toast } = useToast();
  const { media, mode, containerRef, barState } = useViewport();
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
  useHotkeys("ctrl+d", (e) => {
    e.preventDefault();
    duplicateNode();
  });
  useHotkeys("ctrl+shift+z", () => actions.history.redo());
  useHotkeys("ctrl+z", () => actions.history.undo());
  useHotkeys(["delete", "backspace"], (e: any) => {
    const [selectedNodeId] = selected;
    if (!selectedNodeId) return;
    const node = getNodeById(selectedNodeId);
    if (node.isDeletable()) {
      actions.delete(selectedNodeId);
    }
  });

  useEffect(() => {
    if (previewMediaSizingLG !== mediaSizing.lg) {
      if (mediaSizing.lg) {
        barState.left.toggle(true);
        barState.right.toggle(true);
      } else {
        barState.left.toggle(false);
        barState.right.toggle(false);
      }
    }
  }, [previewMediaSizingLG, mediaSizing.lg]);

  if (!enableToolbar) {
    return children;
  }

  return (
    <>
      <div tabIndex={0}>
        <div className="fixed inset-0 bg-gray-200" />
        <div
          className={cn(
            "page-container pointer-events-auto pt-16 min-h-screen relative transition-padding duration-500 ease-in-out",
            mediaSizing.lg && [
              barState.left.visible && "pl-72",
              barState.right.visible && "pr-72",
            ]
          )}
          ref={(ref) => {
            connectors.select(
              connectors.hover(ref as any, null as any),
              null as any
            );
          }}
        >
          <div className="prevent-select editor-renderer bg-gray-200">
            <div className="py-4 px-2">
              <div
                className={`${styles["transparent-pattern-bg"]} relative mx-auto after:border-b-1 after:border-dashed after:border-red-400 after:w-full after:top-1/2`}
                style={{
                  maxWidth: media.currentMedia.width,
                  transition: "max-width 500ms ease",
                }}
              >
                <div
                  className="relative"
                  ref={containerRef}
                  style={{
                    minHeight: media.currentMedia.height,
                    transition: "min-height 500ms ease",
                  }}
                >
                  {children}
                </div>
                <div className="absolute bottom-full left-0">
                  {media.currentMedia.width} x {media.currentMedia.height}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "fixed pointer-events-auto z-50 scrollbar-thin hover:scrollbar-thumb-gray-300 scrollbar-thumb-gray-200 top-0 left-0 bottom-0 pt-14 overflow-auto w-72 border-r border-gray-300 bg-white transition-left duration-500 ease-in-out",
            !barState.left.visible && "-left-72"
          )}
        >
          <FramesPanel />
          {/* <TemplatesPanel /> */}
          <AdditionalPanel />
          {/* <ComponentPanel /> */}
          <LayerPanel />
        </div>
        <div
          className={cn(
            "fixed pointer-events-auto z-50 scrollbar-thin hover:scrollbar-thumb-gray-300 scrollbar-thumb-gray-200 top-0 right-0 bottom-0 pt-14 overflow-auto w-72 border-l border-gray-300 bg-white transition-right duration-500 ease-in-out",
            !barState.right.visible && "-right-72",
            "pb-48"
          )}
        >
          {isSelected ? (
            <SettingPanel />
          ) : mode.current === "advanced" ? (
            <PropertiesPanel />
          ) : (
            <PropertiesPanelSimple />
          )}
        </div>
        <div className="border-b pointer-events-auto z-50 border-gray-300 fixed right-0 left-0 top-0 bg-white">
          <Toolbar />
        </div>
      </div>
    </>
  );
};

export const Viewport: FC<ViewportProps> = ({
  children,
  enableToolbar,
  ...props
}) => {
  const { isProduction, defaultMode } = props;
  if (isProduction) {
    return (
      <Editor
        enabled={false}
        resolver={{
          ...ResolverNodes,
          // ...ResolverComponents,
        }}
        onRender={ProductionRenderNode}
      >
        <FontFaceProvider>
          <ViewportProvider defaultMode={defaultMode} isProduction={true}>
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
              <ViewportWrapper enableToolbar={enableToolbar}>
                {children}
              </ViewportWrapper>
            </TemplateNodeManagerProvider>
          </ViewportFrameProvider>
        </ViewportProvider>
      </FontFaceProvider>
    </Editor>
  );
};
