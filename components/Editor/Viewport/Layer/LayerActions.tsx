import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLayer } from "@craftjs/layers";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { PlusIcon, TrashIcon } from "lucide-react";
import { AddNodeActionDialog } from "./AddNodeActionDialog";
import { useEditor } from "@craftjs/core";
import React from "react";

export const LayerActions = () => {
  const { id } = useLayer((layer) => {
    return {
      expanded: layer.expanded,
    };
  });

  const { actions } = useEditor();

  const [isDialogOpen, setIsDialogOpen] = React.useState<"action" | null>(null);
  const [addNodeTarget, setAddNodeTarget] = React.useState<
    "before" | "after" | "child" | null
  >(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={id === "ROOT"}
            size={"sm"}
            variant={"ghost"}
            className="hover:bg-gray-200 p-0 h-7 w-7 mr-1"
          >
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  <span>Insert</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setAddNodeTarget("before");
                        setIsDialogOpen("action");
                      }}
                    >
                      <span>Before</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setAddNodeTarget("child");
                        setIsDialogOpen("action");
                      }}
                    >
                      <span>Child</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setAddNodeTarget("after");
                        setIsDialogOpen("action");
                      }}
                    >
                      <span>After</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            {/* <AddNodeAction /> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem color="red" onClick={() => actions.delete(id)}>
              <TrashIcon className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      <AddNodeActionDialog
        isOpen={isDialogOpen === "action"}
        onClose={() => {
          setIsDialogOpen(null);
        }}
        onSubmit={() => {
          setAddNodeTarget(null);
          setIsDialogOpen(null);
        }}
        target={"before"}
      />
    </>
  );
};
