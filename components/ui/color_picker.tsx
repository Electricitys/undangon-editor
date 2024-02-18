import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Paintbrush } from "lucide-react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { PopoverPortal } from "@radix-ui/react-popover";
import { Cross1Icon, Cross2Icon } from "@radix-ui/react-icons";
import { Input } from "./input";

type ColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
};

export const ColorPicker = ({
  value,
  onChange,
  className,
  placeholder = "Pick a color",
}: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[220px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="w-full flex items-center gap-2">
            {value ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background: value }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="truncate flex-1">{value ? value : placeholder}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <HexColorPicker
            className="mb-3"
            style={{
              width: "100%",
            }}
            color={value}
            onChange={(color) => {
              onChange(color);
            }}
          />
          <div className="flex">
            <Input
              value={value}
              placeholder={placeholder}
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
            <Button
              variant={"ghost"}
              size={"icon"}
              className="px-2"
              onClick={() => {
                onChange("inherit");
              }}
            >
              <Cross1Icon height={16} width={16} />
            </Button>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};
