import PaddingBottomIcon from "@/components/Icons/PaddingBottomIcon";
import PaddingLeftIcon from "@/components/Icons/PaddingLeftIcon";
import PaddingRightIcon from "@/components/Icons/PaddingRightIcon";
import PaddingTopIcon from "@/components/Icons/PaddingTopIcon";
import { Button } from "@/components/ui/button";
import {
  CSSUnitValue,
  CSSUnitInput,
  uncss,
} from "@/components/ui/css_unit_input";
import { CSSValueInput } from "@/components/ui/css_value_input";
import { parseIntSafeForInput } from "@/components/utils/parseIntSafe";
import { useNode } from "@craftjs/core";
import { MarginIcon, PaddingIcon } from "@radix-ui/react-icons";
import { OnlyStringNumeric } from "@stitches/react/types/css";
import _pick from "lodash/pick";
import _set from "lodash/set";
import React from "react";

export interface SpacingProps {
  marginTop: "auto" | OnlyStringNumeric;
  marginRight: "auto" | OnlyStringNumeric;
  marginLeft: "auto" | OnlyStringNumeric;
  marginBottom: "auto" | OnlyStringNumeric;
  paddingTop: "auto" | OnlyStringNumeric;
  paddingRight: "auto" | OnlyStringNumeric;
  paddingLeft: "auto" | OnlyStringNumeric;
  paddingBottom: "auto" | OnlyStringNumeric;
}

const defaultValue: Partial<SpacingProps> = {
  marginTop: undefined,
  marginRight: undefined,
  marginBottom: undefined,
  marginLeft: undefined,
  paddingTop: undefined,
  paddingRight: undefined,
  paddingBottom: undefined,
  paddingLeft: undefined,
};

export const Spacing = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["spacing"]),
  }));

  const spacing: SpacingProps = values.spacing;

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

  return (
    <>
      <div className="px-2 pt-1">
        <div className="px-2 py-2 flex text-sm items-center">
          <div className="grow">Margin</div>
          <div>
            <Button variant={"ghost"} size={"icon"} className="w-7 h-7">
              <MarginIcon />
            </Button>
          </div>
        </div>
        <div className="flex pb-2">
          <div className="px-1 w-1/2">
            <CSSValueInput
              id="spacing.marginLeft"
              className="border-transparent hover:border-gray-200"
              placeholder={parseIntSafeForInput(spacing.marginLeft as any, "0")}
              label={"Margin Left"}
              disabled={false}
              icon={<PaddingLeftIcon />}
              value={spacing.marginLeft}
              onChange={function (value) {
                _setPropsValue("spacing.marginLeft", value);
              }}
            />
          </div>
          <div className="px-1 w-1/2">
            <CSSValueInput
              id="spacing.marginTop"
              className="border-transparent hover:border-gray-200"
              placeholder={parseIntSafeForInput(spacing.marginTop as any, "0")}
              label={"Margin Top"}
              disabled={false}
              icon={<PaddingTopIcon />}
              value={spacing.marginTop}
              onChange={function (value) {
                _setPropsValue("spacing.marginTop", value);
              }}
            />
          </div>
        </div>
        <div className="flex pb-2">
          <div className="px-1 w-1/2">
            <CSSValueInput
              id="spacing.marginRight"
              className="border-transparent hover:border-gray-200"
              placeholder={parseIntSafeForInput(
                spacing.marginRight as any,
                "0"
              )}
              label={"Margin Right"}
              disabled={false}
              icon={<PaddingRightIcon />}
              value={spacing.marginRight}
              onChange={function (value) {
                _setPropsValue("spacing.marginRight", value);
              }}
            />
          </div>
          <div className="px-1 w-1/2">
            <CSSValueInput
              id="spacing.marginButton"
              className="border-transparent hover:border-gray-200"
              placeholder={parseIntSafeForInput(
                spacing.marginBottom as any,
                "0"
              )}
              label={"Margin Bottom"}
              disabled={false}
              icon={<PaddingBottomIcon />}
              value={spacing.marginBottom}
              onChange={function (value): void {
                _setPropsValue("spacing.marginBottom", value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="px-2 pt-1">
        <div className="px-2 py-2 flex text-sm items-center">
          <div className="grow">Padding</div>
          <div>
            <Button variant={"ghost"} size={"icon"} className="w-7 h-7">
              <PaddingIcon />
            </Button>
          </div>
        </div>
        <div className="flex pb-2">
          <div className="px-1 w-1/2">
            <CSSValueInput
              id="spacing.paddingLeft"
              className="border-transparent hover:border-gray-200"
              placeholder={parseIntSafeForInput(
                spacing.paddingLeft as any,
                "0"
              )}
              label={"Padding Left"}
              disabled={false}
              icon={<PaddingLeftIcon />}
              value={spacing.paddingLeft}
              onChange={function (value) {
                _setPropsValue("spacing.paddingLeft", value);
              }}
            />
          </div>
          <div className="px-1 w-1/2">
            <CSSValueInput
              id="spacing.paddingTop"
              className="border-transparent hover:border-gray-200"
              placeholder={parseIntSafeForInput(spacing.paddingTop as any, "0")}
              label={"Padding Top"}
              disabled={false}
              icon={<PaddingTopIcon />}
              onChange={function (value) {
                _setPropsValue("spacing.paddingTop", value);
              }}
              value={spacing.paddingTop}
            />
          </div>
        </div>
        <div className="flex pb-2">
          <div className="px-1 w-1/2">
            <CSSValueInput
              id="spacing.paddingRight"
              className="border-transparent hover:border-gray-200"
              placeholder={parseIntSafeForInput(
                spacing.paddingRight as any,
                "0"
              )}
              label={"Padding Right"}
              disabled={false}
              icon={<PaddingRightIcon />}
              value={spacing.paddingRight}
              onChange={function (value) {
                _setPropsValue("spacing.paddingRight", value);
              }}
            />
          </div>
          <div className="px-1 w-1/2">
            <CSSValueInput
              id="spacing.paddingBottom"
              className="border-transparent hover:border-gray-200"
              placeholder={parseIntSafeForInput(
                spacing.paddingBottom as any,
                "0"
              )}
              label={"Padding Bottom"}
              disabled={false}
              icon={<PaddingBottomIcon />}
              value={spacing.paddingBottom}
              onChange={function (value) {
                _setPropsValue("spacing.paddingBottom", value);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

Spacing.defaultValue = defaultValue as SpacingProps;
