import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLayer } from "@craftjs/layers";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ChevronRight, TrashIcon } from "lucide-react";

export const EditTemplateAction = () => {
  const { id } = useLayer((layer) => {
    return {
      expanded: layer.expanded,
    };
  });

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
        <DropdownMenuItem color="red" onClick={() => console.log("Edit", id)}>
          <span>Open Editor</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
