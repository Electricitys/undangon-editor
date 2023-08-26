import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import React from "react";

interface PanelSectionProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  text: React.ReactNode;
  defaultOpen?: boolean;
  description?: string;
  action?: React.ReactNode;
  lock?: boolean;
  separator?: boolean;
}

export const PanelSection: React.FC<PanelSectionProps> = ({
  icon,
  lock = false,
  separator = true,
  text,
  children,
  defaultOpen = true,
  description,
  action,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      disabled={lock}
      onOpenChange={(s) => {
        if (!lock) setIsOpen(s);
      }}
      className="space-y-2"
    >
      <CollapsibleTrigger asChild>
        <div
          className={`flex w-full text-start items-center pl-4 pr-2 py-2 ${
            lock ? "" : "cursor-pointer"
          }`}
        >
          <div className="grow flex items-center">
            {icon}
            <div className="text-sm mr-1">{text}</div>
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size={"icon"} variant="ghost" className="h-6 w-6">
                      <InfoCircledIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent side="right">
                      <p>{description}</p>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </TooltipProvider>
            )}
            {!lock && (
              <Button size={"icon"} variant={"ghost"} className="h-6 w-6">
                {isOpen ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          {action}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-2">{children}</div>
        {separator && <Separator />}
      </CollapsibleContent>
    </Collapsible>
  );
};
