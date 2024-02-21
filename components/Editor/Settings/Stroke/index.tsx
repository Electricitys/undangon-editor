import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
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
    | "borderWidth"
    | "borderTop"
    | "borderLeft"
    | "borderRight"
    | "borderBottom"
    | "borderStyle"
  > {}

const defaultValue: Partial<StrokeProps> = {
  borderColor: undefined,
  borderTop: undefined,
  borderLeft: undefined,
  borderBottom: undefined,
  borderRight: undefined,
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
      _get(stroke, "borderTop"),
      _get(stroke, "borderRight"),
      _get(stroke, "borderBottom"),
      _get(stroke, "borderLeft"),
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
        <div className="px-1 col-span-6">
          <ColorPicker
            className="w-full border-transparent hover:border-gray-200 px-2"
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
        <div className="px-1 col-span-4">
          <CSSValueInput
            id="stroke.borderWidth"
            readOnly={isMixed}
            className="border-transparent hover:border-gray-200"
            icon={<BorderAllIcon />}
            onChange={function (value: any): void {
              _setPropsValue("stroke.borderWidth", value);
            }}
            placeholder={isMixed ? "Mixed" : "0"}
            value={isMixed ? "" : _get(stroke, "borderWidth")}
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
