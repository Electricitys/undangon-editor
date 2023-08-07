"use client";

import lz from "lzutf8";
import { Viewport } from "@/components/Editor/Viewport";
import { ViewportProviderProps } from "@/components/Editor/Viewport/useViewport";
import { Button } from "@/components/ui/button";
import { Frame, useEditor } from "@craftjs/core";
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
      <Frame></Frame>
    </Viewport>
  );
}
