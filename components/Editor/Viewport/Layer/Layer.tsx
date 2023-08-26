import { Collapsible } from "@/components/ui/collapsible";
import { useLayer } from "@craftjs/layers";
// import { useLayerManager } from "@craftjs/layers/lib/manager";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import React from "react";
import { LayerTrigger } from "./LayerHeader";

export const LayerRenderer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const {
    expanded,
    connectors: { layer },
  } = useLayer((layer) => {
    return {
      expanded: layer.expanded,
    };
  });

  return (
    <Collapsible open={expanded} className="pl-4" ref={layer as any}>
      <LayerTrigger />
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
};
