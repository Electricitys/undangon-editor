import { useRouter } from "next/router";
import Body from "./Body";

type Props = {
  params: {
    id: string;
    slug: string;
  };
  searchParams: {};
};

export default async function Page({params}: Props) {
  return <Body id={params.id} slug={params.slug} content={""} />;
}
