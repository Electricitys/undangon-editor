import { featherRestApp } from "@/components/client/restClient";
import { FeathersFindResult, InvitationSchema } from "@/components/interfaces";
import { FrameProps } from "@/components/Editor/Viewport/Frames";

import lz from "lzutf8";
import { generateId } from "@/components/utils/generateId";
import { CONSTANTS } from "@/components/Constants";
import Body from "../../[slug]/Body";

type Props = {
  params: {
    slug: string;
  };
  searchParams: {};
};

export async function generateMetadata({ params }: Props) {
  const res: FeathersFindResult<InvitationSchema> = await featherRestApp
    .service("invitations")
    .find({
      query: {
        slug: params.slug,
        $select: ["name", "slug"],
      },
    });

  let data: InvitationSchema = res.data[0];

  if (!data) return "Page not Found";

  return {
    title: `Invitation Editor - ${data.name}`,
    metadataBase: new URL(`https://${CONSTANTS.APP_DOMAIN}/i/${params.slug}`),
    twitter: {
      card: "summary",
    },
    openGraph: {
      title: `${data.name} - ${CONSTANTS.APP_NAME}`,
      description: `You are invited`,
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
