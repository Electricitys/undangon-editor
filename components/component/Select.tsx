import React from "react";
import {
  Select as PrimitiveSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  placeholder?: string;
  disabled: boolean;
  value: string;
  options: Option[];
  onChange: (value: string, obj: Option) => void;
}

export const Select: React.FC<SelectProps> = ({
  value,
  label,
  placeholder = "Select",
  disabled,
  options,
  onChange,
}) => {
  return (
    <PrimitiveSelect
      value={value}
      disabled={disabled}
      onValueChange={(value) =>
        onChange(value, options.find(({ value: v }) => v === value) as Option)
      }
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </PrimitiveSelect>
  );
};
