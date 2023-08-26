import { useLayer } from "@craftjs/layers";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEditor } from "@craftjs/core";

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
      // console.log(id, node.get());

      return {
        isHovered: node.isHovered(),
        hasChildCanvases: nodeRaw.data.nodes.length > 0,
        displayName:
          state.nodes[id] && state.nodes[id].data.custom.displayName
            ? state.nodes[id].data.custom.displayName
            : state.nodes[id].data.displayName,
        hidden: state.nodes[id] && state.nodes[id].data.hidden,
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
        <div className="grow text-sm">{displayName}</div>
        {hasChildCanvases && (
          <CollapsibleTrigger asChild onClick={() => toggleLayer()}>
            <Button size={"sm"} variant={"ghost"} className="hover:bg-gray-200">
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        )}
      </div>
    </Button>
  );
};
