import { PropertiesInput } from "../../Settings/Properties";
import { PanelSection } from "../PanelSection";
import { Button } from "@/components/ui/button";
import { LockClosedIcon, LockOpen1Icon, PlusIcon } from "@radix-ui/react-icons";
import { useViewportFrame } from "../Frames/Frame";
import { generateId } from "@/components/utils/generateId";
import { useState } from "react";
import { CircleDashedIcon, CircleDotIcon } from "lucide-react";
import { useViewport } from "../useViewport";

export const PropertiesContent = () => {
  const { frame, frameHelper } = useViewportFrame();
  const [editable, setEditable] = useState<boolean>(false);
  const { mode } = useViewport();
  return (
    <PanelSection
      text="Props"
      lock={true}
      description="Input props that this component exposes"
      action={
        <>
          {editable && (
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
                      type: "text",
                      _updatedAt: Date.now(),
                    },
                  ],
                });
              }}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          )}

          <Button
            size={"icon"}
            variant={"ghost"}
            className="h-6 w-6"
            onClick={(e) => {
              e.preventDefault();
              setEditable((s) => !s);
            }}
          >
            {editable ? (
              <LockOpen1Icon className="h-4 w-4" />
            ) : (
              <LockClosedIcon className="h-4 w-4" />
            )}
          </Button>

          <Button
            size={"icon"}
            variant={"ghost"}
            className="h-6 w-6"
            onClick={(e) => {
              e.preventDefault();
              mode.setMode("simple");
            }}
          >
            <CircleDotIcon size={16} />
          </Button>
        </>
      }
    >
      <PropertiesInput
        addButton={false}
        disableTrash={!editable}
        type={editable}
        value={frame.properties || []}
        onPropertyChange={(index, value, properties) => {
          if (index && value)
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

export const PropertiesPanel = () => {
  const { frame } = useViewportFrame();

  if (!frame?.properties) return null;

  return <PropertiesContent />;
};
