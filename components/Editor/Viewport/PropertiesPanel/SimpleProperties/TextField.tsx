import { Input, TextInput, Textarea } from "@mantine/core";
import React from "react";

export type TextFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export const TextField: React.FC<TextFieldProps> = (props) => {
  return (
    <Textarea
      autosize={true}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};
