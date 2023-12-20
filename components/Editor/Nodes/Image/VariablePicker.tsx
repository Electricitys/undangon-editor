"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Properties } from "../../Settings/Properties";
import { VariableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const VariablePicker: React.FC<{
  value: string;
  onChange: (value: string) => void;
  variables: { key: string; value: string; type: Properties["type"] }[];
}> = ({ value, onChange, variables }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} className="w-full">
          <VariableIcon size={16} className="mr-2" />
          {value ? value : "Pick Variable"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Available Variables</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {variables.map(({ key, value }) => (
          <DropdownMenuItem key={key} onMouseDown={() => onChange(value)}>
            {value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
