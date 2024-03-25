"use client";

import { UserComponent, useNode } from "@craftjs/core";
import React from "react";
import { Generic, GenericProps } from "../../Settings/Generic";
import { ScriptSettings } from "./ScriptSetting";
import { CodeIcon } from "lucide-react";
import { useViewport } from "../../Viewport/useViewport";
import { useDebounceCallback } from "usehooks-ts";
import _debounce from "lodash/debounce";

type ScriptProps = {
  content: string;

  generic: GenericProps;
};

export const Script: UserComponent<Partial<ScriptProps>> = ({
  content,
  generic,
}) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));

  const { isProduction, pseudoElement } = useViewport();
  const cleanupFunc = React.useRef<any>();
  const debounceFunc = React.useRef<ReturnType<typeof _debounce>>(
    _debounce((content) => {
      if (!content) return;
      let sanitize: any;
      try {
        sanitize = eval(`(function() {${content}})()`);
      } catch (err: any) {
        console.error(err);
      }
      cleanupFunc.current = () => {
        try {
          sanitize();
        } catch (err: any) {
          console.error(err);
        }
        cleanupFunc.current = null;
      };
    }, 500)
  );

  React.useEffect(() => {
    debounceFunc.current(content);
    return () => {
      if (debounceFunc.current) {
        debounceFunc.current.cancel();
      }
      if (cleanupFunc.current) {
        cleanupFunc.current();
      }
    };
  }, [content]);

  if (!pseudoElement.hide || isProduction) return null;

  return (
    <div
      ref={(ref) => connect(ref as any)}
      className="bg-gray-300 justify-center flex p-2"
    >
      <CodeIcon className="text-gray-500" />
    </div>
  );
};

Script.craft = {
  name: "script",
  custom: {
    alias: undefined,
    name: "Script",
    type: "component",
  },
  props: { content: undefined, generic: Generic.defaultValue },
  related: {
    settings: ScriptSettings,
  },
};
