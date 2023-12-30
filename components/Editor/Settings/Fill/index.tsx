import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { useNode } from "@craftjs/core";
import { BackgroundPicker } from "@/components/ui/background_picker";

export interface FillProps {
  background: string;
}

const defaultValue: Partial<FillProps> = {
  background: undefined,
};

export const Fill = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["fill"]),
  }));
  const fill: FillProps = values.fill;

  return (
    <div className="px-1">
      <div className="flex items-center pl-3 pr-1">
        <div className="grow text-sm w-full">Color</div>
        <BackgroundPicker
          className="shrink-0 w-32 border-transparent hover:border-gray-200 px-3"
          value={_get(fill, "background") || ""}
          onChange={(value: any) => {
            setProp(
              (props: any) => _set(props, "fill.background", value),
              1000
            );
          }}
        />
      </div>
    </div>
  );
};

Fill.defaultValue = defaultValue as FillProps;
