import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const cookie = request.cookies.get("my-cookie");
  const headers = request.headers;
  return NextResponse.next();
};
