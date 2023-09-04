import React, { useRef, useState } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import { EnterFullScreenIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { useClickAway } from "react-use";
import { Slot } from "@radix-ui/react-slot";
import { useCodemirror } from "./useCodemirror";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";

export interface ExpressionInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "value"
  > {
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClose?: (value: string | undefined) => void;
}

export const ExpressionInput: React.FC<ExpressionInputProps> = ({
  className,
  defaultValue,
  onChange = () => {},
  onClose = () => {},
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const { ref: CodeMirrorRef } = useCodemirror({
    initialValue: value,
    onChange: (v) => {
      setValue(v);
    },
  });

  const inputRef = useRef(null);

  useClickAway(inputRef, () => {
    setIsOpen(false);
    onClose(value);
  });

  React.useEffect(() => {
    if (isOpen === false) {
    }
  }, [isOpen]);

  return (
    <div
      className={cn(
        "static rounded-md border border-input bg-background items-baseline",
        className
      )}
    >
      <label
        htmlFor={props.id}
        className="block px-3 py-2 text-sm leading-6 cursor-pointer"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <span className="line-clamp-1">
          {(value || "").replace(/\n/g, " ") || props.placeholder}
        </span>
      </label>
      {isOpen && (
        <div
          ref={inputRef}
          className="absolute top-0 -left-px -right-px bg-background border"
        >
          <div id={props.id} ref={CodeMirrorRef} className="w-full" />
          <div className="px-1 py-1 flex items-center">
            <TooltipProvider>
              <Badge variant={"outline"}>
                <span className="font-normal">Expressions</span>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="h-auto w-auto ml-1"
                      size={"icon"}
                      variant={"ghost"}
                    >
                      <InfoCircledIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent side="bottom">
                      <p>This is the Expression</p>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </Badge>
              <Button
                className="h-5 w-5 ml-1 font-normal text-xs"
                size={"icon"}
                variant={"outline"}
              >
                {`{x}`}
              </Button>
              <div className="grow" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-5 w-5 ml-1 font-normal text-xs"
                    size={"icon"}
                    variant={"outline"}
                  >
                    <EnterFullScreenIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent side="bottom">
                    <p>Enter fullscreen</p>
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
};
