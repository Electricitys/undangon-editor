import { PanelSection } from "../PanelSection";
import { useViewportFrame } from "../Frames/Frame";
import { SimplePropertiesInput } from "./SimplePropertiesInput";
import { Button } from "@/components/ui/button";
import { useViewport } from "../useViewport";
import { CircleDashedIcon } from "lucide-react";

export const PropertiesPanelSimpleContent = () => {
  const { frame, frameHelper } = useViewportFrame();
  const { mode } = useViewport();
  return (
    <PanelSection
      text="Global Properties"
      lock={true}
      description="Input props that this component exposes"
      action={
        <Button
          size={"icon"}
          variant={"ghost"}
          className="h-6 w-6"
          onClick={(e) => {
            e.preventDefault();
            mode.setMode("advanced");
          }}
        >
          <CircleDashedIcon size={16} />
        </Button>
      }
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
