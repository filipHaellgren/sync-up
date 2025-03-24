import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
  
  // ✅ Clears the steamid cookie
  response.headers.set("Set-Cookie", "steamid=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");

  return response;
}