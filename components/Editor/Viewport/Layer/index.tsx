import { Layers } from "@craftjs/layers";
import { PanelSection } from "../PanelSection";
import { LayerRenderer } from "./Layer";

export const LayerPanel = () => {
  return (
    <PanelSection text="Layers">
      <div className="editor-layer pr-2">
        <Layers renderLayer={LayerRenderer} />
      </div>
    </PanelSection>
  );
};
