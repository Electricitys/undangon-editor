import { imagekit } from "@/components/utils/imagekit";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(
  req: NextApiRequest,
  { params }: { params: { folder: string[] } }
) {
  const { searchParams } = new URL(req.url || "");
  const folder = params.folder.join("/");
  const files = await imagekit.listFiles({
    skip: (searchParams.get("skip") as any) || undefined,
    limit: (searchParams.get("limit") as any) || undefined,
    path: folder,
  });
  return Response.json(files);
}
