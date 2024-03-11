import ShareForm from "./Form";
import {
  FeathersFindResult,
  InvitationSchema,
  MetadataSchema,
} from "@/components/interfaces";
import { featherRestApp } from "@/components/client/restClient";
import { CONSTANTS } from "@/components/Constants";
import { metadata } from "@/app/(editor)/e/layout";

type Props = {
  params: {
    id: string;
    slug: string;
  };
  searchParams: {};
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  const res: FeathersFindResult<InvitationSchema> = await featherRestApp
    .service("invitations")
    .find({
      query: {
        $select: ["id", "slug"],
      },
    });

  return res.data.map((invitation) => {
    return {
      id: String(invitation.id),
      slug: invitation.slug,
    };
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
    title: `Share Invitation - ${data.name} - ${CONSTANTS.APP_NAME}`,
    metadataBase: new URL(`https://${CONSTANTS.APP_DOMAIN}/i/${params.slug}`),
    twitter: {
      card: "summary",
    },
    openGraph: {
      title: `${data.name} - ${CONSTANTS.APP_NAME}`,
      description: "Share your invitation from here",
      site_name: CONSTANTS.APP_NAME,
      images: metadata.image,
    },
  };
}

export default async function Page({ params }: Props) {
  const res = await featherRestApp.service("invitations").get(params.id, {
    query: {
      $select: ["id", "slug", "metadata", "share_message"],
    },
  });

  const data: InvitationSchema = res;

  if (!data) return "Not Found";

  return <ShareForm {...data} />;
}
