import { PropertiesInput } from "../../Settings/Properties";
import { PanelSection } from "../PanelSection";
import { Button } from "@/components/ui/button";
import {
  LockClosedIcon,
  LockOpen1Icon,
  LockOpen2Icon,
  Pencil1Icon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { useViewportFrame } from "../Frames/Frame";
import { generateId } from "@/components/utils/generateId";
import { useState } from "react";

export const PropertiesContent = () => {
  const { frame, frameHelper } = useViewportFrame();
  const [editable, setEditable] = useState<boolean>(false);
  return (
    <PanelSection
      text="Props"
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
                      type: "string",
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
        </>
      }
    >
      <PropertiesInput
        addButton={false}
        disableTrash={!editable}
        type={editable}
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
