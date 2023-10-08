import { imagekit } from "@/components/utils/imagekit";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(
  req: NextApiRequest,
  { params }: { params: { fileId: string } }
) {
  const res = await imagekit.deleteFile(params.fileId);
  return Response.json(res);
}
