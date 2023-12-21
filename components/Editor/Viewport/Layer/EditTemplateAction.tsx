import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NodeData, NodeId, useEditor } from "@craftjs/core";
import { useLayer } from "@craftjs/layers";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ChevronRight } from "lucide-react";
import { useViewportFrame } from "../Frames/Frame";
import { useViewport } from "../useViewport";

export const EditTemplateAction = () => {
  const { frameHelper } = useViewportFrame();

  const { mode } = useViewport();

  const { id } = useLayer((layer) => {
    return {
      expanded: layer.expanded,
    };
  });

  const { node, query } = useEditor((state, query) => ({
    node: query.node(id).get(),
  }));

  const handleEditTemplate = () => {
    let frameId = id;
    frameHelper.push({
      id: frameId,
      name: node.data.custom.name,
      content: JSON.stringify(node.data.props.nodeTree.nodes),
      properties: node.data.props.props,
      defaultMode: "advanced",
      handler: {
        async onBack(target, value, helper) {
          const targetContent: Record<NodeId, NodeData> = await JSON.parse(
            helper.get(target).content
          );
          const content = targetContent[frameId];
          const newContent = {
            ...targetContent,
            [frameId]: {
              ...content,
              props: {
                ...content.props,
                props: helper.get(frameId).properties,
                nodeTree: {
                  rootNodeId: "ROOT",
                  nodes: await JSON.parse(value),
                },
              },
            },
          };
          await helper.update(target, await JSON.stringify(newContent));
        },
      },
      templates: [],
      _updatedAt: Date.now(),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="hover:bg-gray-200 p-0 h-7 w-7 mr-1"
        >
          <Pencil1Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem color="red" onClick={handleEditTemplate}>
          <span>Open Editor</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
