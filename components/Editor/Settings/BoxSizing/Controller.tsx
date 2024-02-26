import { Select } from "@/components/component/Select";
import {
  AlignCenterHorizontallyIcon,
  AlignCenterVerticallyIcon,
  AngleIcon,
  BoxIcon,
  CornerBottomLeftIcon,
  CornerBottomRightIcon,
  CornerTopLeftIcon,
  CornerTopRightIcon,
  CornersIcon,
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
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { BoxSizingProps } from ".";

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

type BoxSizingControllerProps = {
  values: BoxSizingProps;
  onChange: (path: string, value?: any) => void;
  placeholders?: Partial<BoxSizingProps>;
  options?: {};
};

export const BoxSizingController = ({
  values,
  onChange,
  placeholders,
  options,
}: BoxSizingControllerProps) => {
  const boxSizing: BoxSizingProps = values;

  const minMaxHeight = React.useState({
    min: typeof _get(boxSizing, "minHeight") !== "undefined",
    max: typeof _get(boxSizing, "maxHeight") !== "undefined",
  });
  const minMaxWidth = React.useState({
    min: typeof _get(boxSizing, "minWidth") !== "undefined",
    max: typeof _get(boxSizing, "maxWidth") !== "undefined",
  });

  const [isMixed, setIsMixed] = React.useState(
    ![
      _get(boxSizing, "borderTopLeftRadius"),
      _get(boxSizing, "borderTopRightRadius"),
      _get(boxSizing, "borderBottomLeftRadius"),
      _get(boxSizing, "borderBottomRightRadius"),
    ].every((value, _index, array) => value === array[0])
  );

  return (
    <div className="px-2">
      <div className="grid grid-cols-12 pb-2">
        <div className="px-1 col-span-5">
          <CSSValueInput
            id="boxSizing.left"
            className="border-transparent hover:border-gray-200"
            placeholder={parseIntSafeForInput(
              _get(placeholders, "left") as any,
              "0"
            )}
            label={"Left"}
            disabled={_get(boxSizing, "position") !== "absolute"}
            icon={"X"}
            onChange={(value: any) => {
              onChange("left", value);
            }}
            value={_get(boxSizing, "left")}
          />
        </div>
        <div className="px-1 col-span-5">
          <CSSValueInput
            id="boxSizing.top"
            className="border-transparent hover:border-gray-200"
            placeholder={parseIntSafeForInput(
              _get(placeholders, "top") as any,
              "0"
            )}
            label={"Top"}
            disabled={_get(boxSizing, "position") !== "absolute"}
            icon={"Y"}
            onChange={(value: any) => {
              onChange("top", value);
            }}
            value={_get(boxSizing, "top")}
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
              onChange("position", value);
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
            placeholder={parseIntSafeForInput(
              _get(boxSizing, "width") as any,
              "0"
            )}
            label={"Width"}
            disabled={_get(boxSizing, "h_sizing") !== "fixed"}
            icon={"W"}
            onChange={function (value: any): void {
              onChange("width", value);
            }}
            value={boxSizing.width}
            actions={
              <div className="flex flex-col">
                <PopoverClose asChild>
                  <button
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                    onClick={() => {
                      minMaxWidth[1]((s) => {
                        return { ...s, min: true };
                      });
                    }}
                  >
                    <AlignCenterHorizontallyIcon className="mr-2 h-4 w-4" />
                    <span>Min Width</span>
                  </button>
                </PopoverClose>
                <PopoverClose asChild>
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
                </PopoverClose>
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
                onChange("minWidth", value);
              }}
              value={_get(boxSizing, "minWidth")}
              actions={
                <div className="flex flex-col">
                  <button className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                    <span>Set to current width</span>
                  </button>
                  <button
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                    onClick={() => {
                      onChange("minWidth", undefined);
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
                onChange("maxWidth", value);
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
                      onChange("maxWidth", undefined);
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
            placeholder={parseIntSafeForInput(
              _get(boxSizing, "clientHeight") as any,
              "0"
            )}
            disabled={_get(boxSizing, "v_sizing") !== "fixed"}
            icon={"H"}
            onChange={function (value: any): void {
              onChange("height", value);
            }}
            value={_get(boxSizing, "height")}
            actions={
              <div className="flex flex-col">
                <PopoverClose asChild>
                  <button
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                    onClick={() =>
                      minMaxHeight[1]((s) => {
                        return { ...s, min: true };
                      })
                    }
                  >
                    <AlignCenterVerticallyIcon className="mr-2 h-4 w-4" />
                    <span>Min Height</span>
                  </button>
                </PopoverClose>

                <PopoverClose asChild>
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
                </PopoverClose>
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
                onChange("minHeight", value);
              }}
              value={_get(boxSizing, "minHeight")}
              actions={
                <div className="flex flex-col">
                  <button className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                    <span>Set to current Height</span>
                  </button>
                  <button
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                    onClick={() => {
                      onChange("minHeight", undefined);
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
                onChange("maxHeight", value);
              }}
              value={_get(boxSizing, "maxHeight")}
              actions={
                <div className="flex flex-col">
                  <button className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                    <span>Set to current Height</span>
                  </button>
                  <button
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                    onClick={() => {
                      onChange("maxHeight", undefined);
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
              onChange("h_sizing", value);
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
              onChange("v_sizing", value);
            }}
            options={resizingOptions}
            value={_get(boxSizing, "v_sizing")}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 pb-2">
        <div className="px-1 col-span-5">
          <CSSValueInput
            id="boxSizing.transform.rotate"
            className="border-transparent hover:border-gray-200"
            label={"Rotation"}
            placeholder="0"
            icon={<AngleIcon />}
            defaultUnit="deg"
            onChange={function (value) {
              onChange("transform.rotate", value);
            }}
            value={_get(boxSizing, "transform.rotate")}
          />
        </div>
        <div className="px-1 col-span-5">
          <CSSValueInput
            id="boxSizing.borderTopLeftRadius"
            className="border-transparent hover:border-gray-200"
            label={"Border Radius"}
            readOnly={isMixed}
            placeholder="0"
            icon={<CornerTopLeftIcon />}
            onChange={function (value: any): void {
              onChange("borderRadius", {
                borderTopLeftRadius: value,
                borderTopRightRadius: value,
                borderBottomLeftRadius: value,
                borderBottomRightRadius: value,
              });
            }}
            value={isMixed ? "Mixed" : _get(boxSizing, "borderTopLeftRadius")}
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
            <CornersIcon />
          </Button>
        </div>
        {isMixed && (
          <>
            <div className="px-1 col-span-5">
              <CSSValueInput
                id="boxSizing.borderTopLeftRadius"
                className="border-transparent hover:border-gray-200"
                label={"Top Left Radius"}
                placeholder="0"
                icon={<CornerTopLeftIcon />}
                onChange={function (value: any): void {
                  onChange("borderTopLeftRadius", value);
                }}
                value={_get(boxSizing, "borderTopLeftRadius")}
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
                  onChange("borderTopRightRadius", value);
                }}
                value={_get(boxSizing, "borderTopRightRadius")}
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
                  onChange("borderBottomLeftRadius", value);
                }}
                value={_get(boxSizing, "borderBottomLeftRadius")}
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
                  onChange("borderBottomRightRadius", value);
                }}
                value={_get(boxSizing, "borderBottomRightRadius")}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

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
