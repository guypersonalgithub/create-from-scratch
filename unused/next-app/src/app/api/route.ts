import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    hello: "world",
  });
};

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  return NextResponse.json({ data });
};
