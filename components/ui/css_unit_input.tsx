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
import { parseIntSafe, parseIntSafeForInput } from "../utils/parseIntSafe";

export const defaultUnitOptions = ["", "px", "vh", "vw", "%", "auto"];

export type CSSUnitValue = {
  value: any;
  unit: any;
};

interface CSSUnitInputProps {
  id?: string;
  name?: string;
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
  small?: boolean;
  actions?: React.ReactElement;
}

export const CSSUnitInput: React.FC<CSSUnitInputProps> = ({
  id,
  name,
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
  small = false,
  actions,
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
        // open={disabled ? false : undefined}
        delayDuration={0}
      >
        <TooltipTrigger asChild>
          <div
            className={cx(
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
            {unit !== "auto" && (
              <div className="grow">
                <Input
                  id={id}
                  name={name}
                  disabled={disabled}
                  placeholder={placeholder}
                  style={{
                    height: 32,
                    boxShadow: "none",
                    outline: "!important none",
                    paddingRight: 0,
                    paddingLeft: 0,
                    border: 0,
                  }}
                  value={parseIntSafeForInput(value, "")}
                  onKeyDown={(e) => {
                    if (e.code === "ArrowUp") {
                      ChangeHandler({ value: value + 1, unit });
                    }
                    if (e.code === "ArrowDown") {
                      ChangeHandler({ value: value - 1, unit });
                    }
                  }}
                  onChange={(e) => {
                    ChangeHandler({
                      value: parseIntSafeForInput(e.target.value, ""),
                      unit,
                    });
                  }}
                />
              </div>
            )}
            <Select.Root
              defaultValue={unitOptions[0]}
              value={unit}
              disabled={disabled || !(unitOptions.length > 1)}
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
                    height: 32,
                    minWidth: 32,
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
          <TooltipContent side="bottom" align="end" className="p-0">
            {actions}
            <div className="flex flex-col">
              <button
                className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700 disabled:pointer-events-none disabled:opacity-50"
                disabled={!value}
                onClick={handleReset}
              >
                <Cross1Icon className="mr-2 h-4 w-4" />
                <span>Clear Value</span>
              </button>
            </div>
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
