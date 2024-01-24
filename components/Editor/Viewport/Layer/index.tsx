import { Layers } from "@craftjs/layers";
import { PanelSection } from "../PanelSection";
import { LayerRenderer } from "./Layer";

export const LayerPanel = () => {
  return (
    <PanelSection text="Layers">
      <div className="editor-layer -ml-3 pr-2">
        <Layers renderLayer={LayerRenderer} />
      </div>
    </PanelSection>
  );
};
