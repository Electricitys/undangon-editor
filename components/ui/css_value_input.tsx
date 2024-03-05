import React from "react";
import { DragValue } from "./drag_value";
import { Button } from "./button";
import { cx } from "class-variance-authority";
import {
  parseIntSafeForInput,
  parseNumberSafeForInput,
} from "../utils/parseIntSafe";
import { Input } from "./input";
import * as csstree from "css-tree";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ChevronDownIcon } from "lucide-react";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { isNumber } from "../utils/isNumber";
import { usePrevious } from "react-use";
import { parseNumber } from "../utils/parseNumber";

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
  step?: number;
  onChange: (value: any) => void;

  defaultUnit?: string;
  allowedIdentifier?: string[];

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
  step = 1,
  onChange,

  defaultUnit = "px",
  allowedIdentifier = [],

  readOnly = false,

  placeholder,
  className,
  style,

  actions,
}) => {
  const prevValue = usePrevious(value);
  const [tempValue, setTempValue] = React.useState(value);

  const transformedValue = React.useMemo(() => {
    const temp = csstree.parse(value as string, {
      context: "value",
    }) as csstree.Value;
    return temp.children.first;
  }, [value]);

  const valueType = transformedValue?.type;

  const ChangeHandler = React.useCallback(
    (value: any, number: boolean = false) => {
      if (value === prevValue) return;
      try {
        const temp = csstree.parse(value as string, {
          context: "value",
        }) as csstree.Value;
        const cssValue = temp.children.first;
        const cssType = cssValue?.type;

        if (number) {
          if (cssType === "Dimension")
            return onChange(`${value}${cssValue?.unit}`);
          if (cssType === "Number") return onChange(`${value}${defaultUnit}`);
        } else {
          if (!cssValue) return onChange(undefined);

          if (cssType === "Dimension") return onChange(`${value}`);
          if (cssType === "Percentage") return onChange(`${value}`);
          if (cssType === "Number") return onChange(`${value}${defaultUnit}`);
          if (cssType === "Identifier") {
            if (!allowedIdentifier || allowedIdentifier.includes(value))
              return onChange(value);

            throw new Error(
              `Identifier doesn't match \`${allowedIdentifier.join(", ")}\``
            );
          }
          throw new Error("Value not allowed");
        }
      } catch (err: any) {
        setTempValue(prevValue);
      }
    },
    [onChange, transformedValue]
  );

  const isTypeNumber = valueType
    ? ["Dimension", "Number"].indexOf(valueType as string) > -1
    : false;

  React.useEffect(() => {
    setTempValue(value);
  }, [value]);

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
          step={step}
          value={
            parseNumber(isTypeNumber && (transformedValue as any).value) || 0
          }
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
            autoComplete="off"
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
            value={tempValue || ""}
            onKeyDown={(e) => {
              const el = e.currentTarget;
              if (e.code === "Enter") {
                el.blur();
              }
              if (!isTypeNumber) return;
              const val = parseNumber(
                (transformedValue as any).value
              ) as number;
              if (e.code === "ArrowUp") {
                ChangeHandler(val + step, true);
              }
              if (e.code === "ArrowDown") {
                ChangeHandler(val - step, true);
              }
            }}
            onFocus={(e) => {
              e.currentTarget.select();
            }}
            onChange={(e) => {
              setTempValue(e.target.value);
            }}
            onBlur={(e) => {
              ChangeHandler(e.target.value);
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
