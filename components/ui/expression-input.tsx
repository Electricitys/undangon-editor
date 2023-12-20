import React, { useRef, useState } from "react";
// import * as monaco from 'monaco-editor'
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import {
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useClickAway } from "react-use";
import { Portal } from "@radix-ui/react-portal";
import { useCodemirror } from "./useCodemirror";
import Editor, { loader } from "@monaco-editor/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import jexl from "jexl";
import { useViewportFrame } from "../Editor/Viewport/Frames/Frame";
import { PROPERTIES_TYPES, Properties } from "../Editor/Settings/Properties";
import { Separator } from "./separator";

export interface ExpressionInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "value"
  > {
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClose?: (value: string | undefined) => void;
  variables: { key: string; value: string; type: Properties["type"] }[];
}

export const ExpressionInput: React.FC<ExpressionInputProps> = ({
  className,
  defaultValue,
  onChange = () => {},
  onClose = () => {},
  variables,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const inputRef = useRef(null);

  useClickAway(inputRef, () => {
    setIsOpen(false);
    onClose(value);
  });

  React.useEffect(() => {
    onChange(value as string);
  }, [value]);

  // loader.config({ monaco });

  const [editorHeight, setEditorHeight] = useState(100);

  return (
    <RadixDropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={cn(
          "static rounded-md border border-input bg-background items-baseline",
          className
        )}
      >
        <label
          className="block px-3 py-2 text-sm leading-6 cursor-pointer relative"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <RadixDropdownMenu.Trigger asChild>
            <div className="absolute -inset-px bottom-auto" />
          </RadixDropdownMenu.Trigger>
          <span className={`${!value && "text-gray-400"} line-clamp-1`}>
            {(value || "").replace(/\n/g, " ") || props.placeholder}
          </span>
        </label>
        <RadixDropdownMenu.Portal>
          <RadixDropdownMenu.Content align="start">
            <div ref={inputRef as any} className={`bg-background border w-64`}>
              <div style={{ height: editorHeight }} className="my-2">
                <Editor
                  defaultLanguage="javascript"
                  // defaultValue={defaultValue}
                  value={value}
                  className="w-full"
                  onChange={(v) => {
                    setValue(v);
                  }}
                  onMount={(editor) => {
                    editor.onDidContentSizeChange(() => {
                      setEditorHeight(
                        Math.min(1000, editor.getContentHeight())
                      );
                      editor.layout();
                    });
                    editor.focus();
                  }}
                  beforeMount={(monaco) => {
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(
                      variables.reduce<string>((p, c) => {
                        return `${p}\nconst ${c.value}: ${
                          PROPERTIES_TYPES[c.type]
                        };`;
                      }, ""),
                      "global.d.ts"
                    );
                  }}
                  options={{
                    scrollBeyondLastLine: false,
                    glyphMargin: false,
                    folding: false,
                    minimap: { enabled: false },
                    wordWrap: "on",
                    // lineNumbers: "off",
                    // lineDecorationsWidth: 0,
                    lineNumbersMinChars: 2,
                  }}
                />
              </div>
              <div className="px-1 py-1 flex items-center">
                <TooltipProvider delayDuration={0}>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-5 w-5 ml-1 font-normal text-xs"
                        size={"icon"}
                        variant={"outline"}
                      >
                        {`{x}`}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="p-0" side="bottom">
                      {variables.length === 0 ? (
                        <div className="p-2">Empty</div>
                      ) : (
                        <>
                          <div className="p-2 font-semibold">
                            Available Variables
                          </div>
                          <Separator />
                          {variables.map(({ key: k, value: v }) => (
                            <div key={k} color="red" className="p-2">
                              {v}
                            </div>
                          ))}
                        </>
                      )}
                    </TooltipContent>
                  </Tooltip>
                  <div className="grow" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-5 w-5 ml-1 font-normal text-xs"
                        size={"icon"}
                        variant={"outline"}
                        onClick={() => {
                          setIsOpenDialog(true);
                        }}
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
          </RadixDropdownMenu.Content>
        </RadixDropdownMenu.Portal>
      </div>
    </RadixDropdownMenu.Root>
  );
};

export const useCompileExpressionInsideFrameAndTemplate = (value: string) => {
  let properties: Properties[] = [];
  const frame = useViewportFrame();
  const parentProperties: never[] = [];

  if (frame?.frame) {
    properties = [...frame.frame.properties];
  }
  if (parentProperties) {
    properties = [...parentProperties];
  }

  const context = properties.reduce((p, c) => {
    return { ...p, [`$${c.name}`]: c.value };
  }, {});
  let result = value || "null";
  const expr = jexl.createExpression(result);
  try {
    result = expr.evalSync(context);
  } catch (err: any) {
    result = JSON.stringify({
      message: err.message,
    });
  }
  return result;
};
