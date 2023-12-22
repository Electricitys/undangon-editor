import {
  NodeId,
  SerializedNodes,
  serializeNode,
  useEditor,
} from "@craftjs/core";
import { PanelSection } from "../PanelSection";
import { Button } from "@/components/ui/button";
import {
  ChevronRightIcon,
  LayersIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import React from "react";
import { generateId } from "@/components/utils/generateId";
import { getCloneTree } from "../../utils/getCloneTree";
import * as ResolverNodes from "../../Nodes";
import { AddTemplateDialog } from "./AddDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Properties } from "../../Settings/Properties";
import { useViewportFrameTemplates } from "../Frames/Frame";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SerializedNodeWithTemplates = {
  rootNodeId: NodeId;
  nodes: SerializedNodes;
  templates: Template[];
};

export type Template = {
  id: string;
  name: string;
  thumbnail: string;
  nodeTree: SerializedNodeWithTemplates;
  properties: Properties[];
};

export const TemplatesPanel = () => {
  const [isOpen, setIsOpen] = React.useState(false);
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
        isTemplateNode: currentNode.data.type === ResolverNodes.TemplateNode,
      };
    }
    return {
      selected,
      resolver: state.options.resolver,
      serializeNodeById: (id: string) => {
        const nodeTree = getCloneTree(query, id);
        const serialized: SerializedNodeWithTemplates = {
          rootNodeId: nodeTree.rootNodeId,
          nodes: {},
          templates: [],
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
  const { templates: items, helper: itemsHelper } = useViewportFrameTemplates();

  const handleAddTemplate = (name: string) => {
    if (!selected) return;
    const cloneNode = serializeNodeById(selected.id);
    cloneNode.nodes[cloneNode.rootNodeId].parent = null;
    const nodeTree = JSON.parse(
      JSON.stringify(cloneNode).replaceAll(cloneNode.rootNodeId, "ROOT")
    );
    const newTemplate: Template = {
      id: generateId(),
      name: name,
      nodeTree,
      properties: [],
      thumbnail: "https://placehold.co/150x150/EEE/31343C",
    };
    itemsHelper.push(newTemplate);
    setIsOpen(false);
  };

  return (
    <>
      <PanelSection
        text="Presets"
        description="Reusable preset to make your editing easier"
        action={
          selected && (
            <>
              <Button
                disabled={selected!.isTemplateNode}
                size={"icon"}
                variant={"ghost"}
                className="h-6 w-6"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(true);
                }}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </>
          )
        }
      >
        <div className="pl-4 pr-2">
          {items.length === 0 && (
            <div className="text-gray-400 text-sm mb-4">
              No preset available yet
            </div>
          )}
          <div style={{ marginTop: 0 }}>
            <TooltipProvider delayDuration={200}>
              {items.map((field, index: number) => {
                return (
                  <div key={field.id} className={`flex mb-2`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          asChild
                          variant={"ghost"}
                          className="w-full justify-start flex"
                        >
                          <div>
                            <LayersIcon className="mr-2 h-4 w-4" />
                            <div className="grow text-left">{field.name}</div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size={"sm"}
                                  variant={"ghost"}
                                  className="hover:bg-gray-200 p-0 h-7 w-7 mr-1"
                                  onClick={() => {}}
                                >
                                  <TrashIcon />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  color="red"
                                  onClick={() => itemsHelper.remove(index)}
                                >
                                  <TrashIcon className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <ChevronRightIcon />
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <img
                          src={
                            field.thumbnail ||
                            "https://placehold.co/150x150/EEE/31343C"
                          }
                        />
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </TooltipProvider>
          </div>
        </div>
      </PanelSection>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
        }}
      >
        <DialogContent
          tabIndex={-1}
          onFocus={(e) => {
            e.preventDefault();
          }}
        >
          <AddTemplateDialog onSubmit={handleAddTemplate} />
        </DialogContent>
      </Dialog>
    </>
  );
};
