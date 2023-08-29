import { Element, useEditor } from "@craftjs/core";
import { Text } from "../../Nodes";
import { PanelSection } from "../PanelSection";
import { Button } from "@/components/ui/button";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { Input } from "@/components/ui/input";
import { useList } from "react-use";
import { generateId } from "@/components/utils/generateId";

type PropsProps = {
  id: string;
  name: string;
  value: string;
};

interface PropertiesProps {
  defaultValue?: PropsProps[];
  onChange?: (value: PropsProps[]) => void;
}

export const Properties: React.FC<PropertiesProps> = ({
  defaultValue = [],
  onChange,
}) => {
  const [items, itemsHelper] = useList<PropsProps>(defaultValue);

  React.useEffect(() => {
    if (onChange) onChange(items);
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
              });
            }}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </>
      }
    >
      <div className="pl-4 pr-2">
        {items.length === 0 && (
          <div className="text-gray-400 text-sm mb-4">No props set</div>
        )}
        <div style={{ marginTop: 0 }}>
          {items.map((field, index: number) => {
            return (
              <div key={field.id} className={`flex mb-2`}>
                <div style={{ width: "30%" }}>
                  <Input
                    id={`props.${index}.name`}
                    name={`props.${index}.name`}
                    placeholder="name"
                    className="rounded-e-none"
                    onChange={(e) =>
                      itemsHelper.upsert(({ id }) => id === field.id, {
                        ...field,
                        name: e.target.value,
                      })
                    }
                    defaultValue={field.name}
                  />
                </div>
                <div style={{ width: "70%" }}>
                  <Input
                    id={`props.${index as any}.value`}
                    placeholder="value"
                    className={`rounded-none border-x-0`}
                    defaultValue={field.value}
                    onChange={(e) =>
                      itemsHelper.upsert(({ id }) => id === field.id, {
                        ...field,
                        value: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  // disabled={items.length === 1}
                  variant={"outline"}
                  className="rounded-s-none"
                  size={"icon"}
                  onClick={() => {
                    itemsHelper.removeAt(index);
                  }}
                >
                  <Cross2Icon />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </PanelSection>
  );
};
