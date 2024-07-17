import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { getCurrentUser } from "lib/supabase/supabase.edge";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();

  if (req.nextUrl.pathname === "/") return res;

  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) return res;

  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = "/login";

  if (req.nextUrl.pathname !== "/") {
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
  }

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/((?!api|login|join|join/|reset|forgot|invite|about|contact-us|frequently-asked-questions|bookclub|client-waiver|onboarding|privacy-policy|img|_next/static|_next/image|favicon.ico|video/|v/|journal|journal/|guide|guide/).*)",
  ],
};
