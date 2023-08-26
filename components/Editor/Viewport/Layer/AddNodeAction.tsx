import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusIcon } from "@radix-ui/react-icons";
import { getCloneTree } from "../../utils/getCloneTree";
import { useEditor } from "@craftjs/core";
import { useLayer } from "@craftjs/layers";

export const AddNodeAction = () => {
  const { id } = useLayer();
  const { actions, query, selected } = useEditor((state, query) => ({
    nodes: state.nodes,
    selected: query.node(id),
  }));

  const handleAction = (type: "before" | "after" | "child") => {
    const freshNode = getCloneTree(query, id);
    const node = selected.get();
    const parent = query.node(node.data.parent as any).get();
    const indexOf = parent.data.nodes.indexOf(id);

    switch (type) {
      case "before":
        actions.addNodeTree(freshNode, parent.id, indexOf);
        break;
      case "after":
        actions.addNodeTree(freshNode, parent.id, indexOf + 1);
        break;
      case "child":
        actions.addNodeTree(freshNode, id);
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="hover:bg-gray-200 p-0 h-7 w-7"
        >
          <PlusIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {id !== "ROOT" && (
          <DropdownMenuItem onClick={() => handleAction("before")}>
            <span>Add Before</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleAction("child")}>
          <span>Add Child</span>
        </DropdownMenuItem>
        {id !== "ROOT" && (
          <DropdownMenuItem onClick={() => handleAction("after")}>
            <span>Add After</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
