import { imagekit } from "@/components/utils/imagekit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { source: string; destination: string } }
) {
  const { searchParams } = new URL(req.url || "");
  const sourceFilePath: any = searchParams.get("from");
  const destinationPath: any = searchParams.get("to");
  if (!sourceFilePath && !destinationPath) return NextResponse.error();
  const res = await imagekit.moveFile({
    sourceFilePath,
    destinationPath,
  });
  return NextResponse.json(res);
}
