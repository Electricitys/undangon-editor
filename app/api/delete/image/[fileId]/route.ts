import { imagekit } from "@/components/utils/imagekit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  const res = await imagekit.deleteFile(params.fileId);
  return NextResponse.json(res);
}
