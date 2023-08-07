import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import React from "react";

interface PanelSectionProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  text: React.ReactNode;
  defaultOpen?: boolean;
}

export const PanelSection: React.FC<PanelSectionProps> = ({
  icon,
  text,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant={"ghost"}>
          <span>{icon}</span>
          <span>{text}</span>
          <span>
            <ChevronDownIcon />
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
};
