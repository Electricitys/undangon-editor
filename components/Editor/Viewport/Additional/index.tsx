import { useEditor } from "@craftjs/core";
import { PanelSection } from "../PanelSection";
import React, { createElement } from "react";
import _pick from "lodash/pick";
import _set from "lodash/set";

export const AdditionalPanel: React.FC = ({}) => {
  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    const currentNode = state.nodes[currentNodeId];
    let selected;
    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: currentNode.data.custom.name || currentNode.data.name,
        additional: currentNode.related && currentNode.related.additional,
        component_type: currentNode.data.custom.type,
      };
    }
    return {
      selected,
    };
  });

  if (!selected) return null;
  if (!selected.additional) return null;

  return React.createElement(selected.additional);
};
