import { Slot } from "@radix-ui/react-slot";
import React from "react";

interface TemplateRenderer {
  templateId: string;
  asChild?: boolean;
}

export const TemplateRenderer: React.FC<
  React.PropsWithChildren<TemplateRenderer>
> = ({ asChild, templateId, ...props }) => {
  const Comp = asChild ? Slot : "div";

  console.log(templateId);

  return <Comp {...props} />;
};
