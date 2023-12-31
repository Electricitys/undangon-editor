import React from "react";
import {
  Select as PrimitiveSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectTriggerWithoutIcon,
  SelectValue,
} from "../ui/select";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  value: string;
  open?: boolean;
  options: Option[];
  className?: string;
  style?: React.CSSProperties;
  withIcon?: boolean;
  onChange: (value: string, obj: Option) => void;
  onItemRender?: (item: Option) => React.ReactNode;
  onSelectedItemRender?: (item: Option) => React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  value,
  label,
  placeholder = "Select",
  disabled,
  options,
  className,
  open,
  style,
  onChange,
  onItemRender,
  onSelectedItemRender,
  withIcon = true,
}) => {
  const selectedItem: Option = options.find(
    ({ value: v }) => v === value
  ) as Option;
  return (
    <PrimitiveSelect
      open={open}
      value={value}
      disabled={disabled}
      onValueChange={(value) => onChange(value, selectedItem)}
    >
      {withIcon ? (
        <SelectTrigger className={className} style={style}>
          {value && onSelectedItemRender ? (
            onSelectedItemRender(selectedItem)
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
      ) : (
        <SelectTriggerWithoutIcon className={className} style={style}>
          {value && onSelectedItemRender ? (
            onSelectedItemRender(selectedItem)
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTriggerWithoutIcon>
      )}
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {onItemRender ? onItemRender({ value, label }) : label}
          </SelectItem>
        ))}
      </SelectContent>
    </PrimitiveSelect>
  );
};
