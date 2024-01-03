"use client";

import { Viewport, ViewportFrame } from "@/components/Editor/Viewport";
import React from "react";
import { FrameProps } from "@/components/Editor/Viewport/Frames";
import { Element } from "@craftjs/core";
import { Container, NativeTag, Text } from "@/components/Editor/Nodes";

interface EditorPageProps {
  id: string;
  slug: string;
  content: FrameProps;

  type: "invitation" | "template";
}

const Body: React.FC<EditorPageProps> = ({ content, type, ...props }) => {
  return (
    <Viewport isProduction={true} onPublish={() => {}}>
      <ViewportFrame
        data={content.content}
        templates={content.templates}
        properties={content.properties}
      >
        <Element
          is={NativeTag}
          canvas
          custom={{
            name: "div",
          }}
        >
          <Element
            is={Text}
            text={{
              type: "text",
              value: "contoh",
            }}
          />
          <Element
            is={NativeTag}
            canvas
            custom={{
              name: "div",
            }}
          >
            <Element is={Container} canvas>
              <Element
                is={Text}
                text={{
                  type: "text",
                  value: "CONTAINER",
                }}
              />
            </Element>
          </Element>
        </Element>
      </ViewportFrame>
    </Viewport>
  );
};

export default Body;
