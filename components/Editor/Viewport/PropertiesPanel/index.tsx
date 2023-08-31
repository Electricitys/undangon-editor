import { useEditor } from "@craftjs/core";
import { Properties, PropsProps } from "../../Settings/Properties";
import { PanelSection } from "../PanelSection";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useViewportFrame } from "../Frames/Frame";
import { generateId } from "@/components/utils/generateId";

export const PropertiesContent = () => {
  const { frame, frameHelper } = useViewportFrame();
  return (
    <PanelSection
      text="Props"
      description="Input props that this component exposes"
      action={
        <>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="h-6 w-6"
            onClick={(e) => {
              e.preventDefault();
              frameHelper.updateFrameAt(frame.id, {
                properties: [
                  ...(frame.properties || []),
                  {
                    id: generateId(),
                    name: "",
                    value: "",
                    type: "string",
                  },
                ],
              });
            }}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </>
      }
    >
      <Properties
        addButton={false}
        type={true}
        value={frame.properties || []}
        onChange={(p) => {
          frameHelper.updateFrameAt(frame.id, {
            properties: p,
          });
        }}
      />
    </PanelSection>
  );
};

export const PropertiesPanel = () => {
  const { frame } = useViewportFrame();

  if (!frame?.properties) return null;

  return <PropertiesContent />;
};
