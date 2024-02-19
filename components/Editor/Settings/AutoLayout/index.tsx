import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { useNode } from "@craftjs/core";
import { Toggle } from "@/components/ui/toggle";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  AlignHorizontalSpaceAroundIcon,
  AlignVerticalSpaceAroundIcon,
  MoveDownIcon,
  MoveRightIcon,
  Undo2Icon,
} from "lucide-react";
import { CSSValueInput } from "@/components/ui/css_value_input";
import React, { CSSProperties } from "react";

export interface AutoLayoutProps
  extends Pick<
    CSSProperties,
    "display" | "rowGap" | "columnGap" | "flexWrap" | "flexDirection"
  > {}

const defaultValue: Partial<AutoLayoutProps> = {
  display: undefined,
  rowGap: undefined,
  columnGap: undefined,
  flexWrap: undefined,
  flexDirection: undefined,
};

export const AutoLayout = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["autoLayout"]),
  }));
  const autoLayout: AutoLayoutProps = values.autoLayout;

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
      <div className="flex items-center pl-3 pr-1">
        <div className="grow text-xs">Direction</div>
        <div className="flex border border-transparent hover:border-gray-200 rounded-md">
          <ToggleGroup.Root
            id="autoLayout.flexDirection"
            type="single"
            value={
              _get(autoLayout, "flexDirection") ||
              _get(autoLayout, "flexWrap") ||
              ""
            }
            onValueChange={(value) => {
              setProp((props: any) => {
                _set(props, "autoLayout.flexWrap", undefined);
                _set(props, "autoLayout.flexDirection", undefined);
                _set(props, "autoLayout.display", undefined);
                if (value) {
                  _set(props, "autoLayout.display", "flex");
                  if (value === "wrap") {
                    _set(props, "autoLayout.flexWrap", "wrap");
                  } else {
                    _set(props, "autoLayout.flexDirection", value);
                  }
                } else {
                  _set(props, "autoLayout.rowGap", undefined);
                  _set(props, "autoLayout.columnGap", undefined);
                }
              }, 1000);
            }}
          >
            <ToggleGroup.Item asChild value="row">
              <Toggle>
                <MoveDownIcon size={15} />
              </Toggle>
            </ToggleGroup.Item>
            <ToggleGroup.Item asChild value="column">
              <Toggle>
                <MoveRightIcon size={15} />
              </Toggle>
            </ToggleGroup.Item>
            <ToggleGroup.Item asChild value="wrap">
              <Toggle>
                <Undo2Icon
                  size={15}
                  style={{
                    transform: "scale(1, -1)",
                  }}
                />
              </Toggle>
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
      </div>
      {(_get(autoLayout, "flexWrap") === "wrap" ||
        _get(autoLayout, "flexDirection") === "column") && (
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-xs w-full">Horizontal Gap</div>
          <CSSValueInput
            id="autoLayout.rowGap"
            className="shrink-0 w-32 border-transparent hover:border-gray-200"
            label={"Horizontal gap between items"}
            placeholder="0"
            icon={<AlignHorizontalSpaceAroundIcon size={15} />}
            onChange={function (value: any): void {
              _setPropsValue("autoLayout.columnGap", value);
            }}
            value={autoLayout.rowGap}
          />
        </div>
      )}
      {(_get(autoLayout, "flexWrap") === "wrap" ||
        _get(autoLayout, "flexDirection") === "row") && (
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-xs w-full">Vertical Gap</div>
          <CSSValueInput
            id="autoLayout.rowGap"
            className="shrink-0 w-32 border-transparent hover:border-gray-200"
            label={"Vertical gap between items"}
            placeholder="0"
            icon={<AlignVerticalSpaceAroundIcon size={15} />}
            onChange={function (value: any): void {
              _setPropsValue("autoLayout.rowGap", value);
            }}
            value={autoLayout.rowGap}
          />
        </div>
      )}
    </div>
  );
};

AutoLayout.defaultValue = defaultValue as AutoLayoutProps;
