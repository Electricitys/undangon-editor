import { NodeTree, serializeNode, useEditor } from "@craftjs/core";
import { PanelSection } from "../PanelSection";
import { Button } from "@/components/ui/button";
import { LayersIcon, PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { Input } from "@/components/ui/input";
import { useList } from "react-use";
import { generateId } from "@/components/utils/generateId";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getCloneTree } from "../../utils/getCloneTree";
import * as ResolverNodes from "../../Nodes";
import { deserializeNode } from "../../utils/deserializeNode";
import { useViewport } from "../useViewport";

export type TemplateProps = {
  id: string;
  name: string;
  nodeTree: NodeTree;
};

export const TemplatesPanel = () => {
  const { query, selected, serializeNodeById } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    const currentNode = state.nodes[currentNodeId];
    let selected;
    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: currentNode.data.custom.name || currentNode.data.name,
        props: currentNode.data.props,
        type: currentNode.data.custom.type,
        node: currentNode,
        isTemplateNode: currentNode.data.type === ResolverNodes.Template,
      };
    }
    return {
      selected,
      resolver: state.options.resolver,
      serializeNodeById: (id: string) => {
        const nodeTree = getCloneTree(query, id);
        const serialized: any = {
          rootNodeId: nodeTree.rootNodeId,
          nodes: {},
        };
        for (const node in nodeTree.nodes) {
          serialized.nodes[node] = serializeNode(
            nodeTree.nodes[node].data,
            state.options.resolver
          );
        }
        // Object.setPrototypeOf(serialized, {
        //   toJSON: () => JSON.stringify(serialized),
        // });
        return serialized;
      },
    };
  });
  const { templates: items, templatesHelper: itemsHelper } = useViewport();

  const handleAddTemplate = () => {
    if (!selected) return;
    const cloneNode = serializeNodeById(selected.id);
    itemsHelper.push({
      id: generateId(),
      name: "New Template",
      nodeTree: cloneNode,
    });
  };

  return (
    <PanelSection
      text="Templates"
      // description="Input props that this component exposes"
      action={
        selected && (
          <Button
            disabled={selected.isTemplateNode}
            size={"icon"}
            variant={"ghost"}
            className="h-6 w-6"
            onClick={(e) => {
              e.preventDefault();
              handleAddTemplate();
            }}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        )
      }
    >
      <div className="pl-4 pr-2">
        {items.length === 0 && (
          <div className="text-gray-400 text-sm mb-4">
            No template available yet
          </div>
        )}
        <div style={{ marginTop: 0 }}>
          {items.map((field, index: number) => {
            return (
              <div key={field.id} className={`flex mb-2`}>
                <Button variant={"ghost"} className="w-full justify-start">
                  <LayersIcon className="mr-2 h-4 w-4" />
                  <span>{field.name}</span>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </PanelSection>
  );
};
