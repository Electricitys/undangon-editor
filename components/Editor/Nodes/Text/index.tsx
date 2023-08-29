"use client";

import { UserComponent, useEditor, useNode } from "@craftjs/core";
import { ReactNode, useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { useFontFace } from "./FontFaceProvider";
import { TextSettings } from "./TextSettings";
import { BoxSizingProps } from "../../Settings/BoxSizing";
import { Spacing, SpacingProps } from "../../Settings/Spacing";
import { ClassList, ClassListProps } from "../../Settings/ClassList";
import { Typography, TypographyProps } from "../../Settings/Typogrphy";
import { CSSProperties } from "react";
import { cx } from "class-variance-authority";
import { isEmpty } from "lodash";

type TextProps = {
  children?: ReactNode;

  spacing: SpacingProps;
  classList: ClassListProps;
  typography: TypographyProps;

  text: string;
};

export const Text: UserComponent<Partial<TextProps>> = ({
  children,

  spacing,
  classList,
  typography,

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
  const [isEditable, setIsEditable] = useState(false);

  const fontFace = useFontFace();

  const style: CSSProperties = {
    ...spacing,
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
        style={style as any}
        className={className}
      >
        {children}
      </div>
    );
  }

  if (!editorEnabled) {
    return (
      <div ref={(ref) => connect(ref as any)} style={style as any}>
        <div dangerouslySetInnerHTML={{ __html: text as string }} />
      </div>
    );
  }

  return (
    <div
      ref={(ref) => connect(ref as any)}
      style={style as any}
      className={className}
      onDoubleClick={() => {
        setIsEditable(true);
      }}
      onBlur={() => {
        setIsEditable(false);
      }}
    >
      {children}
      {!isEditable ? (
        <div dangerouslySetInnerHTML={{ __html: text as string }} />
      ) : (
        <ContentEditable
          disabled={false}
          html={text as string}
          onChange={(e: any) => {
            setProp((prop: any) => (prop.text = e.target.value), 500);
          }}
        />
      )}
    </div>
  );
};

Text.craft = {
  name: "Text",
  custom: {
    type: "component",
  },
  props: {
    text: "Text Area",
    spacing: Spacing.defaultValue,
    typography: Typography.defaultValue,
    classList: ClassList.defaultValue,
  },
  related: {
    settings: TextSettings,
  },
};
