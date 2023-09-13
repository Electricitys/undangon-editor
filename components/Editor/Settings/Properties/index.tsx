import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import React from "react";
import { Input } from "@/components/ui/input";
import { generateId } from "@/components/utils/generateId";
import { Select } from "@/components/component/Select";
import { ExpressionInput } from "@/components/ui/expression-input";

export type Properties = {
  id: string;
  name: string;
  value: string;
  type: "string" | "color" | "file";
};

interface PropertiesProps {
  value: Properties[];
  onChange: (value: Properties[]) => void;
  addButton?: boolean;
  type?: boolean;
  disableTrash?: boolean;
  availableVariables?: Properties[];
}

export const PropertiesInput: React.FC<PropertiesProps> = ({
  value,
  onChange,
  addButton = true,
  type = false,
  disableTrash = false,
  availableVariables = [],
}) => {
  const updateAt: (index: number, updatedItem: Properties) => void = (
    index,
    updatedItem
  ) => {
    const updatedItems = [...value];
    updatedItems[index] = updatedItem;
    onChange(updatedItems);
  };
  const removeAt: (index: number) => void = (index) => {
    const updatedItems = [...value];
    updatedItems.splice(index, 1);
    onChange(updatedItems);
  };
  const add = async (item: Properties) => {
    onChange([...value, item]);
  };

  // React.useEffect(() => {
  //   if (onChange) onChange(items);
  // }, [items]);

  return (
    <div className="pl-4 pr-2">
      {value.length === 0 && (
        <div className="text-gray-400 text-sm mb-4">No props set</div>
      )}
      <div className="mt-0">
        {value.map((field, index: number) => {
          const className = !disableTrash
            ? `rounded-none border-x-0`
            : "rounded-e-none border-l-0";
          return (
            <div key={field.id} className={`flex mb-2`}>
              <div style={{ width: "30%" }}>
                <div className={`border rounded-md rounded-e-none border-r-0`}>
                  <Input
                    id={`props.${index}.name`}
                    name={`props.${index}.name`}
                    placeholder="name"
                    className={`border-none`}
                    onChange={(e) =>
                      updateAt(index, {
                        ...field,
                        name: e.target.value,
                      })
                    }
                    defaultValue={field.name}
                  />
                </div>
              </div>
              {type ? (
                <div style={{ width: "70%" }} className={`border border-r-0`}>
                  <Select
                    label="Type"
                    disabled={false}
                    value={field.type}
                    options={[
                      {
                        label: "String",
                        value: "string",
                      },
                      {
                        label: "Color",
                        value: "color",
                      },
                      {
                        label: "File",
                        value: "file",
                      },
                    ]}
                    className={"border-0 rounded-none"}
                    onChange={function (value): void {
                      updateAt(index, {
                        ...field,
                        type: value as any,
                      });
                    }}
                  />
                </div>
              ) : (
                <div style={{ width: "70%", position: "relative" }}>
                  <ExpressionInput
                    id={`props.${index as any}.value`}
                    placeholder="value"
                    className={"rounded-s-none"}
                    defaultValue={field.value}
                    onChange={(value) =>
                      updateAt(index, {
                        ...field,
                        value: value || "",
                      })
                    }
                    variables={availableVariables
                      .map((v) => ({
                        key: v.id,
                        value: `$${v.name}`,
                      }))
                      .filter((v) => v.key !== field.id)}
                  />
                </div>
              )}
              {!disableTrash && (
                <div className="rounded rounded-s-none border">
                  <Button
                    // disabled={items.length === 1}
                    variant={"outline"}
                    className="rounded-s-none border-0"
                    size={"icon"}
                    onClick={() => {
                      removeAt(index);
                    }}
                  >
                    <Cross2Icon />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {addButton && (
          <Button
            // disabled={items.length === 1}
            variant={"outline"}
            onClick={() => {
              add({
                id: generateId(),
                name: "",
                value: "",
                type: "string",
              });
            }}
          >
            Add Props
          </Button>
        )}
      </div>
    </div>
  );
};