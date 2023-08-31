import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import React from "react";
import { Input } from "@/components/ui/input";
import { generateId } from "@/components/utils/generateId";
import { Select } from "@/components/component/Select";

export type PropsProps = {
  id: string;
  name: string;
  value: string;
  type: "string" | "color" | "file";
};

interface PropertiesProps {
  value: PropsProps[];
  onChange: (value: PropsProps[]) => void;
  addButton?: boolean;
  type?: boolean;
  disableTrash?: boolean;
}

export const Properties: React.FC<PropertiesProps> = ({
  value,
  onChange,
  addButton = true,
  type = false,
  disableTrash = false,
}) => {
  const updateAt: (index: number, updatedItem: PropsProps) => void = (
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
  const add = async (item: PropsProps) => {
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
      <div style={{ marginTop: 0 }}>
        {value.map((field, index: number) => {
          const className = !disableTrash ? `rounded-none border-x-0` : "rounded-s-none border-l-0";
          return (
            <div key={field.id} className={`flex mb-2`}>
              <div style={{ width: "30%" }}>
                <Input
                  id={`props.${index}.name`}
                  name={`props.${index}.name`}
                  placeholder="name"
                  className="rounded-e-none"
                  onChange={(e) =>
                    updateAt(index, {
                      ...field,
                      name: e.target.value,
                    })
                  }
                  defaultValue={field.name}
                />
              </div>
              {type ? (
                <div style={{ width: "70%" }}>
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
                    className={className}
                    onChange={function (value): void {
                      updateAt(index, {
                        ...field,
                        type: value as any,
                      });
                    }}
                  />
                </div>
              ) : (
                <div style={{ width: "70%" }}>
                  <Input
                    id={`props.${index as any}.value`}
                    placeholder="value"
                    className={className}
                    defaultValue={field.value}
                    onChange={(e) =>
                      updateAt(index, {
                        ...field,
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              {!disableTrash && (
                <Button
                  // disabled={items.length === 1}
                  variant={"outline"}
                  className="rounded-s-none"
                  size={"icon"}
                  onClick={() => {
                    removeAt(index);
                  }}
                >
                  <Cross2Icon />
                </Button>
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
