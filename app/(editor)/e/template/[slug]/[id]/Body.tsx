"use client";

import lz from "lzutf8";
import { Viewport, ViewportFrame } from "@/components/Editor/Viewport";
import { ViewportProviderProps } from "@/components/Editor/Viewport/useViewport";
import { useRouter } from "next/navigation";
import React from "react";
import { useClient } from "@/components/client";
import { useToast } from "@/components/ui/use-toast";
import { FrameProps } from "@/components/Editor/Viewport/Frames";
import { Element, Node } from "@craftjs/core";
import { Container, NativeTag, Text } from "@/components/Editor/Nodes";
import { feathers } from "@/components/client/feathers";
import { toPng as hToPNG } from "html-to-image";
import { useInternalEditorReturnType } from "@craftjs/core/lib/editor/useInternalEditor";
import { imagekit } from "@/components/utils/imagekit";
import { generateId } from "@/components/utils/generateId";

interface EditorPageProps {
  id: string;
  slug: string;
  content: FrameProps;

  type: "invitation" | "template";
}

const Body: React.FC<EditorPageProps> = ({ content, type, ...props }) => {
  const router = useRouter();
  const { toast } = useToast();

  const takeSnapshot = React.useCallback(
    async (query: useInternalEditorReturnType<any>["query"]) => {
      const ROOT = query.getNodes().ROOT as Node;
      const dom = ROOT.dom;
      let image = null;
      if (!dom) return image;
      try {
        image = await hToPNG(dom);
      } catch (err) {
        console.error(err);
      }
      return image;
    },
    []
  );

  const onPublish = React.useCallback<ViewportProviderProps["onPublish"]>(
    async (...args) => {
      const [frame, query, { setLoading, setSaved }] = args;
      setLoading(true);
      const current = toast({
        title: "Publishing",
        description: "Generating thumbnail",
      });
      const thumbnail = await takeSnapshot(query);
      const thumbnail_url = await imagekit.upload({
        file: thumbnail as string,
        fileName: `${props.id}.png`,
        folder: `thumbnails/${type}s`,
      });
      current.update({
        id: current.id,
        description: "Compressing and saving the project.",
      });
      const json = JSON.stringify(frame);
      const content = lz.encodeBase64(lz.compress(json));
      try {
        await feathers
          .service(`${type}s`)
          .patch(props.id, { content, thumbnail_url: thumbnail_url.url });
        toast({
          title: "Published",
          description: "Project is saved.",
        });
        setSaved(true);
      } catch (err) {
        toast({
          title: "Publish",
          description: "Error while saving the project.",
          variant: "destructive",
        });
        setSaved(false);
        console.error(err);
      }
      setLoading(false);
    },
    []
  );

  const onClose = React.useCallback(() => {
    router.replace(`/${type}/edit/${props.id}`);
  }, [props.id]);

  const constructPreviewUrl = React.useCallback(() => {
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
                  value: "contoh",
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
