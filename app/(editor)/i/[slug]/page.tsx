import { featherRestApp } from "@/components/client/restClient";
import { InvitationSchema } from "@/components/interfaces";
import { FrameProps } from "@/components/Editor/Viewport/Frames";

import lz from "lzutf8";
import { generateId } from "@/components/utils/generateId";
import Body from "./Body";

type Props = {
  params: {
    slug: string;
  };
  searchParams: {};
};

export async function generateMetadata({ params }: Props) {
  const data: InvitationSchema[] = (
    await featherRestApp.service("invitations").find({
      query: {
        slug: params.slug,
      },
    })
  ).data;

  if (!data[0]) return "Page not Found";

  return {
    title: `Invitation Editor - ${data[0].name}`,
  };
}

export default async function Page({ params }: Props) {
  const data: InvitationSchema[] = (
    await featherRestApp.service("invitations").find({
      query: {
        slug: params.slug,
      },
    })
  ).data;

  if (!data[0]) return "Not Found";

  let content: FrameProps = {
    id: generateId(),
    name: "App",
    content: "",
    templates: [],
    properties: [],
  };
  try {
    content = JSON.parse(lz.decompress(lz.decodeBase64(data[0].content)));
  } catch (err) {}

  return (
    <Body
      type="invitation"
      id={data[0].id as any}
      slug={params.slug}
      content={content}
    />
  );
}
