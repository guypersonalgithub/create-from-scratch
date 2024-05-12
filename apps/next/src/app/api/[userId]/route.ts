import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    hello: "world",
  });
};

export const POST = async (request: NextRequest, context: any) => {
  const { params } = context;
  console.log(params);
  return NextResponse.json({
    hello: "world",
  });
};
