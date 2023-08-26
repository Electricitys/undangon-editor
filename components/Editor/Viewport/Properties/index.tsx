import { Element, useEditor } from "@craftjs/core";
import { Text } from "../../Nodes";
import { PanelSection } from "../PanelSection";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { Input } from "@/components/ui/input";

interface PropertiesProps {
  properties: {
    id: string;
    name: string;
    value: string;
  }[];
}

export const Properties: React.FC<PropertiesProps> = ({ properties = [] }) => {
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
            }}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </>
      }
    >
      <div className="px-4">
        {properties.length === 0 && (
          <div className="text-gray-400 text-sm">No props set</div>
        )}
        {properties.map(({ id, value, name }) => (
          <div key={id} className="flex">
            <div style={{ width: "25%" }}>
              <Input
                value={name}
                placeholder="name"
                className="rounded-e-none"
              />
            </div>
            <div style={{ width: "75%" }}>
              <Input
                value={value}
                placeholder="value"
                className="rounded-s-none border-l-0"
              />
            </div>
          </div>
        ))}
      </div>
    </PanelSection>
  );
};
