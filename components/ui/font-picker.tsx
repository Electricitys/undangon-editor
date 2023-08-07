import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import _pick from "lodash/pick";
import { CONSTANTS } from "../Constants";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";
import { FC } from "react";
import { SelectValue } from "@radix-ui/react-select";
import { Virtuoso } from "react-virtuoso";

interface WebfontsFontResponse {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  files: {};
  category: string;
  kind: string;
  menu: string;
}

interface WebfontsResponse {
  kind: string;
  items: WebfontsFontResponse[];
}

interface Item {
  value: WebfontsFontResponse["family"];
  label: WebfontsFontResponse["family"];
  data: Pick<WebfontsFontResponse, "family" | "category">;
}

type FontPickerProps = {
  activeFontFamily: string;
  onChange: (newValue: Item["data"]) => void;
  placeholder?: string;
  limit?: number;
};

const FontPicker: FC<FontPickerProps> = ({
  activeFontFamily,
  onChange,
  placeholder = "Select",
  limit = 100
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
    <Select
      defaultValue={activeFontFamily}
      onValueChange={(value) => {
        onChange(
          items.find(({ value: v }) => v === value)?.data as Item["data"]
        );
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <Virtuoso
          totalCount={items.length}
          itemContent={(index) => (
            <SelectItem value={items[index].value}>
              {items[index].label}
            </SelectItem>
          )}
        />
      </SelectContent>
    </Select>
  );
};

export { FontPicker };
