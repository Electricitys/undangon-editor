"use client";

import lz from "lzutf8";
import { Viewport } from "@/components/Editor/Viewport";
import { ViewportProviderProps } from "@/components/Editor/Viewport/useViewport";
import { Button } from "@/components/ui/button";
import { Element, Frame, useEditor } from "@craftjs/core";
import IFrame, { FrameContextConsumer } from "react-frame-component";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useClient } from "@/components/client";
import {
  Text,
  Template,
  Container,
  NativeTag,
} from "@/components/Editor/Nodes";

export interface EditorPageProps {
  id: string;
  slug: string;
  content: string;
}

export default function Page({ content, ...props }: EditorPageProps) {
  const client = useClient();
  const router = useRouter();

  const onPublish = useCallback<ViewportProviderProps["onPublish"]>(
    async (query, { setLoading }) => {
      setLoading(true);
      const json = query.serialize();
      const content = lz.encodeBase64(lz.compress(json));
      try {
        await client.service("invitations").patch(props.id, { content });
        toast({
          description: "Project is saved.",
        });
      } catch (err) {
        toast({
          description: "Error while saving the project.",
        });
        console.error(err);
      }
      setLoading(false);
    },
    [props]
  );

  const onClose = useCallback(() => {
    router.replace("/manager/invitations");
  }, []);

  const constructPreviewUrl = useCallback(() => {
    return `/i/p/${props.slug}`;
  }, [props.slug]);

  return (
    <Viewport
      id={`invitations/satu---test`}
      onClose={onClose}
      onPublish={onPublish}
      constructPreviewUrl={constructPreviewUrl}
    >
      <Frame data={content}>
        <Element
          is={NativeTag}
          canvas
          custom={{
            name: "div",
          }}
        >
          <Element is={Text} text="contoh" />
          <Element is={Template} nodeTree={templateDummy} />
          <Element
            is={NativeTag}
            canvas
            custom={{
              name: "div",
            }}
          >
            <Element is={Container} canvas>
              <Element is={Text} text="CONTAINER" />
            </Element>
          </Element>
        </Element>
      </Frame>
    </Viewport>
  );
}

const templateDummy = {
  rootNodeId: "bgwe9jqn_we9jqnyn",
  nodes: {
    tk3y72fd_3y72fdv3: {
      type: {
        resolvedName: "Text",
      },
      isCanvas: false,
      props: {
        text: "TAIMENG",
        spacing: {},
        typography: {
          textAlign: "left",
          lineHeight: "12px",
          letterSpacing: 1,
          fontSize: "12px",
          fontWeight: "normal",
          fontFamily: "Roboto",
          color: "inherit",
        },
        classList: [],
      },
      displayName: "Text",
      custom: {
        type: "component",
      },
      parent: "alnluute_nluuteq9",
      hidden: false,
      nodes: [],
      linkedNodes: {},
    },
    alnluute_nluuteq9: {
      type: {
        resolvedName: "Container",
      },
      isCanvas: true,
      props: {
        boxSizing: {
          width: "auto",
          height: "auto",
          h_sizing: "hug",
          v_sizing: "hug",
        },
        spacing: {},
        classList: [],
      },
      displayName: "Container",
      custom: {
        type: "component",
      },
      parent: "bgwe9jqn_we9jqnyn",
      hidden: false,
      nodes: ["tk3y72fd_3y72fdv3"],
      linkedNodes: {},
    },
    bgwe9jqn_we9jqnyn: {
      type: {
        resolvedName: "NativeTag",
      },
      isCanvas: true,
      props: {
        boxSizing: {
          width: "auto",
          height: "auto",
          h_sizing: "hug",
          v_sizing: "hug",
        },
        spacing: {},
        typography: {
          textAlign: "left",
          lineHeight: "12px",
          letterSpacing: 1,
          fontSize: "12px",
          fontWeight: "normal",
          fontFamily: "Roboto",
          color: "inherit",
        },
        classList: [],
      },
      displayName: "NativeTag",
      custom: {
        name: "div",
        type: "tag",
      },
      parent: "ROOT",
      hidden: false,
      nodes: ["alnluute_nluuteq9"],
      linkedNodes: {},
    },
  },
};
