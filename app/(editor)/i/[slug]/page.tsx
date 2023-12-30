import { featherRestApp } from "@/components/client/restClient";
import { FeathersFindResult, InvitationSchema } from "@/components/interfaces";
import { FrameProps } from "@/components/Editor/Viewport/Frames";

import lz from "lzutf8";
import { generateId } from "@/components/utils/generateId";
import Body from "./Body";
import { CONSTANTS } from "@/components/Constants";

type Props = {
  params: {
    slug: string;
  };
  searchParams: {};
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  const res: FeathersFindResult<InvitationSchema> = await featherRestApp
    .service("invitations")
    .find({
      query: {
        $select: ["slug"],
      },
    });

  return res.data.map((invitation) => {
    return { slug: invitation.slug };
  });
}

export async function generateMetadata({ params }: Props) {
  const res: FeathersFindResult<InvitationSchema> = await featherRestApp
    .service("invitations")
    .find({
      query: {
        $select: ["name", "slug"],
        slug: params.slug,
      },
    });

  let data: InvitationSchema = res.data[0];

  if (!data) return "Page not Found";

  return {
    title: `Invitation Editor - ${data.name}`,
    twitter: {
      card: "summary",
    },
    openGraph: {
      title: `${data.name} - ${CONSTANTS.APP_NAME}`,
      description: `You are invited`,
      site_name: CONSTANTS.APP_NAME,
      url: `https://${CONSTANTS.APP_DOMAIN}/i/${params.slug}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const res: FeathersFindResult<InvitationSchema> = await featherRestApp
    .service("invitations")
    .find({
      query: {
        slug: params.slug,
      },
    });

  const data: InvitationSchema = res.data[0];

  if (!data) return "Not Found";

  let content: FrameProps = {
    id: generateId(),
    name: "App",
    content: "",
    templates: [],
    properties: [],
  };
  try {
    content = JSON.parse(lz.decompress(lz.decodeBase64(data.content)));
  } catch (err) {}

  return (
    <Body
      type="invitation"
      id={data.id as any}
      slug={params.slug}
      content={content}
    />
  );
}
