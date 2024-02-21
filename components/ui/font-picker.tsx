"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import _pick from "lodash/pick";
import { CONSTANTS } from "../Constants";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";
import React, { FC } from "react";
import {
  SelectProps,
  SelectTriggerProps,
  SelectValue,
} from "@radix-ui/react-select";
import { useFontFace } from "../Editor/Nodes/Text/FontFaceProvider";
import { Skeleton } from "./skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "./button";
import { VirtualizedCommand } from "./virtualized_command";
import { PopoverPortal } from "@radix-ui/react-popover";

export interface WebfontsFontResponse {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  files: {};
  category: string;
  kind: string;
  menu: string;
}

export interface WebfontsResponse {
  kind: string;
  items: WebfontsFontResponse[];
}

export interface Item {
  value: WebfontsFontResponse["family"];
  label: WebfontsFontResponse["family"];
  data: Pick<WebfontsFontResponse, "family" | "category">;
}

interface FontPickerProps
  extends React.RefAttributes<HTMLButtonElement>,
    Omit<SelectTriggerProps, "onChange"> {
  activeFontFamily: string;
  onChange: (font: Item["data"]) => void;
  placeholder?: string;
  limit?: number;
}

const FontPicker: FC<FontPickerProps> = ({
  activeFontFamily,
  onChange,
  placeholder = "Select",
  limit = 100,
  ...props
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { data, isLoading } = useQuery<Item[]>(
    ["font_picker"],
    async () => {
      let res: Item[] = [];
      try {
        res = (
          await axios.get<WebfontsResponse>(
            `https://www.googleapis.com/webfonts/v1/webfonts?key=${CONSTANTS.GOOGLE_API_KEY}`
          )
        ).data.items.map((item) => ({
          value: item.family,
          label: item.family,
          data: _pick(item, ["family", "category"]),
        }));
      } catch (err) {
        console.error(err);
      }
      return res;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const items = data || [];

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
            style={{
              width: "100%",
            }}
          >
            <FontPreviewer fontFamily={activeFontFamily}>
              {activeFontFamily}
            </FontPreviewer>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent
            className="pointer-events-auto p-0"
            style={{ width: "275px", zIndex: 100 }}
          >
            <VirtualizedCommand
              onItemRender={(option) => {
                return (
                  <FontPreviewer fontFamily={option.value}>
                    {option.label}
                  </FontPreviewer>
                );
              }}
              height={"400px"}
              options={
                data?.map(({ label, value }) => ({ label, value })) || []
              }
              placeholder={"Select Font..."}
              selectedOption={activeFontFamily}
              onSelectOption={(option) => {
                onChange(
                  items.find(({ value: v }) => v === option.value)
                    ?.data as Item["data"]
                );
                setOpen(false);
              }}
            />
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </>
  );
};

interface FontPreviewerProps {
  children: React.ReactNode;
  fontFamily: string;
}

const FontPreviewer: React.FC<FontPreviewerProps> = ({
  children,
  fontFamily = "Consolas",
}) => {
  const fontFace = useFontFace();
  const isLoaded = React.useMemo<boolean>(() => {
    let exist = fontFace.loaded.indexOf(fontFamily) < 0;
    return !exist;
  }, [fontFace.loaded, fontFamily]);

  React.useEffect(() => {
    const load = async () => {
      if (!fontFamily) return;
      try {
        fontFace.load(fontFamily);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [fontFamily]);

  return (
    <div
      className={`${!isLoaded && "text-gray-500"}`}
      style={{
        fontFamily: fontFamily,
      }}
    >
      {isLoaded ? children : <Skeleton>{children}</Skeleton>}
    </div>
  );
};

export { FontPicker };
