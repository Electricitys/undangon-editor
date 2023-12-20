import {
  ExpressionInput,
  ExpressionInputProps,
} from "@/components/ui/expression-input";
import React from "react";

export type ExpressionFieldProps = ExpressionInputProps;

export const ExpressionField: React.FC<ExpressionFieldProps> = (props) => {
  return <ExpressionInput {...props} />;
};
