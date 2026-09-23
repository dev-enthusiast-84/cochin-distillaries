import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

const PROTECTED_PREFIXES = ["/dashboard", "/account"];
const AUTH_PAGES = ["/login", "/signup"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) =>
          response.headers.set(key, value),
        );
      },
    },
  });

  // Don't run code between createServerClient and getClaims(): this call
  // refreshes the session, and skipping it can randomly log users out.
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  // Optimistic redirects only. Pages still verify the user themselves.
  if (!isSignedIn && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return redirectPreservingCookies(request, response, "/login", pathname);
  }
  if (isSignedIn && AUTH_PAGES.includes(pathname)) {
    return redirectPreservingCookies(request, response, "/dashboard");
  }

  return response;
}

function redirectPreservingCookies(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
  next?: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = next ? `?next=${encodeURIComponent(next)}` : "";
  const redirect = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
