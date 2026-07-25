import { NextResponse } from "next/server";
import { consumeDownload } from "@/features/delivery/repository";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string; fileId: string }> }) {
  const { token, fileId } = await params;
  const signedUrl = await consumeDownload(token, fileId);
  if (!signedUrl) return NextResponse.json({ error: "Download unavailable." }, { status: 404 });
  return NextResponse.redirect(signedUrl, 303);
}
