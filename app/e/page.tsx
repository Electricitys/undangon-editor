"use client";

import lz from "lzutf8";
import { Viewport, ViewportFrame } from "@/components/Editor/Viewport";
import { ViewportProviderProps } from "@/components/Editor/Viewport/useViewport";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useClient } from "@/components/client";

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
      <ViewportFrame
        data={`{"ROOT":{"type":"div","isCanvas":false,"props":{"children":"COBA Sample"},"displayName":"div","custom":{},"hidden":false,"nodes":["NHaS7f17vf","YGRb97VJYC"],"linkedNodes":{}},"NHaS7f17vf":{"type":{"resolvedName":"NativeTag"},"isCanvas":true,"props":{"boxSizing":{"width":"auto","height":"auto","h_sizing":"hug","v_sizing":"hug"},"spacing":{},"typography":{"textAlign":"left","lineHeight":1,"letterSpacing":"0px","fontSize":"12px","fontWeight":"normal","fontFamily":"Roboto","color":"inherit"},"classList":[]},"displayName":"NativeTag","custom":{"name":"div","type":"tag"},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}},"YGRb97VJYC":{"type":{"resolvedName":"Text"},"isCanvas":true,"props":{"text":"asdkjn","spacing":{},"typography":{"textAlign":"left","lineHeight":1,"letterSpacing":"0px","fontSize":"12px","fontWeight":"normal","fontFamily":"Roboto","color":"inherit"},"classList":[]},"displayName":"Text","custom":{"type":"component"},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}}}`}
      >
        {/* <Element
          is={NativeTag}
          canvas
          custom={{
            name: "div",
          }}
        >
          <Element is={Text} text="contoh" />
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
        </Element> */}
        <div>COBA</div>
      </ViewportFrame>
    </Viewport>
  );
}

const templateDummy = {
  rootNodeId: "bgwe9jqn_we9jqnyn",
  nodes: {
    c1sdoi6n_sdoi6n0q: {
      type: {
        resolvedName: "Text",
      },
      isCanvas: true,
      props: {
        text: "OKEY!!!",
        spacing: {},
        typography: {
          textAlign: "left",
          lineHeight: 1,
          letterSpacing: "0px",
          fontSize: "35px",
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
      parent: "euo9evvo_o9evvoch",
      hidden: false,
      nodes: [],
      linkedNodes: {},
    },
    euo9evvo_o9evvoch: {
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
        "": "",
      },
      displayName: "Container",
      custom: {
        type: "component",
      },
      parent: "ROOT",
      hidden: false,
      nodes: ["c1sdoi6n_sdoi6n0q"],
      linkedNodes: {},
    },
    ROOT: {
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
          lineHeight: 1,
          letterSpacing: "0px",
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
      hidden: false,
      nodes: ["euo9evvo_o9evvoch"],
      linkedNodes: {},
    },
  },
};
