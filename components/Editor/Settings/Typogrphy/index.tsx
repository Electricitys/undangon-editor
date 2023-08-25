import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CSSProperties } from "react";
import { useForm } from "react-hook-form";

export interface TypographyProps
  extends Pick<
    CSSProperties,
    | "textDecoration"
    | "fontFamily"
    | "fontSize"
    | "textAlign"
    | "textTransform"
    | "lineHeight"
    | "fontWeight"
    | "letterSpacing"
  > {
  height: number;
}

const defaultValue: Partial<TypographyProps> = {};

export const Typography = () => {
  const form = useForm();
  return (
    <div>
      <Form {...form}>
        <div className="flex">
          <div>W:</div>
          <Input placeholder="height" />
        </div>
      </Form>
    </div>
  );
};

Typography.defaultValue = defaultValue as TypographyProps;
