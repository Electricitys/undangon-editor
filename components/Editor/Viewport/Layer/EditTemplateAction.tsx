import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditor } from "@craftjs/core";
import { useLayer } from "@craftjs/layers";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ChevronRight } from "lucide-react";
import { useViewportFrame } from "../Frames/Frame";
import { generateId } from "@/components/utils/generateId";

export const EditTemplateAction = () => {
  const { framePanel, frameHelper } = useViewportFrame();

  const { id } = useLayer((layer) => {
    return {
      expanded: layer.expanded,
    };
  });

  const { node } = useEditor((state, query) => ({
    node: query.node(id).get(),
  }));

  const handleEditTemplate = () => {
    frameHelper.push({
      id: generateId(),
      name: node.data.custom.name,
      content: JSON.stringify(node.data.props.nodeTree.nodes),
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
