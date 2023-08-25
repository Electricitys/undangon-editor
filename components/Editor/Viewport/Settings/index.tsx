import { useEditor } from "@craftjs/core";
import { createElement } from "react";
import { PanelSection } from "../PanelSection";
import { Badge } from "@/components/ui/badge";

export const SettingPanel = () => {
  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    const currentNode = state.nodes[currentNodeId];
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: currentNode.data.name,
        settings: currentNode.related && currentNode.related.settings,
        component_type:
          typeof currentNode.data.type === "string" ? "tag" : "component",
      };
    }
    return {
      selected,
    };
  });

  if (!selected) {
    return (
      <div className="text-center py-4 text-gray-500">
        Select any nodes to start editing
      </div>
    );
  }

  return (
    <PanelSection
      text={selected?.name}
      lock={true}
      defaultOpen={true}
      action={<Badge variant={"outline"}>{selected.component_type}</Badge>}
    >
      <div
        style={{
          minHeight: 280,
        }}
      >
        <div>{selected.settings && createElement(selected.settings)}</div>
      </div>
    </PanelSection>
  );
};
