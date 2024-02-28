import { CSSValueInput } from "@/components/ui/css_value_input";
import React from "react";
import _get from "lodash/get";
import { TransformProperties } from "./types";
import { Button } from "@/components/ui/button";
import { AnchorIcon, CircleSlash2Icon } from "lucide-react";
import {
  AngleIcon,
  Crosshair1Icon,
  Crosshair2Icon,
} from "@radix-ui/react-icons";

export type MotionKeyframeProperties = TransformProperties & {
  id: string;
};

export type MotionTransformInputProps = {
  values: Partial<MotionKeyframeProperties>;
  placeholders?: Partial<MotionKeyframeProperties>;
  onChange?: (values: Partial<MotionKeyframeProperties>) => void;
  onValueChange?: (path: keyof MotionKeyframeProperties, value: any) => void;
};

export const MotionTransformInput: React.FC<
  React.PropsWithChildren<MotionTransformInputProps>
> = ({ values, placeholders, onChange, onValueChange }) => {
  const handleChange = (path: keyof MotionKeyframeProperties, value: any) => {
    onValueChange?.(path, value);
    onChange?.({ ...values, [path]: value });
  };
  return (
    <>
      <div className="flex pb-2 items-center">
        <div className="pl-1">
          <Button size={"icon-sm"} variant="ghost" title="Anchor Point">
            <Crosshair2Icon />
          </Button>
        </div>
        <div className="grid grid-cols-12">
          <div className="pr-1 col-span-4">
            <CSSValueInput
              className="border-transparent hover:border-gray-200"
              label={"Anchor X"}
              placeholder={_get(placeholders, "originX") || "0"}
              icon={"X"}
              defaultUnit=""
              onChange={function (value) {
                handleChange("originX", value);
              }}
              value={_get(values, "originX") as string}
            />
          </div>
          <div className="px-1 col-span-4">
            <CSSValueInput
              className="border-transparent hover:border-gray-200"
              label={"Anchor Y"}
              placeholder={_get(placeholders, "originY") || "0"}
              icon={"Y"}
              defaultUnit=""
              onChange={function (value) {
                handleChange("originY", value);
              }}
              value={_get(values, "originY") as string}
            />
          </div>
        </div>
      </div>

      <div className="flex pb-2 items-center">
        <div className="pl-1">
          <Button size={"icon-sm"} variant="ghost" title="Transform">
            <Crosshair1Icon />
          </Button>
        </div>
        <div className="grid grid-cols-12">
          <div className="pr-1 col-span-4">
            <CSSValueInput
              className="border-transparent hover:border-gray-200"
              label={"Transform X"}
              placeholder={_get(placeholders, "translateX") || "0"}
              icon={"X"}
              defaultUnit=""
              onChange={function (value) {
                handleChange("translateX", value);
              }}
              value={_get(values, "translateX") as string}
            />
          </div>
          <div className="px-1 col-span-4">
            <CSSValueInput
              className="border-transparent hover:border-gray-200"
              label={"Transform Y"}
              placeholder={_get(placeholders, "translateY") || "0"}
              icon={"Y"}
              defaultUnit=""
              onChange={function (value) {
                handleChange("translateY", value);
              }}
              value={_get(values, "translateY") as string}
            />
          </div>
          <div className="px-1 col-span-4">
            <CSSValueInput
              className="border-transparent hover:border-gray-200"
              label={"Transform Z"}
              placeholder={_get(placeholders, "translateZ") || "0"}
              icon={"Z"}
              defaultUnit=""
              onChange={function (value) {
                handleChange("translateZ", value);
              }}
              value={_get(values, "translateZ") as string}
            />
          </div>
        </div>
      </div>
      <div className="flex pb-2 items-center">
        <div className="pl-1">
          <Button size={"icon-sm"} variant="ghost" title="Scale">
            S
          </Button>
        </div>
        <div className="grid grid-cols-12">
          <div className="pr-1 col-span-4">
            <CSSValueInput
              className="border-transparent hover:border-gray-200"
              label={"Scale X"}
              placeholder={_get(placeholders, "scaleX") || "0"}
              icon={"X"}
              defaultUnit=""
              onChange={function (value) {
                handleChange("scaleX", value);
              }}
              value={_get(values, "scaleX") as string}
            />
          </div>
          <div className="px-1 col-span-4">
            <CSSValueInput
              className="border-transparent hover:border-gray-200"
              label={"Scale Y"}
              placeholder={_get(placeholders, "scaleY") || "0"}
              icon={"Y"}
              defaultUnit=""
              onChange={function (value) {
                handleChange("scaleY", value);
              }}
              value={_get(values, "scaleY") as string}
            />
          </div>
        </div>
      </div>
      <div className="flex pb-2 items-center">
        <div className="pl-1">
          <Button size={"icon-sm"} variant="ghost" title="Rotate">
            <AngleIcon />
          </Button>
        </div>
        <div className="grid grid-cols-12">
          <div className="pr-1 col-span-4">
            <CSSValueInput
              className="border-transparent hover:border-gray-200"
              label={"Rotate"}
              placeholder={_get(placeholders, "rotate") || "0"}
              defaultUnit=""
              icon={<CircleSlash2Icon size={15} />}
              onChange={function (value) {
                handleChange("rotate", value);
              }}
              value={_get(values, "rotate") as string}
            />
          </div>
        </div>
      </div>
    </>
  );
};
