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
import { Virtuoso } from "react-virtuoso";
import { useFontFace } from "../Editor/Nodes/Text/FontFaceProvider";
import { Skeleton } from "./skeleton";

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
      <Select
        onValueChange={(value) => {
          onChange(
            items.find(({ value: v }) => v === value)?.data as Item["data"]
          );
        }}
        defaultValue={activeFontFamily}
        value={activeFontFamily}
      >
        <SelectTrigger className="w-[180px]" {...props}>
          <FontPreviewer fontFamily={activeFontFamily}>
            {activeFontFamily}
            {/* <SelectValue placeholder={placeholder} /> */}
          </FontPreviewer>
        </SelectTrigger>
        <SelectContent>
          <Virtuoso
            className="min-h-96"
            style={{
              minWidth: 150,
              minHeight: 350,
            }}
            totalCount={items.length}
            itemContent={(index) => (
              <SelectItem value={items[index].value} style={{ fontSize: 18 }}>
                <FontPreviewer fontFamily={items[index].value}>
                  {items[index].label}
                </FontPreviewer>
              </SelectItem>
            )}
          />
        </SelectContent>
      </Select>
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
