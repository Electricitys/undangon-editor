import { UserComponent, useEditor, useNode } from "@craftjs/core";
import { ReactNode, useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { TextSettings } from "./TextSettings";
import { useFontFace } from "./FontFaceProvider";


type TextProps = {
  children: ReactNode;
  lineHeight: number;
  text: string;
  textAlign: string;
  fontWeight: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  margin: any;
  textShadow: string;
};

export const Text: UserComponent<TextProps> = ({
  lineHeight,
  text,
  textAlign,
  fontWeight,
  fontSize,
  fontFamily,
  color,
  margin,
  textShadow,
  children,
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

  const style = {
    lineHeight: `${lineHeight}px`,
    textAlign: textAlign,
    fontWeight: fontWeight,
    fontSize: fontSize,
    fontFamily: fontFamily,
    textShadow: textShadow,
    color: color,
    margin: margin.join(" "),
  };

  useEffect(() => {
    const load = async () => {
      if (!fontFamily) return;
      try {
        fontFace.load(fontFamily);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [fontFamily]);

  if (children) {
    return (
      <div ref={(ref)=>connect(ref as any)} style={style as any}>
        {children}
      </div>
    );
  }

  if (!editorEnabled) {
    return (
      <div ref={(ref)=>connect(ref as any)} style={style as any}>
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    );
  }

  return (
    <div
      ref={(ref)=>connect(ref as any)}
      style={style as any}
      onDoubleClick={() => {
        setIsEditable(true);
      }}
      onBlur={() => {
        setIsEditable(false);
      }}
    >
      {children}
      {!isEditable ? (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ) : (
        <ContentEditable
          disabled={false}
          html={text}
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
  props: {
    text: "Text Area",
    textAlign: "left",
    textShadow: undefined,
    fontSize: 12,
    fontWeight: "normal",
    fontFamily: "Roboto",
    color: "inherit",
    margin: [0, 0, 0, 0],
  },
  related: {
    settings: TextSettings,
  },
};
