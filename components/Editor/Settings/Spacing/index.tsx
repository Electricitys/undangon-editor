import PaddingBottomIcon from "@/components/Icons/PaddingBottomIcon";
import PaddingLeftIcon from "@/components/Icons/PaddingLeftIcon";
import PaddingRightIcon from "@/components/Icons/PaddingRightIcon";
import PaddingTopIcon from "@/components/Icons/PaddingTopIcon";
import { Button } from "@/components/ui/button";
import { CSSUnitInput, uncss } from "@/components/ui/css_unit_input";
import { useNode } from "@craftjs/core";
import { MarginIcon, PaddingIcon } from "@radix-ui/react-icons";
import { OnlyStringNumeric } from "@stitches/react/types/css";
import _pick from "lodash/pick";
import _set from "lodash/set";

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
            <CSSUnitInput
              id="spacing.marginLeft"
              className="border-transparent hover:border-gray-200"
              label={"Margin Left"}
              disabled={false}
              icon={<PaddingLeftIcon />}
              initialValue={uncss.parse(spacing.marginLeft)}
              onChange={function (_value: any, raw): void {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "spacing.marginLeft",
                      uncss.compile(raw.value, raw.unit)
                    ),
                  1000
                );
              }}
            />
          </div>
          <div className="px-1 w-1/2">
            <CSSUnitInput
              id="spacing.marginTop"
              className="border-transparent hover:border-gray-200"
              label={"Margin Top"}
              disabled={false}
              icon={<PaddingTopIcon />}
              onChange={function (_value: any, raw): void {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "spacing.marginTop",
                      uncss.compile(raw.value, raw.unit)
                    ),
                  1000
                );
              }}
              initialValue={uncss.parse(spacing.marginTop)}
            />
          </div>
        </div>
        <div className="flex pb-2">
          <div className="px-1 w-1/2">
            <CSSUnitInput
              id="spacing.marginRight"
              className="border-transparent hover:border-gray-200"
              label={"Margin Right"}
              disabled={false}
              icon={<PaddingRightIcon />}
              initialValue={uncss.parse(spacing.marginRight)}
              onChange={function (_value: any, raw): void {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "spacing.marginRight",
                      uncss.compile(raw.value, raw.unit)
                    ),
                  1000
                );
              }}
            />
          </div>
          <div className="px-1 w-1/2">
            <CSSUnitInput
              id="spacing.marginButton"
              className="border-transparent hover:border-gray-200"
              label={"Margin Bottom"}
              disabled={false}
              icon={<PaddingBottomIcon />}
              initialValue={uncss.parse(spacing.marginBottom)}
              onChange={function (_value: any, raw): void {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "spacing.marginBottom",
                      uncss.compile(raw.value, raw.unit)
                    ),
                  1000
                );
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
            <CSSUnitInput
              id="spacing.paddingLeft"
              className="border-transparent hover:border-gray-200"
              label={"Padding Left"}
              disabled={false}
              icon={<PaddingLeftIcon />}
              initialValue={uncss.parse(spacing.paddingLeft)}
              onChange={function (_value: any, raw): void {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "spacing.paddingLeft",
                      uncss.compile(raw.value, raw.unit)
                    ),
                  1000
                );
              }}
            />
          </div>
          <div className="px-1 w-1/2">
            <CSSUnitInput
              id="spacing.paddingTop"
              className="border-transparent hover:border-gray-200"
              label={"Padding Top"}
              disabled={false}
              icon={<PaddingTopIcon />}
              onChange={function (_value: any, raw): void {
                setProp((props: any) => {
                  _set(
                    props,
                    "spacing.paddingTop",
                    uncss.compile(raw.value, raw.unit)
                  ),
                    1000;
                });
              }}
              initialValue={uncss.parse(spacing.paddingTop)}
            />
          </div>
        </div>
        <div className="flex pb-2">
          <div className="px-1 w-1/2">
            <CSSUnitInput
              id="spacing.paddingRight"
              className="border-transparent hover:border-gray-200"
              label={"Padding Right"}
              disabled={false}
              icon={<PaddingRightIcon />}
              initialValue={uncss.parse(spacing.paddingRight)}
              onChange={function (_value: any, raw): void {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "spacing.paddingRight",
                      uncss.compile(raw.value, raw.unit)
                    ),
                  1000
                );
              }}
            />
          </div>
          <div className="px-1 w-1/2">
            <CSSUnitInput
              id="spacing.paddingBottom"
              className="border-transparent hover:border-gray-200"
              label={"Padding Bottom"}
              disabled={false}
              icon={<PaddingBottomIcon />}
              initialValue={uncss.parse(spacing.paddingBottom)}
              onChange={function (_value: any, raw): void {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "spacing.paddingBottom",
                      uncss.compile(raw.value, raw.unit)
                    ),
                  1000
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

Spacing.defaultValue = defaultValue as SpacingProps;
