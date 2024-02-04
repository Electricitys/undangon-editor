import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { ChevronsUpDown } from "lucide-react";
import { Option, VirtualizedCommand } from "./virtualized_command";

interface VirtualizedComboboxProps {
  options: Option[];
  searchPlaceholder?: string;
  width?: string;
  height?: string;
  onItemRender?: (option: Option) => React.ReactNode;
  defaultSelectedOption?: Option;
}

export function VirtualizedCombobox({
  options,
  searchPlaceholder = "Search items...",
  width = "auto",
  height = "400px",
  onItemRender,
  defaultSelectedOption,
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedOption, setSelectedOption] = React.useState<
    Option | undefined
  >(defaultSelectedOption);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          style={{
            width: width,
          }}
        >
          {selectedOption ? selectedOption?.label : searchPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: width }}>
        <VirtualizedCommand
          onItemRender={onItemRender}
          height={height}
          options={options}
          placeholder={searchPlaceholder}
          selectedOption={selectedOption?.value}
          onSelectOption={(currentValue) => {
            setSelectedOption(
              currentValue === selectedOption ? undefined : currentValue
            );
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
