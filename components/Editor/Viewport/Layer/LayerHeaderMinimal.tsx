import { useLayer } from "@craftjs/layers";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEditor } from "@craftjs/core";
import { EditTemplateAction } from "./EditTemplateAction";
import { TemplateNode } from "../../Nodes";
import React from "react";
import { LayerActions } from "./LayerActions";

export const LayerTriggerMinimal = () => {
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
      className={`flex w-full text-start px-0 items-center  ${
        isHovered ? "bg-accent" : ""
      } ${selected ? "bg-blue-200 hover:bg-blue-300" : ""}`}
    >
      <div>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="shrink-0 hover:bg-gray-200"
          onClick={() => {
            actions.setHidden(id, !hidden);
          }}
        >
          {hidden ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </Button>
        <div
          style={{ width: 1 }}
          className="grow shrink flex items-center pr-3"
        >
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
              <div
                onDoubleClick={() => setIsEditing(true)}
                style={{ minWidth: 1 }}
                className="shrink whitespace-nowrap text-sm text-ellipsis overflow-hidden"
                title={displayName}
              >
                {displayName}
              </div>
              {hasChildCanvases && (
                <CollapsibleTrigger asChild onClick={() => toggleLayer()}>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="shrink-0 hover:bg-gray-200 rounded-full h-6 w-6 p-0 ml-1"
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
        {!isEditing && isTemplateNode && <EditTemplateAction />}
        {!isEditing && <LayerActions />}
      </div>
    </Button>
  );
};
