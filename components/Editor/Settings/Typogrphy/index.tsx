import { Form } from "@/components/ui/form";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { Toggle } from "@/components/ui/toggle";
import { useNode } from "@craftjs/core";
import {
  DividerHorizontalIcon,
  FontBoldIcon,
  FontItalicIcon,
  FontSizeIcon,
  LetterCaseCapitalizeIcon,
  LetterCaseLowercaseIcon,
  LetterCaseUppercaseIcon,
  LetterSpacingIcon,
  LineHeightIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { CSSProperties } from "react";
import { useForm } from "react-hook-form";
import {
  CSSUnitInput,
  CSSUnitValue,
  uncss,
} from "@/components/ui/css_unit_input";
import { FontPicker, WebfontsFontResponse } from "@/components/ui/font-picker";
import { WrapTextIcon } from "lucide-react";
import { ColorPicker } from "@/components/ui/color_picker";

export interface TypographyProps
  extends Pick<
    CSSProperties,
    | "color"
    | "fontFamily"
    | "fontStyle"
    | "fontSize"
    | "fontWeight"
    | "textShadow"
    | "textDecoration"
    | "textAlign"
    | "textTransform"
    | "lineHeight"
    | "letterSpacing"
    | "whiteSpace"
  > {}

const defaultValue: Partial<TypographyProps> = {
  color: "inherit",
  fontFamily: "Roboto",
  fontSize: "12px",
  fontStyle: undefined,
  fontWeight: "normal",
  letterSpacing: "0px",
  lineHeight: 1,
  textAlign: "left",
  textShadow: undefined,
  textDecoration: undefined,
  whiteSpace: "pre-wrap",
};

export const Typography = () => {
  const form = useForm();

  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["typography"]),
  }));
  const typography: TypographyProps = values.typography;

  return (
    <div className="px-1">
      <Form {...form}>
        <div className="pr-1">
          <FontPicker
            className="w-full border-transparent hover:border-gray-200"
            activeFontFamily={typography.fontFamily || ""}
            onChange={function (
              font: Pick<WebfontsFontResponse, "family" | "category">
            ): void {
              setProp(
                (props: any) =>
                  _set(props, "typography.fontFamily", font.family),
                1000
              );
            }}
          />
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm w-full">Color</div>
          <ColorPicker
            className="shrink-0 w-32 border-transparent hover:border-gray-200 px-3"
            value={_get(typography, "color") || ""}
            onChange={(value: any) => {
              setProp(
                (props: any) => _set(props, "typography.color", value),
                1000
              );
            }}
          />
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm w-full">Size</div>
          <CSSUnitInput
            id="typography.fontSize"
            className="shrink-0 w-32 border-transparent hover:border-gray-200"
            label={"size"}
            icon={<FontSizeIcon />}
            initialValue={uncss.parse(typography.fontSize)}
            defaultValue={{
              value: 12,
              unit: "px",
            }}
            unitOptions={["px"]}
            onChange={function (_value: any, raw: CSSUnitValue): void {
              setProp(
                (props: any) =>
                  _set(
                    props,
                    "typography.fontSize",
                    uncss.compile(raw.value, raw.unit)
                  ),
                1000
              );
            }}
          />
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm w-full">Line Height</div>
          <CSSUnitInput
            id="typography.lineHeight"
            className="shrink-0 w-32 border-transparent hover:border-gray-200"
            label={"size"}
            icon={<LineHeightIcon />}
            initialValue={uncss.parse(typography.lineHeight)}
            defaultValue={{
              value: 1,
              unit: "",
            }}
            unitOptions={["", "px"]}
            onChange={function (_value: any, raw: CSSUnitValue): void {
              setProp(
                (props: any) =>
                  _set(
                    props,
                    "typography.lineHeight",
                    uncss.compile(raw.value, raw.unit)
                  ),
                1000
              );
            }}
          />
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm w-full">Letter Spacing</div>
          <CSSUnitInput
            id="typography.letterSpacing"
            className="shrink-0 w-32 border-transparent hover:border-gray-200"
            label={"size"}
            icon={<LetterSpacingIcon />}
            initialValue={uncss.parse(typography.letterSpacing)}
            min={-255}
            max={255}
            defaultValue={{
              value: 0,
              unit: "px",
            }}
            unitOptions={["px"]}
            onChange={function (_value: any, raw: CSSUnitValue): void {
              setProp(
                (props: any) =>
                  _set(
                    props,
                    "typography.letterSpacing",
                    uncss.compile(raw.value, raw.unit)
                  ),
                1000
              );
            }}
          />
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm">Text Decoration</div>
          <div className="flex border border-transparent hover:border-gray-200 rounded-md">
            <Toggle
              id="typography.fontStyle"
              pressed={typography.fontStyle === "italic"}
              onPressedChange={(pressed) => {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "typography.fontStyle",
                      pressed ? "italic" : undefined
                    ),
                  1000
                );
              }}
            >
              <FontItalicIcon />
            </Toggle>
            <Toggle
              id="typography.fontWeight"
              pressed={typography.fontWeight === "bold"}
              onPressedChange={(pressed) => {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "typography.fontWeight",
                      pressed ? "bold" : undefined
                    ),
                  1000
                );
              }}
            >
              <FontBoldIcon />
            </Toggle>
            <Toggle
              id="typography.textDecoration"
              pressed={typography.textDecoration === "underline"}
              onPressedChange={(pressed) => {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "typography.textDecoration",
                      pressed ? "underline" : undefined
                    ),
                  1000
                );
              }}
            >
              <UnderlineIcon />
            </Toggle>
          </div>
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm">Aligment</div>

          <div className="flex border border-transparent hover:border-gray-200 rounded-md">
            <ToggleGroup.Root
              id="typography.textAlign"
              type="single"
              value={_get(typography, "textAlign")}
              onValueChange={(value) => {
                setProp(
                  (props: any) => _set(props, "typography.textAlign", value),
                  1000
                );
              }}
            >
              <ToggleGroup.Item asChild value="left">
                <Toggle>
                  <TextAlignLeftIcon />
                </Toggle>
              </ToggleGroup.Item>
              <ToggleGroup.Item asChild value="center">
                <Toggle>
                  <TextAlignCenterIcon />
                </Toggle>
              </ToggleGroup.Item>
              <ToggleGroup.Item asChild value={"right"}>
                <Toggle>
                  <TextAlignRightIcon />
                </Toggle>
              </ToggleGroup.Item>
              <ToggleGroup.Item asChild value={"justify"}>
                <Toggle>
                  <TextAlignJustifyIcon />
                </Toggle>
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm">Case</div>

          <div className="flex border border-transparent hover:border-gray-200 rounded-md">
            <ToggleGroup.Root
              id="typography.textTransform"
              type="single"
              value={_get(typography, "textTransform")}
              onValueChange={(value) => {
                setProp(
                  (props: any) =>
                    _set(props, "typography.textTransform", value),
                  1000
                );
              }}
            >
              <ToggleGroup.Item asChild value="uppercase">
                <Toggle>
                  <LetterCaseUppercaseIcon />
                </Toggle>
              </ToggleGroup.Item>
              <ToggleGroup.Item asChild value="lowercase">
                <Toggle>
                  <LetterCaseLowercaseIcon />
                </Toggle>
              </ToggleGroup.Item>
              <ToggleGroup.Item asChild value="capitalize">
                <Toggle>
                  <LetterCaseCapitalizeIcon />
                </Toggle>
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm">Wrap</div>

          <div className="flex border border-transparent hover:border-gray-200 rounded-md">
            <ToggleGroup.Root
              id="typography.whiteSpace"
              type="single"
              value={_get(typography, "whiteSpace")}
              onValueChange={(value) => {
                setProp(
                  (props: any) => _set(props, "typography.whiteSpace", value),
                  1000
                );
              }}
            >
              <ToggleGroup.Item asChild value="pre-wrap">
                <Toggle>
                  <WrapTextIcon size={15} />
                </Toggle>
              </ToggleGroup.Item>
              <ToggleGroup.Item asChild value="unset">
                <Toggle>
                  <DividerHorizontalIcon />
                </Toggle>
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
        </div>
      </Form>
    </div>
  );
};

Typography.defaultValue = defaultValue as TypographyProps;
