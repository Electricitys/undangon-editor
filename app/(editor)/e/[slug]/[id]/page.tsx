import Body from "./Body";
import { featherRestApp } from "@/components/client/restClient";
import { TemplateSchema } from "@/components/interfaces";
import { FrameProps } from "@/components/Editor/Viewport/Frames";

import lz from "lzutf8";
import { generateId } from "@/components/utils/generateId";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

type Props = {
  params: {
    id: string;
    slug: string;
  };
  searchParams: {};
};

export default async function Page({ params }: Props) {
  const data: TemplateSchema = await featherRestApp
    .service("templates")
    .get(params.id);

  const content: FrameProps = JSON.parse(
    lz.decompress(lz.decodeBase64(data.content))
  );

  return (
    <Body
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
