import React from "react";
import { Spacing, SpacingProps } from "../../Settings/Spacing";
import { ClassList, ClassListProps } from "../../Settings/ClassList";
import { Typography, TypographyProps } from "../../Settings/Typography";
import { BoxSizing, BoxSizingProps } from "../../Settings/BoxSizing";
import { UserComponent, useNode } from "@craftjs/core";
import { cx } from "class-variance-authority";
import { ImageSettings } from "./ImageSetting";
import { useViewport } from "../../Viewport/useViewport";
import Zoom from "react-medium-image-zoom";
import { Slot } from "@radix-ui/react-slot";
import { GenericProps } from "../../Settings/Generic";
import { SpacingHandler } from "../../Settings/Spacing/handler";
import { BoxSizingHandler } from "../../Settings/BoxSizing/handler";

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

export type AttributesProps = {
  zoomable?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "scale-down";
};

export interface ImageProps<T = any> {
  boxSizing: BoxSizingProps;
  spacing: SpacingProps;
  classList: ClassListProps;

  generic: GenericProps;

  attributes: AttributesProps;

  image: Sources;
}

export const Image: UserComponent<Partial<ImageProps>> = ({
  boxSizing,
  spacing,
  classList,

  generic,

  attributes,

  image = {
    type: "image",
    value: "https://placehold.co/150x150/EEE/31343C",
  },
}) => {
  const {
    connectors: { connect },
  } = useNode();
  const { isProduction, media } = useViewport();

  const style: React.CSSProperties = {
    ...SpacingHandler(spacing as SpacingProps, { media, isProduction }),
    ...BoxSizingHandler(boxSizing as BoxSizingProps, { media, isProduction }),
    ...attributes,
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
    default:
      imageDOM = (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          style={style}
          src={image.value}
          className={className}
          alt="Gallery"
        />
      );
  }

  if (attributes?.zoomable && isProduction) {
    return <Zoom>{imageDOM}</Zoom>;
  }

  return (
    <Slot ref={(ref) => connect(ref as any)} {...(generic as any)}>
      {imageDOM}
    </Slot>
  );
};

export const defaultAttributes: AttributesProps = {
  objectFit: undefined,
};

Image.craft = {
  name: "Image",
  custom: {
    alias: undefined,
    name: "Image",
    type: "component",
    functionProps: [
      {
        name: "image",
        path: "image.value",
      },
    ],
  },
  props: {
    boxSizing: BoxSizing.defaultValue,
    spacing: Spacing.defaultValue,
    classList: ClassList.defaultValue,

    image: {
      type: "image",
      value: "https://placehold.co/150x150/EEE/31343c",
    },
    attributes: {
      objectFit: undefined,
    },
  },
  related: {
    settings: ImageSettings,
  },
};
