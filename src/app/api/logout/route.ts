// src/app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

function redirectHome(req: NextRequest) {
  const url = new URL("/", req.url); // strona główna
  const res = NextResponse.redirect(url);
  res.cookies.set("session", "", { path: "/", maxAge: 0 }); // usuń cookie
  return res;
}

export function GET(req: NextRequest) {
  return redirectHome(req);
}

export function POST(req: NextRequest) {
  return redirectHome(req);
}
