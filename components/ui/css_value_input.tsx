import React, { useEffect } from "react";
import { DragValue } from "./drag_value";
import { Button } from "./button";
import { cx } from "class-variance-authority";
import { parseIntSafeForInput } from "../utils/parseIntSafe";
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
          if (cssValue) {
            if (cssType === "Dimension") return onChange(value);
            if (cssType === "Number") return onChange(`${value}${defaultUnit}`);
            if (cssType === "Identifier") {
              if (allowedIdentifier) {
                if (allowedIdentifier.indexOf(value) != -1) {
                  return onChange(value);
                } else {
                  throw new Error(
                    `Identifier doesn't match \`${allowedIdentifier.join(
                      ", "
                    )}\``
                  );
                }
              } else {
                return onChange(value);
              }
            }
            throw new Error("Value not allowed");
          } else {
            return onChange(undefined);
          }
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

  useEffect(() => {
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
          friction={5}
          value={parseInt(
            parseIntSafeForInput(
              isTypeNumber && (transformedValue as any).value,
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
            value={tempValue || ""}
            onKeyDown={(e) => {
              const el = e.currentTarget;
              if (e.code === "Enter") {
                el.blur();
              }
              if (!isTypeNumber) return;
              const val = parseInt((transformedValue as any).value) as number;
              if (e.code === "ArrowUp") {
                ChangeHandler(val + 1, true);
              }
              if (e.code === "ArrowDown") {
                ChangeHandler(val - 1, true);
              }
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
