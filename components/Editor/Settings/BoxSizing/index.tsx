import { Select } from "@/components/component/Select";
import { Button } from "@/components/ui/button";
import {
  CSSUnitValue,
  CSSUnitInput,
  uncss,
} from "@/components/ui/css_unit_input";
import { useEditor, useNode } from "@craftjs/core";
import {
  BoxIcon,
  CornerBottomLeftIcon,
  CornerBottomRightIcon,
  CornerTopLeftIcon,
  CornerTopRightIcon,
  Crosshair1Icon,
  Crosshair2Icon,
} from "@radix-ui/react-icons";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import React from "react";

const POSITION_OPTIONS = [
  {
    label: "Absolute",
    value: "absolute",
    icon: <Crosshair1Icon />,
  },
  {
    label: "Relative",
    value: "relative",
    icon: <Crosshair2Icon />,
  },
  {
    label: "Unset",
    value: "",
    icon: <BoxIcon />,
  },
];

export interface BoxSizingProps {
  position: "absolute" | "relative" | undefined;
  top: string;
  left: string;
  width: string;
  height: string;
  h_sizing: "fixed" | "fill" | "hug";
  v_sizing: "fixed" | "fill" | "hug";
  borderTopLeftRadius: string;
  borderTopRightRadius: string;
  borderBottomLeftRadius: string;
  borderBottomRightRadius: string;
}

const defaultValue: Partial<BoxSizingProps> = {
  position: undefined,
  top: "auto",
  left: "auto",
  width: "auto",
  height: "auto",
  h_sizing: "hug",
  v_sizing: "hug",
  borderTopLeftRadius: undefined,
  borderTopRightRadius: undefined,
  borderBottomLeftRadius: undefined,
  borderBottomRightRadius: undefined,
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

  const _setProps = React.useCallback(
    (path: string, raw: CSSUnitValue) => {
      setProp(
        (props: any) =>
          _set(
            props,
            path,
            raw.value === undefined
              ? undefined
              : uncss.compile(raw.value, raw.unit)
          ),
        1000
      );
    },
    [setProp]
  );

  return (
    <div className="px-2">
      <div className="grid grid-cols-12 pb-2">
        <div className="px-1 col-span-5">
          <CSSUnitInput
            id="boxSizing.left"
            className="border-transparent hover:border-gray-200"
            label={"Left"}
            disabled={_get(boxSizing, "position") !== "absolute"}
            icon={"X"}
            onChange={function (_value: any, raw): void {
              _setProps("boxSizing.left", raw);
            }}
            initialValue={uncss.parse(boxSizing.left)}
          />
        </div>
        <div className="px-1 col-span-5">
          <CSSUnitInput
            id="boxSizing.top"
            className="border-transparent hover:border-gray-200"
            label={"Top"}
            disabled={_get(boxSizing, "position") !== "absolute"}
            icon={"Y"}
            onChange={function (_value: any, raw): void {
              _setProps("boxSizing.top", raw);
            }}
            initialValue={uncss.parse(boxSizing.top)}
          />
        </div>
        <div className="px-1 col-span-2">
          <Select
            className="border-transparent hover:border-gray-200"
            label={"Box Attached"}
            withIcon={false}
            style={{
              height: 34,
              padding: "9px",
            }}
            onChange={function (value: any): void {
              setProp(
                (props: any) => _set(props, "boxSizing.position", value),
                1000
              );
            }}
            onSelectedItemRender={({ label, value }) => (
              <div className="mr-2 w-4">
                {POSITION_OPTIONS.find(({ value: v }) => value === v)?.icon}
              </div>
            )}
            onItemRender={({ label, value }) => (
              <div className="flex capitalize items-center">
                <div className="mr-2 w-4">
                  {POSITION_OPTIONS.find(({ value: v }) => value === v)?.icon}
                </div>
                <div className="grow">{label}</div>
              </div>
            )}
            options={POSITION_OPTIONS.map(({ value, label }) => ({
              label,
              value,
            }))}
            value={_get(boxSizing, "position") || ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 pb-2">
        <div className="px-1 col-span-5">
          <CSSUnitInput
            id="boxSizing.width"
            className="border-transparent hover:border-gray-200"
            label={"Width"}
            disabled={_get(boxSizing, "h_sizing") !== "fixed"}
            icon={"W"}
            onChange={function (_value: any, raw): void {
              _setProps("boxSizing.width", raw);
            }}
            initialValue={uncss.parse(boxSizing.width)}
          />
        </div>
        <div className="px-1 col-span-5">
          <CSSUnitInput
            id="boxSizing.height"
            className="border-transparent hover:border-gray-200"
            label={"Height"}
            disabled={_get(boxSizing, "v_sizing") !== "fixed"}
            icon={"H"}
            onChange={function (_value: any, raw): void {
              _setProps("boxSizing.height", raw);
            }}
            initialValue={uncss.parse(boxSizing.height)}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 pb-2">
        <div className="px-1 col-span-5">
          <Select
            className="border-transparent hover:border-gray-200 px-2"
            label={"Horizontal Resizing"}
            disabled={false}
            style={{
              height: 32,
            }}
            onChange={function (value: any): void {
              setProp((props: any) => _set(props, "boxSizing.h_sizing", value));
            }}
            options={resizingOptions}
            value={boxSizing.h_sizing}
          />
        </div>
        <div className="px-1 col-span-5">
          <Select
            className="border-transparent hover:border-gray-200 px-2"
            label={"Vertical Resizing"}
            disabled={false}
            style={{
              height: 32,
            }}
            onChange={function (value: any): void {
              setProp((prop: any) => _set(prop, "boxSizing.v_sizing", value));
            }}
            options={resizingOptions}
            value={boxSizing.v_sizing}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 pb-2">
        <div className="px-1 col-span-5">
          <CSSUnitInput
            id="boxSizing.borderTopLeftRadius"
            className="border-transparent hover:border-gray-200"
            label={"Top Left Radius"}
            icon={<CornerTopLeftIcon />}
            onChange={function (_value: any, raw): void {
              _setProps("boxSizing.borderTopLeftRadius", raw);
            }}
            initialValue={uncss.parse(boxSizing.borderTopLeftRadius)}
          />
        </div>
        <div className="px-1 col-span-5">
          <CSSUnitInput
            id="boxSizing.borderTopRightRadius"
            className="border-transparent hover:border-gray-200"
            label={"Top Right Radius"}
            icon={<CornerTopRightIcon />}
            onChange={function (_value: any, raw): void {
              _setProps("boxSizing.borderTopRightRadius", raw);
            }}
            initialValue={uncss.parse(boxSizing.borderTopRightRadius)}
          />
        </div>
        <div className="px-1 col-span-5">
          <CSSUnitInput
            id="boxSizing.borderBottomLeftRadius"
            className="border-transparent hover:border-gray-200"
            label={"Bottom Left Radius"}
            icon={<CornerBottomLeftIcon />}
            onChange={function (_value: any, raw): void {
              _setProps("boxSizing.borderBottomLeftRadius", raw);
            }}
            initialValue={uncss.parse(boxSizing.borderBottomLeftRadius)}
          />
        </div>
        <div className="px-1 col-span-5">
          <CSSUnitInput
            id="boxSizing.borderBottomRightRadius"
            className="border-transparent hover:border-gray-200"
            label={"Bottom Right Radius"}
            icon={<CornerBottomRightIcon />}
            onChange={function (_value: any, raw): void {
              _setProps("boxSizing.borderBottomRightRadius", raw);
            }}
            initialValue={uncss.parse(boxSizing.borderTopRightRadius)}
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
