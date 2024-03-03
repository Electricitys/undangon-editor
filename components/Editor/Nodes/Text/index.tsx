"use client";

import { UserComponent, useEditor, useNode } from "@craftjs/core";
import { ReactNode, useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { useFontFace } from "./FontFaceProvider";
import { TextSettings } from "./TextSettings";
import { Spacing, SpacingProps } from "../../Settings/Spacing";
import { ClassList, ClassListProps } from "../../Settings/ClassList";
import { Typography, TypographyProps } from "../../Settings/Typography";
import { CSSProperties } from "react";
import { cx } from "class-variance-authority";
import { isEmpty } from "lodash";
import { Generic, GenericProps } from "../../Settings/Generic";
import { SpacingHandler } from "../../Settings/Spacing/handler";
import { useViewport } from "../../Viewport/useViewport";

export type TextType =
  | {
      type: "text";
      value: string;
    }
  | {
      type: "variable";
      value: string;
    }
  | {
      type: "expression";
      value: string;
    };

type TextProps = {
  children?: ReactNode;

  spacing: SpacingProps;
  classList: ClassListProps;
  typography: TypographyProps;
  generic: GenericProps;

  text: TextType;
};

export const Text: UserComponent<Partial<TextProps>> = ({
  children,

  spacing,
  classList,
  typography,
  generic,

  text,
}) => {
  const {
    connectors: { connect },
    actions: { setProp },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));
  const { editorEnabled } = useEditor((state) => ({
    editorEnabled: state.options.enabled,
  }));
  // const [isEditable, setIsEditable] = useState(false);

  const fontFace = useFontFace();
  const { isProduction, media } = useViewport();

  const style: CSSProperties = {
    ...SpacingHandler(spacing as SpacingProps, { media, isProduction }),
    ...typography,
  };

  const className = cx(
    (classList as ClassListProps).map(({ className }) => className)
  );

  useEffect(() => {
    const load = async () => {
      if (!typography?.fontFamily) return;
      try {
        fontFace.load(typography.fontFamily);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [typography?.fontFamily]);

  if (!isEmpty(children)) {
    return (
      <div
        ref={(ref) => connect(ref as any)}
        {...(generic as any)}
        style={style as any}
        className={className}
      >
        {children}
      </div>
    );
  }

  // if (!editorEnabled) {
  //   return (
  //     <div
  //       ref={(ref) => connect(ref as any)}
  //       style={style as any}
  //       dangerouslySetInnerHTML={{ __html: (text || "Some text") as string }}
  //     />
  //   );
  // }

  const renderProps: any = {
    ref: (ref: any) => connect(ref as any),
    ...(generic as any),
    style: style as any,
    className: className,
  };

  if (children) {
    return (
      <div
        {...renderProps}
        // onDoubleClick={() => {
        //   setIsEditable(true);
        // }}
        // onBlur={() => {
        //   setIsEditable(false);
        // }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      {...renderProps}
      dangerouslySetInnerHTML={{
        __html: (text?.value || "Some text") as string,
      }}
    />
  );
};

Text.craft = {
  name: "Text",
  custom: {
    alias: undefined,
    name: "Text",
    type: "component",
    strictProps: ["spacing", "typography", "classList"],
    functionProps: [
      {
        name: "text",
        path: "text.value",
      },
    ],
  },
  props: {
    text: {
      type: "text",
      value: "Text Area",
    },
    spacing: Spacing.defaultValue,
    typography: Typography.defaultValue,
    classList: ClassList.defaultValue,
    generic: Generic.defaultValue,
  },
  related: {
    settings: TextSettings,
  },
};
