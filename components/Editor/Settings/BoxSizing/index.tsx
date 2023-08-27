import { Select } from "@/components/component/Select";
import { CSSUnitInput, uncss } from "@/components/ui/css_unit_input";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEditor, useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";
import { useForm } from "react-hook-form";

export interface BoxSizingProps {
  width: string;
  height: string;
  h_sizing: "fixed" | "fill" | "hug";
  v_sizing: "fixed" | "fill" | "hug";
}

const defaultValue: Partial<BoxSizingProps> = {
  width: "auto",
  height: "auto",
  h_sizing: "hug",
  v_sizing: "hug",
};

export const BoxSizing = () => {
  const {
    actions: { history },
  } = useEditor();
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["boxSizing"]),
  }));

  const boxSizing: BoxSizingProps = values.boxSizing;
  return (
    <div className="px-2">
      <div className="flex pb-2">
        <div className="px-1 w-1/2">
          <CSSUnitInput
            className="border-transparent hover:border-gray-200"
            label={"Width"}
            disabled={false}
            icon={"W"}
            onChange={function (_value: any, raw): void {
              setProp(
                (props: any) =>
                  _set(
                    props,
                    "boxSizing.width",
                    uncss.compile(raw.value, raw.unit)
                  ),
                1000
              );
            }}
            initialValue={uncss.parse(boxSizing.width)}
          />
        </div>
        <div className="px-1 w-1/2">
          <CSSUnitInput
            className="border-transparent hover:border-gray-200"
            label={"Height"}
            disabled={false}
            icon={"H"}
            onChange={function (_value: any, raw): void {
              setProp((props: any) => {
                _set(
                  props,
                  "boxSizing.height",
                  uncss.compile(raw.value, raw.unit)
                );
              }, 1000);
            }}
            initialValue={uncss.parse(boxSizing.height)}
          />
        </div>
      </div>
      <div className="flex">
        <div className="px-1 w-1/2">
          <Select
            className="border-transparent hover:border-gray-200"
            label={"Horizontal Resizing"}
            disabled={false}
            onChange={function (value: any): void {
              // console.log(value);
              setProp((props: any) => _set(props, "boxSizing.h_sizing", value));
            }}
            options={resizingOptions}
            value={boxSizing.h_sizing}
          />
        </div>
        <div className="px-1 w-1/2">
          <Select
            className="border-transparent hover:border-gray-200"
            label={"Vertical Resizing"}
            disabled={false}
            onChange={function (value: any): void {
              setProp((prop: any) => _set(prop, "boxSizing.v_sizing", value));
            }}
            options={resizingOptions}
            value={boxSizing.v_sizing}
          />
        </div>
      </div>
    </div>
  );
};

BoxSizing.defaultValue = defaultValue as BoxSizingProps;

const resizingOptions = [
  {
    value: "fill",
    label: "Fill",
  },
  {
    value: "fixed",
    label: "Fixed",
  },
  {
    value: "hug",
    label: "Hug",
  },
];
