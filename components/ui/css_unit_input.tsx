import React from "react";
import _get from "lodash/get";
import { DragValue } from "./drag_value";
import { Button } from "./button";
import unitsCss from "units-css";
// import { Input } from "./input";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, Cross1Icon } from "@radix-ui/react-icons";
import { SelectContent, SelectItem } from "./select";
import { Input } from "./input";
import { cx } from "class-variance-authority";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { TooltipArrow, TooltipPortal } from "@radix-ui/react-tooltip";

export const defaultUnitOptions = ["", "px", "vh", "vw", "%", "auto"];

export type CSSUnitValue = {
  value: any;
  unit: any;
};

interface CSSUnitInputProps {
  label: string;
  disabled?: boolean;
  icon: React.ReactNode;
  onChange: (value: any, raw: CSSUnitValue) => void;
  initialValue?: CSSUnitValue;
  defaultValue?: CSSUnitValue;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string | "auto";
  max?: number;
  min?: number;
  unitOptions?: string[];
}

export const CSSUnitInput: React.FC<CSSUnitInputProps> = ({
  label,
  disabled = false,
  icon,
  onChange,
  initialValue,
  defaultValue,
  placeholder = "auto",
  className,
  style,
  max = 999999,
  min = 0,
  unitOptions = defaultUnitOptions,
}) => {
  const [value, setValue] = React.useState(initialValue?.value);
  const [unit, setUnit] = React.useState(initialValue?.unit);

  const ChangeHandler = React.useCallback(
    (n: CSSUnitValue) => {
      if (value !== n.value) setValue(n.value);
      if (unit !== n.unit) setUnit(n.unit);
      if (n.value && !n.unit) setUnit(unitOptions[0]);
      return onChange(
        n.value === undefined ? undefined : `${n.value}${n.unit}`,
        n
      );
    },
    [value, unit]
  );

  const handleReset = () => {
    if (defaultValue) ChangeHandler(defaultValue);
    else ChangeHandler({ value: undefined, unit: unitOptions[0] });
  };

  return (
    <TooltipProvider>
      <Tooltip
        // open
        open={!!value ? undefined : false}
        delayDuration={0}
      >
        <TooltipTrigger asChild>
          <div
            className={cx("flex border border-gray-200 rounded-md", className)}
            style={style}
          >
            <DragValue
              disabled={disabled}
              min={min}
              max={max}
              friction={5}
              value={value || 0}
              onChange={(value) => {
                ChangeHandler({ value, unit });
              }}
            >
              {({ handleMouseDown }) => (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  disabled={disabled}
                  style={{
                    minWidth: 40,
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
            {unit !== "auto" && (
              <div className="grow">
                <Input
                  disabled={disabled}
                  placeholder={placeholder}
                  style={{
                    boxShadow: "none",
                    outline: "!important none",
                    paddingRight: 0,
                    paddingLeft: 0,
                    border: 0,
                  }}
                  // type="number"
                  value={value || ""}
                  onKeyDown={(e) => {
                    if (e.code === "ArrowUp") {
                      ChangeHandler({ value: value + 1, unit });
                    }
                    if (e.code === "ArrowDown") {
                      ChangeHandler({ value: value - 1, unit });
                    }
                  }}
                  onChange={(e) => {
                    ChangeHandler({ value: Number(e.target.value), unit });
                  }}
                />
              </div>
            )}
            <Select.Root
              defaultValue={unitOptions[0]}
              value={unit}
              disabled={!(unitOptions.length > 1)}
              onValueChange={(u) => {
                ChangeHandler({ value, unit: u });
              }}
            >
              <Select.Trigger asChild>
                <Button
                  className={unit !== "auto" ? "" : "grow"}
                  size={"icon"}
                  variant={"ghost"}
                  disabled={disabled}
                  style={{
                    minWidth: 40,
                    pointerEvents: unitOptions.length > 1 ? "inherit" : "none",
                  }}
                >
                  {unit ? unit : <ChevronDownIcon />}
                </Button>
              </Select.Trigger>
              <SelectContent>
                {unitOptions.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u === "" ? "-" : u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select.Root>
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="bottom" className="p-0">
            <Button
              disabled={disabled}
              variant={"ghost"}
              size={"sm"}
              style={{
                minWidth: 40,
              }}
              onClick={handleReset}
            >
              Clear
            </Button>
            <TooltipArrow color="white" />
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
};

type UnitsCss = typeof unitsCss;

interface UnCssP extends UnitsCss {
  compile: (value: any, unit: string) => string;
  parse: (
    value?: string | number,
    property?: string
  ) => {
    value: number;
    unit: string;
  };
}
export const uncss: UnCssP = {
  ...unitsCss,
  parse(value, property) {
    if (!value) return unitsCss.parse("");
    return unitsCss.parse(value, property);
  },
  compile(value, unit) {
    if (unit === "auto") return unit;
    return `${value}${unit}`;
  },
};
