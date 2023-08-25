import { Element, useEditor } from "@craftjs/core";
import { Text } from "../../Nodes";
import { PanelSection } from "../PanelSection";
import { Button } from "@/components/ui/button";

export const Toolbox = () => {
  const { connectors } = useEditor();
  return (
    <PanelSection
      text="Toolbox"
      description="Available component that can be added to your project"
    >
      {[
        {
          icon: "widget-button",
          label: "Text",
          ref: (ref: any) =>
            connectors.create(
              ref,
              <Element is={Text} {...(Text.craft as any).props} canvas />
            ),
        },
      ].map(({ ref, label, icon }) => (
        <li key={label}>
          <Button variant={"ghost"} ref={ref}>
            {icon}
            <span>{label}</span>
          </Button>
        </li>
      ))}
    </PanelSection>
  );
};
