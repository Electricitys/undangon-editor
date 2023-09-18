import { useRouter } from "next/router";
import Body from "./[id]/Body";

type Props = {
  params: {
    slug: string;
  };
  searchParams: {};
};

export default async function Page({params}: Props) {
  return <Body id={""} slug={params.slug} content={""} />;
}
