import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { useNode } from "@craftjs/core";
import { BackgroundPicker } from "@/components/ui/background_picker";
import { ColorPicker } from "@/components/ui/color_picker";
import React, { CSSProperties } from "react";
import { CSSValueInput } from "@/components/ui/css_value_input";
import { Select } from "@/components/component/Select";
import {
  BorderAllIcon,
  BorderBottomIcon,
  BorderLeftIcon,
  BorderRightIcon,
  BorderSplitIcon,
  BorderTopIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export interface StrokeProps
  extends Pick<
    CSSProperties,
    | "borderColor"
    | "borderStyle"
    | "borderTopWidth"
    | "borderLeftWidth"
    | "borderRightWidth"
    | "borderBottomWidth"
  > {}

const defaultValue: Partial<StrokeProps> = {
  borderColor: undefined,
  borderStyle: undefined,
  borderTopWidth: undefined,
  borderLeftWidth: undefined,
  borderBottomWidth: undefined,
  borderRightWidth: undefined,
};

export const Stroke = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["stroke"]),
  }));
  const stroke: StrokeProps = values.stroke;

  const [isMixed, setIsMixed] = React.useState(
    ![
      _get(stroke, "borderTopWidth"),
      _get(stroke, "borderRightWidth"),
      _get(stroke, "borderBottomWidth"),
      _get(stroke, "borderLeftWidth"),
    ].every((value, _index, array) => value === array[0])
  );

  const _setPropsValue = React.useCallback(
    (path: string, value: string) => {
      setProp(
        (props: any) =>
          _set(props, path, value === undefined ? undefined : value),
        1000
      );
    },
    [setProp]
  );

  return (
    <div className="px-1">
      <div className="grid grid-cols-12 pb-2">
        <div className="px-1 col-span-5">
          <ColorPicker
            className="w-full border-transparent hover:border-gray-200 px-2 h-8"
            value={_get(stroke, "borderColor") || ""}
            onChange={(value: any) => {
              setProp(
                (props: any) => _set(props, "stroke.borderColor", value),
                1000
              );
            }}
          />
          {/* <Select
            className="border-transparent hover:border-gray-200 px-2"
            label={"Vertical Resizing"}
            disabled={false}
            style={{
              height: 32,
            }}
            options={[
              { label: "Center", value: "center" },
              { label: "Inside", value: "inside" },
              { label: "Outside", value: "outside" },
            ]}
            value={"center"}
            onChange={function (value) {}}
          /> */}
        </div>
        <div className="px-1 col-span-5">
          <CSSValueInput
            id="stroke.borderWidth"
            readOnly={isMixed}
            className="border-transparent hover:border-gray-200"
            icon={<BorderAllIcon />}
            onChange={function (value: any): void {
              setProp((prop: any) => {
                if (!stroke.borderStyle) {
                  _set(prop, "stroke.borderStyle", "solid");
                }
                _set(prop, "stroke.borderTopWidth", value);
                _set(prop, "stroke.borderRightWidth", value);
                _set(prop, "stroke.borderBottomWidth", value);
                _set(prop, "stroke.borderLeftWidth", value);
                if (_isEmpty(value)) {
                  _set(prop, "stroke.borderStyle", undefined);
                  _set(prop, "stroke.borderStyle", undefined);
                }
              }, 1000);
            }}
            placeholder={isMixed ? "Mixed" : "0"}
            value={isMixed ? "Mixed" : _get(stroke, "borderTopWidth")}
          />
        </div>
        <div className="px-1 col-span-2">
          <Button
            className="border-transparent hover:border-gray-200"
            size={"icon-sm"}
            variant={"outline"}
            onClick={() => {
              setIsMixed((s) => !s);
            }}
          >
            <BorderSplitIcon />
          </Button>
        </div>
      </div>
      {isMixed && (
        <>
          <div className="grid grid-cols-12 pb-2">
            <div className="px-1 col-span-5">
              <CSSValueInput
                id="stroke.borderLeft"
                className="border-transparent hover:border-gray-200"
                icon={<BorderLeftIcon />}
                onChange={function (value: any): void {
                  _setPropsValue("stroke.borderLeft", value);
                }}
                value={_get(stroke, "borderLeft")}
              />
            </div>
            <div className="px-1 col-span-5">
              <CSSValueInput
                id="stroke.borderTop"
                className="border-transparent hover:border-gray-200"
                icon={<BorderTopIcon />}
                onChange={function (value: any): void {
                  _setPropsValue("stroke.borderTop", value);
                }}
                value={_get(stroke, "borderTop")}
              />
            </div>
            <div className="px-1 col-span-5">
              <CSSValueInput
                id="stroke.borderRight"
                className="border-transparent hover:border-gray-200"
                icon={<BorderRightIcon />}
                onChange={function (value: any): void {
                  _setPropsValue("stroke.borderRight", value);
                }}
                value={_get(stroke, "borderRight")}
              />
            </div>
            <div className="px-1 col-span-5">
              <CSSValueInput
                id="stroke.borderBottom"
                className="border-transparent hover:border-gray-200"
                icon={<BorderBottomIcon />}
                onChange={function (value: any): void {
                  _setPropsValue("stroke.borderBottom", value);
                }}
                value={_get(stroke, "borderBottom")}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

Stroke.defaultValue = defaultValue as StrokeProps;
