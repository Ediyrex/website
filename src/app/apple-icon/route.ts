import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL("/images/logo/ediyrex-emblem-192.png", request.url);
  return NextResponse.redirect(url, { status: 308 });
}
