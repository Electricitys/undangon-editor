import { useLayer } from "@craftjs/layers";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEditor } from "@craftjs/core";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const LayerTrigger = () => {
  const {
    id,
    expanded,
    connectors: { drag, layer },
    actions: { toggleLayer },
  } = useLayer((layer) => {
    return {
      expanded: layer.expanded,
    };
  });

  const { displayName, hidden, actions, hasChildCanvases, isHovered } =
    useEditor((state, query) => {
      const node = query.node(id);
      const nodeRaw = node.get();
      const sNode = state.nodes[id];
      // console.log(id, node.get());

      return {
        isHovered: node.isHovered(),
        hasChildCanvases: nodeRaw.data.nodes.length > 0,
        displayName:
          sNode.data.custom.name ||
          (sNode && sNode.data.custom.displayName
            ? sNode.data.custom.displayName
            : sNode.data.displayName),
        hidden: sNode && sNode.data.hidden,
      };
    });
  return (
    <Button
      asChild
      variant={"ghost"}
      className={`flex w-full text-start px-0 items-center ${
        isHovered ? "bg-accent" : ""
      }`}
    >
      <div
        ref={(ref) => {
          layer(ref as any);
          drag(ref as any);
        }}
      >
        <Button
          size={"sm"}
          variant={"ghost"}
          className="hover:bg-gray-200"
          onClick={() => {
            actions.setHidden(id, !hidden);
          }}
        >
          {hidden ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </Button>
        <div className="grow flex items-center">
          <div className="text-sm">{displayName}</div>
          {hasChildCanvases && (
            <CollapsibleTrigger asChild onClick={() => toggleLayer()}>
              <Button
                size={"sm"}
                variant={"ghost"}
                className="hover:bg-gray-200 rounded-full h-6 w-6 p-0 ml-1"
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          )}
        </div>

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
            <DropdownMenuItem>
              <span>Add Before</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Add Child</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Add After</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size={"sm"}
              variant={"ghost"}
              className="hover:bg-gray-200 p-0 h-7 w-7 mr-1"
            >
              <TrashIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem color="red">
              <TrashIcon className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Button>
  );
};
