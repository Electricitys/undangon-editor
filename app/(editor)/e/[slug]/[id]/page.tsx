import { useRouter } from "next/router";
import Body from "./Body";
import { featherRestApp } from "@/components/client/restClient";

type Props = {
  params: {
    id: string;
    slug: string;
  };
  searchParams: {};
};

export default async function Page({ params }: Props) {
  try {
    const data = await featherRestApp.service("templates").find();
    // console.log(data);
  } catch (err) {
    console.log(err);
  }

  return <Body id={params.id} slug={params.slug} content={""} />;
}
