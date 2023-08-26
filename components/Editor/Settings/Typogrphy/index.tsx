import { Form } from "@/components/ui/form";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { Toggle } from "@/components/ui/toggle";
import { useNode } from "@craftjs/core";
import {
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
  TextAlignMiddleIcon,
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
  > {}

const defaultValue: Partial<TypographyProps> = {
  textAlign: "left",
  textShadow: undefined,
  textDecoration: undefined,
  lineHeight: "12px",
  letterSpacing: "0%",
  fontSize: 12,
  fontStyle: undefined,
  fontWeight: "normal",
  fontFamily: "Roboto",
  color: "inherit",
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
        <div className="pb-2 pr-1">
          <FontPicker
            className="w-full"
            activeFontFamily={typography.fontFamily || ""}
            onChange={function (
              font: Pick<WebfontsFontResponse, "family" | "category">
            ): void {
              setProp((props: any) =>
                _set(props, "typography.fontFamily", font.family)
              );
            }}
          />
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm w-full">Size</div>
          <CSSUnitInput
            label={"size"}
            icon={<FontSizeIcon />}
            initialValue={uncss.parse(typography.fontSize)}
            defaultValue={{
              value: "12",
              unit: "px",
            }}
            unitOptions={["px"]}
            onChange={function (value: any, raw: CSSUnitValue): void {
              setProp((props: any) =>
                _set(
                  props,
                  "typography.fontSize",
                  uncss.compile(raw.value, raw.unit)
                )
              );
            }}
          />
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm w-full">Line Height</div>
          <CSSUnitInput
            label={"size"}
            icon={<LineHeightIcon />}
            initialValue={uncss.parse(typography.lineHeight)}
            defaultValue={{
              value: "12",
              unit: "px",
            }}
            unitOptions={["px"]}
            onChange={function (value: any, raw: CSSUnitValue): void {
              setProp((props: any) =>
                _set(
                  props,
                  "typography.lineHeight",
                  uncss.compile(raw.value, raw.unit)
                )
              );
            }}
          />
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm w-full">Letter Spacing</div>
          <CSSUnitInput
            label={"size"}
            icon={<LetterSpacingIcon />}
            initialValue={uncss.parse(typography.lineHeight)}
            defaultValue={{
              value: "0",
              unit: "%",
            }}
            unitOptions={["%"]}
            onChange={function (value: any, raw: CSSUnitValue): void {
              setProp((props: any) =>
                _set(
                  props,
                  "typography.lineHeight",
                  uncss.compile(raw.value, raw.unit)
                )
              );
            }}
          />
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm">Text Decoration</div>
          <Toggle
            pressed={typography.fontStyle === "italic"}
            onPressedChange={(pressed) => {
              setProp((props: any) =>
                _set(
                  props,
                  "typography.fontStyle",
                  pressed ? "italic" : undefined
                )
              );
            }}
          >
            <FontItalicIcon />
          </Toggle>
          <Toggle
            pressed={typography.fontWeight === "bold"}
            onPressedChange={(pressed) => {
              setProp((props: any) =>
                _set(
                  props,
                  "typography.fontWeight",
                  pressed ? "bold" : undefined
                )
              );
            }}
          >
            <FontBoldIcon />
          </Toggle>
          <Toggle
            pressed={typography.textDecoration === "underline"}
            onPressedChange={(pressed) => {
              setProp((props: any) =>
                _set(
                  props,
                  "typography.textDecoration",
                  pressed ? "underline" : undefined
                )
              );
            }}
          >
            <UnderlineIcon />
          </Toggle>
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm">Aligment</div>
          <ToggleGroup.Root
            type="single"
            value={_get(typography, "textAlign")}
            onValueChange={(value) => {
              setProp((props: any) =>
                _set(props, "typography.textAlign", value)
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
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm">Case</div>
          <ToggleGroup.Root
            type="single"
            value={_get(typography, "textTransform")}
            onValueChange={(value) => {
              setProp((props: any) =>
                _set(props, "typography.textTransform", value)
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
      </Form>
    </div>
  );
};

Typography.defaultValue = defaultValue as TypographyProps;
