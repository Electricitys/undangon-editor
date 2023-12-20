import { Label } from "@/components/ui/label";
import { Properties } from "../../Settings/Properties";
import { ColorField } from "./SimpleProperties/ColorField";
import { ExpressionField } from "./SimpleProperties/ExpressionField";
import { TextField } from "./SimpleProperties/TextField";
import { ImagePickerField } from "../../Settings/Properties/ImagePickerField";

interface SimplePropertiesProps {
  value: Properties[];
  onChange: (value: Properties[]) => void;
  onPropertyChange: (
    index: number | null,
    value: Properties | null,
    rest: Properties[]
  ) => void;
  availableVariables?: Properties[];
}

export const SimplePropertiesInput: React.FC<SimplePropertiesProps> = ({
  value,
  onChange,
  onPropertyChange,
  availableVariables = [],
}) => {
  const updateAt: (index: number, updatedItem: Properties) => void = (
    index,
    updatedItem
  ) => {
    const updatedItems = [...value];
    updatedItems[index] = updatedItem;
    // onChange(updatedItems);
    onPropertyChange(index, updatedItem, updatedItems);
  };
  return (
    <div className="pl-4 pr-2">
      {value.map((field, index: number) => (
        <div
          key={field.id}
          className="grid w-full max-w-sm items-center gap-1.5 mb-4"
        >
          <Label>{field.name}</Label>
          {Field({
            updateAt,
            availableVariables,
            index,
            field,
          })}
        </div>
      ))}
    </div>
  );
};

let Field = ({
  index,
  field,
  availableVariables,
  updateAt,
}: {
  index: number;
  field: Properties;
  availableVariables: Properties[];
  updateAt: (index: number, updatedItem: Properties) => void;
}) => {
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
        <ExpressionField
          id={restProps.id}
          placeholder="value"
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
