import { Collapsible } from "@/components/ui/collapsible";
import { useEditor } from "@craftjs/core";
import { useLayer } from "@craftjs/layers";
// import { useLayerManager } from "@craftjs/layers/lib/manager";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import React from "react";
import { LayerTrigger } from "./LayerHeader";

export const LayerRenderer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { expanded } = useLayer((layer) => {
    return {
      expanded: layer.expanded,
    };
  });

  return (
    <Collapsible open={expanded} className="pl-4 pr-2">
      <LayerTrigger />
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
};
