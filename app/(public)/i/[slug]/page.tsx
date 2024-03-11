import { featherRestApp } from "@/components/client/restClient";
import { FeathersFindResult, InvitationSchema, MetadataSchema } from "@/components/interfaces";
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
        $select: ["name", "slug", "metadata"],
        slug: params.slug,
      },
    });

  let data: InvitationSchema = res.data[0];

  if (!data) return "Page not Found";

  const metadata: MetadataSchema = data.metadata || {};

  return {
    title: `${data.name} - Manjo`,
    metadataBase: new URL(`https://${CONSTANTS.APP_DOMAIN}/i/${params.slug}`),
    twitter: {
      card: "summary",
    },
    openGraph: {
      title: metadata.title || `${data.name} - ${CONSTANTS.APP_NAME}`,
      description: metadata.description || "You are invited.",
      site_name: CONSTANTS.APP_NAME,
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
