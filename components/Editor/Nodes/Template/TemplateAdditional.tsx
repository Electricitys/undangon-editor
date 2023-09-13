import { Button } from "@/components/ui/button";
import { PanelSection } from "../../Viewport/PanelSection";
import { generateId } from "@/components/utils/generateId";
import { useList } from "react-use";
import { Properties, PropertiesInput } from "../../Settings/Properties";
import React from "react";
import { PlusIcon } from "@radix-ui/react-icons";

export const TemplateAdditional = () => {
  const [items, itemsHelper] = useList<Properties>([]);

  React.useEffect(() => {
    // if (onChange) onChange(items);
  }, [items]);

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
              itemsHelper.push({
                id: generateId(),
                name: "",
                value: "",
                type: "string",
              });
            }}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </>
      }
    >
      <PropertiesInput
        value={items}
        onChange={(e) => {
          itemsHelper.set(e);
        }}
        addButton={false}
        type={true}
      />
    </PanelSection>
  );
};
