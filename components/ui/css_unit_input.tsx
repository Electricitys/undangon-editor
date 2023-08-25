import React from "react";
import _get from "lodash/get";
import { DragValue } from "./drag_value";
import { Button } from "./button";
import { Input } from "./input";
import { DropdownMenu } from "./dropdown-menu";
import * as Select from "@radix-ui/react-select";
import { Cross1Icon } from "@radix-ui/react-icons";
import { SelectContent, SelectItem } from "./select";

const unitOptions = ["px", "vh", "vw", "%"];

type CSSUnitValue = {
  value: any;
  unit: any;
};

interface CSSUnitInputProps {
  label: string;
  disabled: boolean;
  icon: React.ReactNode;
  onChange: (value: any, raw: CSSUnitValue) => void;
  initialValue: CSSUnitValue;
}

export const CSSUnitInput: React.FC<CSSUnitInputProps> = ({
  label,
  disabled,
  icon,
  onChange,
  initialValue,
}) => {
  const [value, setValue] = React.useState(initialValue.value);
  const [unit, setUnit] = React.useState(initialValue.unit);

  const ChangeHandler = React.useCallback(
    (n: CSSUnitInputProps["initialValue"]) => {
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

  return (
    <div className="flex">
      <DragValue
        disabled={disabled}
        min={0}
        max={999999}
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
      <div className="flex grow">
        <Input
          disabled={disabled}
          style={{
            paddingLeft: 0,
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
        <Select.Root
          onValueChange={(u) => {
            ChangeHandler({ value, unit: u });
          }}
        >
          <Select.Trigger>
            <Button size={"icon"} variant={"ghost"} disabled={disabled}>
              {unit}
            </Button>
          </Select.Trigger>
          <SelectContent>
            {unitOptions.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select.Root>
      </div>
      {!!value && (
        <Button
          disabled={disabled}
          variant={"ghost"}
          size={"icon"}
          onClick={() => {
            ChangeHandler({ value: undefined, unit: undefined });
          }}
        >
          <Cross1Icon />
        </Button>
      )}
    </div>
  );
};
