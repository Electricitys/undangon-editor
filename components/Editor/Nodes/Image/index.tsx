import React from "react";
import { Spacing, SpacingProps } from "../../Settings/Spacing";
import { ClassList, ClassListProps } from "../../Settings/ClassList";
import { Typography, TypographyProps } from "../../Settings/Typogrphy";
import { BoxSizing, BoxSizingProps } from "../../Settings/BoxSizing";
import { UserComponent, useNode } from "@craftjs/core";
import { cx } from "class-variance-authority";
import { ImageSettings } from "./ImageSetting";
import { useViewport } from "../../Viewport/useViewport";
import Zoom from "react-medium-image-zoom";

export type Sources =
  | {
      type: "background_image";
      value: string;
      width: number;
      height: number;
    }
  | {
      type: "image";
      value: string;
    }
  | {
      type: "variable";
      value: string;
    };

interface ImageProps<T = any> {
  boxSizing: BoxSizingProps;
  spacing: SpacingProps;
  classList: ClassListProps;

  attributes: {
    zoomable: boolean;
  };

  image: Sources;
}

export const Image: UserComponent<Partial<ImageProps>> = ({
  boxSizing,
  spacing,
  classList,

  attributes,

  image = {
    type: "image",
    value: "https://placehold.co/150x150/EEE/31343C",
  },
}) => {
  const {
    connectors: { connect },
  } = useNode();
  const { isProduction } = useViewport();

  const style: React.CSSProperties = {
    ...boxSizing,
    ...spacing,
  };

  const className = cx(
    (classList as ClassListProps).map(({ className }) => className)
  );

  let imageDOM;

  switch (image.type) {
    case "background_image":
      imageDOM = (
        <div
          style={{
            ...style,
            background: image.value,
            width: image.width,
            height: image.height,
          }}
          className={className}
        />
      );
      break;
    case "variable":
      imageDOM = (
        <div
          style={{
            ...style,
            background: image.value,
          }}
          className={className}
        />
      );
      break;
    default:
      imageDOM = <img style={style} src={image.value} className={className} />;
  }

  if (attributes?.zoomable && isProduction) {
    return <Zoom>{imageDOM}</Zoom>;
  }

  return <div ref={(ref) => connect(ref as any)}>{imageDOM}</div>;
};

Image.craft = {
  name: "Image",
  custom: {
    name: "Image",
    type: "component",
  },
  props: {
    boxSizing: BoxSizing.defaultValue,
    spacing: Spacing.defaultValue,
    classList: ClassList.defaultValue,

    image: {
      type: "image",
      value: "https://placehold.co/150x150/EEE/31343c",
    },
  },
  related: {
    settings: ImageSettings,
  },
};
