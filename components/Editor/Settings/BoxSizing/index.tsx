import { Select } from "@/components/component/Select";
import { Button } from "@/components/ui/button";
import {
  CSSUnitValue,
  CSSUnitInput,
  uncss,
} from "@/components/ui/css_unit_input";
import { useEditor, useNode } from "@craftjs/core";
import {
  Crosshair1Icon,
  Crosshair2Icon,
  MarginIcon,
} from "@radix-ui/react-icons";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Toggle } from "@/components/ui/toggle";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import React from "react";
import { useViewport } from "../../Viewport/useViewport";

export interface BoxSizingProps {
  position: "absolute" | "relative" | undefined;
  top: string;
  left: string;
  width: string;
  height: string;
  h_sizing: "fixed" | "fill" | "hug";
  v_sizing: "fixed" | "fill" | "hug";
}

const defaultValue: Partial<BoxSizingProps> = {
  position: undefined,
  top: "auto",
  left: "auto",
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
      <div className="flex items-center pl-3 pr-1">
        <div className="grow text-sm">Position</div>
        <div className="flex border border-transparent hover:border-gray-200 rounded-md">
          <ToggleGroup.Root
            id="boxSizing.position"
            type="single"
            value={_get(boxSizing, "position")}
            onValueChange={(value) => {
              setProp(
                (props: any) => _set(props, "boxSizing.position", value),
                1000
              );
            }}
          >
            <ToggleGroup.Item asChild value="absolute">
              <Toggle>
                <Crosshair1Icon />
              </Toggle>
            </ToggleGroup.Item>
            <ToggleGroup.Item asChild value="relative">
              <Toggle>
                <Crosshair2Icon />
              </Toggle>
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
      </div>
      <div className="flex pb-2">
        <div className="px-1 w-1/2">
          <CSSUnitInput
            id="boxSizing.top"
            className="border-transparent hover:border-gray-200"
            label={"Top"}
            disabled={_get(boxSizing, "position") !== "absolute"}
            icon={"X"}
            onChange={function (_value: any, raw): void {
              _setProps("boxSizing.top", raw);
            }}
            initialValue={uncss.parse(boxSizing.top)}
          />
        </div>
        <div className="px-1 w-1/2">
          <CSSUnitInput
            id="boxSizing.left"
            className="border-transparent hover:border-gray-200"
            label={"Left"}
            disabled={_get(boxSizing, "position") !== "absolute"}
            icon={"Y"}
            onChange={function (_value: any, raw): void {
              _setProps("boxSizing.left", raw);
            }}
            initialValue={uncss.parse(boxSizing.left)}
          />
        </div>
      </div>
      <div className="flex pb-2">
        <div className="px-1 w-1/2">
          <CSSUnitInput
            id="boxSizing.width"
            className="border-transparent hover:border-gray-200"
            label={"Width"}
            disabled={false}
            icon={"W"}
            onChange={function (_value: any, raw): void {
              _setProps("boxSizing.width", raw);
            }}
            initialValue={uncss.parse(boxSizing.width)}
          />
        </div>
        <div className="px-1 w-1/2">
          <CSSUnitInput
            id="boxSizing.height"
            className="border-transparent hover:border-gray-200"
            label={"Height"}
            disabled={false}
            icon={"H"}
            onChange={function (_value: any, raw): void {
              _setProps("boxSizing.height", raw);
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
