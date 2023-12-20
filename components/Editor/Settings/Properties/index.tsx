import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import React from "react";
import { Input } from "@/components/ui/input";
import { generateId } from "@/components/utils/generateId";
import { Select } from "@/components/component/Select";
import { StringField } from "./StringField";
import { ColorField } from "./ColorField";
import { ImagePickerField } from "./ImagePickerField";
import { TextField } from "./TextField";

export const PROPERTIES_TYPES = {
  expression: "any",
  text: "string",
  color: "string",
  image: "string",
};

export type Properties = {
  id: string;
  name: string;
  value: string;
  type: "expression" | "text" | "color" | "image";
  _updatedAt: number;
};

interface PropertiesProps {
  value: Properties[];
  onChange: (value: Properties[]) => void;
  onPropertyChange: (
    index: number | null,
    value: Properties | null,
    rest: Properties[]
  ) => void;
  addButton?: boolean;
  type?: boolean;
  disableTrash?: boolean;
  availableVariables?: Properties[];
}

export const PropertiesInput: React.FC<PropertiesProps> = ({
  value,
  onChange,
  onPropertyChange,
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
    onPropertyChange(index, updatedItem, updatedItems);
  };
  const removeAt: (index: number) => void = (index) => {
    const updatedItems = [...value];
    updatedItems.splice(index, 1);
    onPropertyChange(null, null, updatedItems);
    onChange(updatedItems);
  };
  const add = async (item: Omit<Properties, "_updatedAt">) => {
    onPropertyChange(null, null, [
      ...value,
      { ...item, _updatedAt: Date.now() },
    ]);
  };

  let Field = (index: number, field: Properties) => {
    const restProps = {
      id: `props.${index as any}.value`,
      value: field.value,
      onChange: (value: string) =>
        updateAt(index, {
          ...field,
          value: value || "",
        }),
    };
    switch (field.type) {
      case "text":
        return <TextField {...restProps} />;
      case "color":
        return <ColorField {...restProps} />;
      case "image":
        return <ImagePickerField {...restProps} />;
      default:
        return (
          <StringField
            id={restProps.id}
            placeholder="value"
            className={"rounded-s-none"}
            defaultValue={restProps.value}
            onChange={restProps.onChange}
            variables={availableVariables
              .map((v) => ({
                key: v.id,
                value: `$${v.name}`,
                type: v.type,
              }))
              .filter((v) => v.key !== field.id)}
          />
        );
    }
  };

  return (
    <div className="pl-4 pr-2">
      {value.length === 0 && (
        <div className="text-gray-400 text-sm mb-4">No props set</div>
      )}
      <div className="mt-0">
        {value.map((field, index: number) => {
          return (
            <div key={field.id} className={`flex mb-2`}>
              <div style={{ width: "30%" }}>
                <div className={`border rounded-md rounded-e-none border-r-0`}>
                  <Input
                    readOnly={!type}
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
                        label: "Text",
                        value: "text",
                      },
                      {
                        label: "Expression",
                        value: "expression",
                      },
                      {
                        label: "Color",
                        value: "color",
                      },
                      {
                        label: "Image",
                        value: "image",
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
                  {Field(index, field)}
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
                type: "text",
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
