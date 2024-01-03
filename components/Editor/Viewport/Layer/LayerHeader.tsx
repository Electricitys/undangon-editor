import { useLayer } from "@craftjs/layers";
import { EyeClosedIcon, EyeOpenIcon, TrashIcon } from "@radix-ui/react-icons";
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
import { AddNodeAction } from "./AddNodeAction";
import { EditTemplateAction } from "./EditTemplateAction";
import { TemplateNode } from "../../Nodes";
import React from "react";

export const LayerTrigger = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const {
    id,
    expanded,
    connectors: { drag, layerHeader },
    actions: { toggleLayer },
  } = useLayer((layer) => {
    return {
      expanded: layer.expanded,
    };
  });

  const {
    displayName,
    hidden,
    actions,
    hasChildCanvases,
    isHovered,
    selected,
    isTemplateNode,
  } = useEditor((state, query) => {
    const node = query.node(id);
    const nodeRaw = node.get();
    const sNode = state.nodes[id];
    const selected = query.getEvent("selected").first() === id;

    let isTemplateNode = false;
    if (nodeRaw && nodeRaw.data)
      isTemplateNode = nodeRaw.data.type === TemplateNode;

    return {
      selected,
      isTemplateNode,
      isHovered: node.isHovered(),
      hasChildCanvases: nodeRaw.data.nodes.length > 0,
      displayName:
        sNode.data.custom.alias ||
        (sNode && sNode.data.custom.name
          ? sNode.data.custom.name
          : sNode.data.displayName),
      hidden: sNode && sNode.data.hidden,
    };
  });

  React.useEffect(() => {
    if (!inputRef.current) return;
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <Button
      asChild
      ref={(ref: any) => {
        drag(ref);
        layerHeader(ref);
      }}
      variant={"ghost"}
      onDoubleClick={() => setIsEditing(true)}
      className={`flex w-full text-start px-0 items-center  ${
        isHovered ? "bg-accent" : ""
      } ${selected ? "bg-blue-200 hover:bg-blue-300" : ""}`}
    >
      <div>
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
        <div className="grow flex items-center mr-3">
          {isEditing ? (
            <input
              ref={inputRef}
              className="text-sm w-full"
              defaultValue={displayName}
              onChange={(e) =>
                actions.setCustom(id, (custom) => {
                  custom.alias = e.target.value;
                })
              }
              onBlur={() => setIsEditing(false)}
            />
          ) : (
            <>
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
            </>
          )}
        </div>
        {isTemplateNode && <EditTemplateAction />}
        {!isEditing && (
          <>
            <AddNodeAction />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={id === "ROOT"}
                  size={"sm"}
                  variant={"ghost"}
                  className="hover:bg-gray-200 p-0 h-7 w-7 mr-1"
                >
                  <TrashIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  color="red"
                  onClick={() => actions.delete(id)}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </Button>
  );
};
