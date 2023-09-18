import {
  ExpressionInput,
  ExpressionInputProps,
} from "@/components/ui/expression-input";
import React from "react";

export type StringFieldProps = ExpressionInputProps;

export const StringField: React.FC<StringFieldProps> = (props) => {
  return <ExpressionInput {...props} />;
};
