import Body from "./Body";
import { featherRestApp } from "@/components/client/restClient";
import { TemplateSchema } from "@/components/interfaces";
import { FrameProps } from "@/components/Editor/Viewport/Frames";

import lz from "lzutf8";
import { generateId } from "@/components/utils/generateId";

type Props = {
  params: {
    id: string;
    slug: string;
  };
  searchParams: {};
};

export async function generateMetadata({ params }: Props) {
  const data: TemplateSchema = await featherRestApp
    .service("templates")
    .get(params.id);

  return {
    title: `Template Editor - ${data.name}`,
  };
}

export default async function Page({ params }: Props) {
  const data: TemplateSchema = await featherRestApp
    .service("templates")
    .get(params.id);

  const content: FrameProps = data.content
    ? JSON.parse(lz.decompress(lz.decodeBase64(data.content)))
    : null;

  return (
    <Body
      type="template"
      id={params.id}
      slug={params.slug}
      content={
        content || {
          id: generateId(),
          name: "APP",
          content: null,
          templates: [],
          properties: [],
        }
      }
    />
  );
}
