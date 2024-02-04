import { Select } from "@/components/component/Select";
import {
  CSSUnitValue,
  CSSUnitInput,
  uncss,
} from "@/components/ui/css_unit_input";
import { useEditor, useNode } from "@craftjs/core";
import {
  AlignCenterHorizontallyIcon,
  AlignCenterVerticallyIcon,
  BoxIcon,
  CornerBottomLeftIcon,
  CornerBottomRightIcon,
  CornerTopLeftIcon,
  CornerTopRightIcon,
  Crosshair1Icon,
  Crosshair2Icon,
  SpaceBetweenHorizontallyIcon,
  SpaceBetweenVerticallyIcon,
} from "@radix-ui/react-icons";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import React from "react";
import { CSSValueInput } from "@/components/ui/css_value_input";
import { parseIntSafeForInput } from "@/components/utils/parseIntSafe";

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
  minWidth: string;
  minHeight: string;
  maxWidth: string;
  maxHeight: string;
  h_sizing: "fixed" | "fill" | "hug";
  v_sizing: "fixed" | "fill" | "hug";
  borderTopLeftRadius: string;
  borderTopRightRadius: string;
  borderBottomLeftRadius: string;
  borderBottomRightRadius: string;
}

const defaultValue: Partial<BoxSizingProps> = {
  position: undefined,
  top: undefined,
  left: undefined,
  width: undefined,
  height: undefined,
  minWidth: undefined,
  minHeight: undefined,
  maxWidth: undefined,
  maxHeight: undefined,
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
    clientWidth,
    clientHeight,
    clientTop,
    clientLeft,
  } = useNode((node) => {
    return {
      values: _pick(node.data.props, ["boxSizing"]),
      dom: node.dom,
      clientWidth: node.dom?.clientWidth,
      clientHeight: node.dom?.clientHeight,
      clientTop: node.dom?.clientTop,
      clientLeft: node.dom?.clientLeft,
    };
  });

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

  const minMaxHeight = React.useState({
    min: typeof _get(boxSizing, "minHeight") !== "undefined",
    max: typeof _get(boxSizing, "maxHeight") !== "undefined",
  });
  const minMaxWidth = React.useState({
    min: typeof _get(boxSizing, "minWidth") !== "undefined",
    max: typeof _get(boxSizing, "maxWidth") !== "undefined",
  });

  return (
    <div className="px-2">
      <div className="grid grid-cols-12 pb-2">
        <div className="px-1 col-span-5">
          <CSSValueInput
            id="boxSizing.left"
            className="border-transparent hover:border-gray-200"
            placeholder={parseIntSafeForInput(clientLeft as any, "0")}
            label={"Left"}
            disabled={_get(boxSizing, "position") !== "absolute"}
            icon={"X"}
            onChange={(value: any) => {
              _setPropsValue("boxSizing.left", value);
            }}
            value={boxSizing.left}
          />
        </div>
        <div className="px-1 col-span-5">
          <CSSValueInput
            id="boxSizing.top"
            className="border-transparent hover:border-gray-200"
            placeholder={parseIntSafeForInput(clientTop as any, "0")}
            label={"Top"}
            disabled={_get(boxSizing, "position") !== "absolute"}
            icon={"Y"}
            onChange={(value: any) => {
              _setPropsValue("boxSizing.left", value);
            }}
            value={boxSizing.top}
          />
        </div>
        <div className="px-1 col-span-2">
          <Select
            className="border-transparent hover:border-gray-200"
            label={"Box Attached"}
            withIcon={false}
            style={{
              height: 34,
              padding: "9px 0 9px 9px",
            }}
            onChange={function (value: any): void {
              setProp(
                (props: any) => _set(props, "boxSizing.position", value),
                1000
              );
            }}
            onSelectedItemRender={({ label, value }) => {
              return (
                <div className="mr-2 w-4">
                  {POSITION_OPTIONS.find(({ value: v }) => value === v)?.icon}
                </div>
              );
            }}
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
      <div className="grid grid-cols-12">
        <div className="px-1 col-span-5">
          <CSSValueInput
            id="boxSizing.width"
            className="border-transparent hover:border-gray-200 mb-2"
            placeholder={parseIntSafeForInput(clientWidth as any, "0")}
            label={"Width"}
            disabled={_get(boxSizing, "h_sizing") !== "fixed"}
            icon={"W"}
            onChange={function (value: any): void {
              _setPropsValue("boxSizing.width", value);
            }}
            value={boxSizing.width}
            actions={
              <div className="flex flex-col">
                <button
                  className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                  onClick={() =>
                    minMaxWidth[1]((s) => {
                      return { ...s, min: true };
                    })
                  }
                >
                  <AlignCenterHorizontallyIcon className="mr-2 h-4 w-4" />
                  <span>Min Width</span>
                </button>
                <button
                  className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                  onClick={() =>
                    minMaxWidth[1]((s) => {
                      return { ...s, max: true };
                    })
                  }
                >
                  <SpaceBetweenHorizontallyIcon className="mr-2 h-4 w-4" />
                  <span>Max Width</span>
                </button>
              </div>
            }
          />
          {minMaxWidth[0].min && (
            <CSSValueInput
              id="boxSizing.minWidth"
              className="border-transparent hover:border-gray-200 mb-2"
              label={"Min Width"}
              placeholder={"Min W"}
              icon={<AlignCenterHorizontallyIcon className="h-4 w-4" />}
              onChange={function (value: any): void {
                _setPropsValue("boxSizing.minWidth", value);
              }}
              value={boxSizing.minWidth}
              actions={
                <div className="flex flex-col">
                  <button className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                    <span>Set to current width</span>
                  </button>
                  <button
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                    onClick={() => {
                      _setProps("boxSizing.minWidth", {
                        value: undefined,
                        unit: undefined,
                      });
                      minMaxWidth[1]((s) => {
                        return { ...s, min: false };
                      });
                    }}
                  >
                    <span>Remove Min Width</span>
                  </button>
                </div>
              }
            />
          )}
          {minMaxWidth[0].max && (
            <CSSValueInput
              id="boxSizing.maxWidth"
              className="border-transparent hover:border-gray-200 mb-2"
              label={"Max Width"}
              placeholder={"Max W"}
              icon={<SpaceBetweenHorizontallyIcon className="h-4 w-4" />}
              onChange={function (value: any): void {
                _setPropsValue("boxSizing.maxWidth", value);
              }}
              value={boxSizing.maxWidth}
              actions={
                <div className="flex flex-col">
                  <button className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                    <span>Set to current width</span>
                  </button>
                  <button
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                    onClick={() => {
                      _setProps("boxSizing.maxWidth", {
                        value: undefined,
                        unit: undefined,
                      });
                      minMaxWidth[1]((s) => {
                        return { ...s, max: false };
                      });
                    }}
                  >
                    <span>Remove Max Width</span>
                  </button>
                </div>
              }
            />
          )}
        </div>
        <div className="px-1 col-span-5">
          <CSSValueInput
            id="boxSizing.height"
            className="border-transparent hover:border-gray-200 mb-2"
            label={"Height"}
            placeholder={parseIntSafeForInput(clientHeight as any, "0")}
            disabled={_get(boxSizing, "v_sizing") !== "fixed"}
            icon={"H"}
            onChange={function (value: any): void {
              _setProps("boxSizing.height", value);
            }}
            value={boxSizing.height}
            actions={
              <div className="flex flex-col">
                <button
                  className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                  onClick={() =>
                    minMaxHeight[1]((s) => {
                      return { ...s, min: true };
                    })
                  }
                >
                  <AlignCenterVerticallyIcon className="h-4 w-4" />
                  <span>Min Height</span>
                </button>
                <button
                  className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                  onClick={() =>
                    minMaxHeight[1]((s) => {
                      return { ...s, max: true };
                    })
                  }
                >
                  <SpaceBetweenVerticallyIcon className="mr-2 h-4 w-4" />
                  <span>Max Height</span>
                </button>
              </div>
            }
          />
          {minMaxHeight[0].min && (
            <CSSValueInput
              id="boxSizing.minHeight"
              className="border-transparent hover:border-gray-200 mb-2"
              label={"Min Height"}
              placeholder={"Min H"}
              icon={<AlignCenterHorizontallyIcon className="h-4 w-4" />}
              onChange={function (value: any): void {
                _setPropsValue("boxSizing.minHeight", value);
              }}
              value={boxSizing.minHeight}
              actions={
                <div className="flex flex-col">
                  <button className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                    <span>Set to current Height</span>
                  </button>
                  <button
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                    onClick={() => {
                      _setProps("boxSizing.minHeight", {
                        value: undefined,
                        unit: undefined,
                      });
                      minMaxHeight[1]((s) => {
                        return { ...s, min: false };
                      });
                    }}
                  >
                    <span>Remove Min Height</span>
                  </button>
                </div>
              }
            />
          )}
          {minMaxHeight[0].max && (
            <CSSValueInput
              id="boxSizing.maxHeight"
              className="border-transparent hover:border-gray-200 mb-2"
              label={"Max Height"}
              placeholder="Max H"
              icon={<SpaceBetweenHorizontallyIcon className="h-4 w-4" />}
              onChange={function (value: any): void {
                _setProps("boxSizing.maxHeight", value);
              }}
              value={boxSizing.maxHeight}
              actions={
                <div className="flex flex-col">
                  <button className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                    <span>Set to current Height</span>
                  </button>
                  <button
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                    onClick={() => {
                      _setProps("boxSizing.maxHeight", {
                        value: undefined,
                        unit: undefined,
                      });
                      minMaxHeight[1]((s) => {
                        return { ...s, max: false };
                      });
                    }}
                  >
                    <span>Remove Max Height</span>
                  </button>
                </div>
              }
            />
          )}
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
          <CSSValueInput
            id="boxSizing.borderTopLeftRadius"
            className="border-transparent hover:border-gray-200"
            label={"Top Left Radius"}
            placeholder="0"
            icon={<CornerTopLeftIcon />}
            onChange={function (value: any): void {
              _setPropsValue("boxSizing.borderTopLeftRadius", value);
            }}
            value={boxSizing.borderTopLeftRadius}
          />
        </div>
        <div className="px-1 col-span-5">
          <CSSValueInput
            id="boxSizing.borderTopRightRadius"
            className="border-transparent hover:border-gray-200"
            label={"Top Right Radius"}
            placeholder="0"
            icon={<CornerTopRightIcon />}
            onChange={function (value: any): void {
              _setPropsValue("boxSizing.borderTopRightRadius", value);
            }}
            value={boxSizing.borderTopRightRadius}
          />
        </div>
        <div className="px-1 col-span-5">
          <CSSValueInput
            id="boxSizing.borderBottomLeftRadius"
            className="border-transparent hover:border-gray-200"
            label={"Bottom Left Radius"}
            placeholder="0"
            icon={<CornerBottomLeftIcon />}
            onChange={function (value: any): void {
              _setPropsValue("boxSizing.borderBottomLeftRadius", value);
            }}
            value={boxSizing.borderBottomLeftRadius}
          />
        </div>
        <div className="px-1 col-span-5">
          <CSSValueInput
            id="boxSizing.borderBottomRightRadius"
            className="border-transparent hover:border-gray-200"
            label={"Bottom Right Radius"}
            placeholder="0"
            icon={<CornerBottomRightIcon />}
            onChange={function (value: any): void {
              _setPropsValue("boxSizing.borderBottomRightRadius", value);
            }}
            value={boxSizing.borderTopRightRadius}
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
