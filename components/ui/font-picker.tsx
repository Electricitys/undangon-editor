import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import _pick from "lodash/pick";
import { CONSTANTS } from "../Constants";

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

const FontPicker = () => {
  const { data } = useQuery(["font_picker"], async () => {
    let res: {}[] = [];
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
  });
};

export { FontPicker };
