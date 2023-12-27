"use client";

import lz from "lzutf8";
import { Viewport, ViewportFrame } from "@/components/Editor/Viewport";
import { ViewportProviderProps } from "@/components/Editor/Viewport/useViewport";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { useClient } from "@/components/client";
import { useToast } from "@/components/ui/use-toast";
import { FrameProps } from "@/components/Editor/Viewport/Frames";
import { Element } from "@craftjs/core";
import { Container, NativeTag, Text } from "@/components/Editor/Nodes";
import { feathers } from "@/components/client/feathers";

interface EditorPageProps {
  id: string;
  slug: string;
  content: FrameProps;

  type: "invitation" | "template";
}

const Body: React.FC<EditorPageProps> = ({ content, type, ...props }) => {
  const router = useRouter();
  const { toast } = useToast();

  const onPublish = useCallback<ViewportProviderProps["onPublish"]>(
    async (frame, query, { setLoading, setSaved }) => {
      setLoading(true);
      const json = JSON.stringify(frame);
      const content = lz.encodeBase64(lz.compress(json));
      try {
        await feathers.service(`${type}s`).patch(props.id, { content });
        toast({
          title: "Publish",
          description: "Project is saved.",
        });
        setSaved(true);
      } catch (err) {
        toast({
          title: "Publish",
          description: "Error while saving the project.",
        });
        setSaved(false);
        console.error(err);
      }
      setLoading(false);
    },
    []
  );

  const onClose = useCallback(() => {
    router.replace(`/${type}/edit/${props.id}`);
  }, [props.id]);

  const constructPreviewUrl = useCallback(() => {
    return `/i/p/${props.slug}`;
  }, [props.slug]);

  return (
    <Viewport
      onClose={onClose}
      onPublish={onPublish}
      constructPreviewUrl={constructPreviewUrl}
      defaultMode={type === "template" ? "advanced" : "simple"}
    >
      <ViewportFrame
        // data={`{"ROOT":{"type":"div","isCanvas":false,"props":{"children":"COBA Sample"},"displayName":"div","custom":{},"hidden":false,"nodes":["NHaS7f17vf","YGRb97VJYC"],"linkedNodes":{}},"NHaS7f17vf":{"type":{"resolvedName":"NativeTag"},"isCanvas":true,"props":{"boxSizing":{"width":"auto","height":"auto","h_sizing":"hug","v_sizing":"hug"},"spacing":{},"typography":{"textAlign":"left","lineHeight":1,"letterSpacing":"0px","fontSize":"12px","fontWeight":"normal","fontFamily":"Roboto","color":"inherit"},"classList":[]},"displayName":"NativeTag","custom":{"name":"div","type":"tag"},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}},"YGRb97VJYC":{"type":{"resolvedName":"Text"},"isCanvas":true,"props":{"text":"asdkjn","spacing":{},"typography":{"textAlign":"left","lineHeight":1,"letterSpacing":"0px","fontSize":"12px","fontWeight":"normal","fontFamily":"Roboto","color":"inherit"},"classList":[]},"displayName":"Text","custom":{"type":"component"},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}}}`}
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
          <Element is={Text} text={`"contoh"`} />
          <Element
            is={NativeTag}
            canvas
            custom={{
              name: "div",
            }}
          >
            <Element is={Container} canvas>
              <Element is={Text} text={`"CONTAINER"`} />
            </Element>
          </Element>
        </Element>
      </ViewportFrame>
    </Viewport>
  );
};

export default Body;
