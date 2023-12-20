import { PanelSection } from "../PanelSection";
import { useViewportFrame } from "../Frames/Frame";
import { SimplePropertiesInput } from "./SimplePropertiesInput";

export const PropertiesPanelSimpleContent = () => {
  const { frame, frameHelper } = useViewportFrame();
  return (
    <PanelSection
      text="Global Properties"
      lock={true}
      description="Input props that this component exposes"
    >
      <SimplePropertiesInput
        value={frame.properties || []}
        onPropertyChange={(index, value, properties) => {
          if (index !== null && value !== null)
            frameHelper.updatePropertyFrameAt(frame.id, index, value);
          else
            frameHelper.updateFrameAt(frame.id, {
              ...frame,
              properties: properties,
            });
        }}
        onChange={(p) => {}}
      />
    </PanelSection>
  );
};

export const PropertiesPanelSimple = () => {
  const { frame } = useViewportFrame();

  if (!frame?.properties) return null;

  return <PropertiesPanelSimpleContent />;
};
