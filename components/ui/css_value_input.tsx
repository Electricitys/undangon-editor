import React from "react";
import { DragValue } from "./drag_value";
import { Button } from "./button";
import { cx } from "class-variance-authority";
import { parseIntSafeForInput } from "../utils/parseIntSafe";
import { Input } from "./input";
import * as csstree from "css-tree";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ChevronDownIcon } from "lucide-react";
import { PopoverAnchor } from "@radix-ui/react-popover";

interface CSSValueInputProps {
  id?: string;
  name?: string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  icon: React.ReactNode;
  value: string | number | undefined;
  min?: number;
  max?: number;
  onChange: (value: any) => void;

  placeholder?: string | number | undefined;
  className?: string;
  style?: React.CSSProperties;

  actions?: React.ReactElement;
}

export const CSSValueInput: React.FC<CSSValueInputProps> = ({
  id,
  name,
  label,
  disabled = false,
  icon,
  value,
  min = -999999,
  max = 999999,
  onChange,

  readOnly = false,

  placeholder,
  className,
  style,

  actions,
}) => {
  const transformedValue = React.useMemo(() => {
    const temp = csstree.parse(value as string, {
      context: "value",
    }) as csstree.Value;
    return temp.children.first;
  }, [value]);

  const valueType = transformedValue?.type;

  const ChangeHandler = React.useCallback(
    (value: any, number: boolean = false) => {
      if (number) {
        if (valueType === "Dimension")
          return onChange(`${value}${transformedValue?.unit}`);
        if (valueType === "Number") return onChange(value);
      }
      onChange(value);
    },
    [onChange]
  );

  const isNumber = valueType
    ? ["Dimension", "Number"].indexOf(valueType as string) > -1
    : false;

  return (
    <Popover>
      <div
        className={cx(
          readOnly ? "pointer-events-none" : "",
          "flex group border relative border-gray-200 rounded-md",
          className
        )}
        style={style}
      >
        <DragValue
          disabled={disabled}
          min={min}
          max={max}
          friction={5}
          value={parseInt(
            parseIntSafeForInput(
              isNumber && (transformedValue as any).value,
              "0"
            )
          )}
          onChange={(value) => {
            ChangeHandler(value, true);
          }}
        >
          {({ handleMouseDown }) => (
            <Button
              variant={"ghost"}
              size={"icon"}
              disabled={disabled}
              style={{
                height: 32,
                width: 32,
                minWidth: 32,
                zIndex: 1,
                cursor: disabled ? "auto" : "w-resize",
              }}
              onMouseDown={handleMouseDown}
              title={label}
            >
              {icon}
            </Button>
          )}
        </DragValue>
        <div className="grow">
          <Input
            id={id}
            name={name}
            disabled={disabled}
            placeholder={placeholder as string}
            style={{
              height: 32,
              boxShadow: "none",
              outline: "!important none",
              paddingRight: 0,
              paddingLeft: 0,
              border: 0,
            }}
            value={value || ""}
            onKeyDown={(e) => {
              if (!isNumber) return;
              const val = parseInt((transformedValue as any).value) as number;
              if (e.code === "ArrowUp") {
                ChangeHandler(val + 1, true);
              }
              if (e.code === "ArrowDown") {
                ChangeHandler(val - 1, true);
              }
            }}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        </div>
        {actions && (
          <PopoverTrigger asChild>
            <Button
              className="hidden group-hover:flex"
              variant={"ghost"}
              size={"icon"}
              style={{
                height: 32,
                width: 32,
                minWidth: 32,
                zIndex: 1,
                cursor: "pointer",
              }}
            >
              <ChevronDownIcon size={16} />
            </Button>
          </PopoverTrigger>
        )}
      </div>
      <PopoverAnchor />
      <PopoverContent align="start" className="pointer-events-auto p-0 w-48">
        {actions}
      </PopoverContent>
    </Popover>
  );
};
