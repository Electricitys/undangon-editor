import { imagekit } from "@/components/utils/imagekit";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(
  req: NextApiRequest,
  { params }: { params: { source: string; destination: string } }
) {
  const { searchParams } = new URL(req.url || "");
  const sourceFilePath: any = searchParams.get("from");
  const destinationPath: any = searchParams.get("to");
  if (!sourceFilePath && !destinationPath) return Response.error();
  const res = await imagekit.moveFile({
    sourceFilePath,
    destinationPath,
  });
  return Response.json(res);
}
