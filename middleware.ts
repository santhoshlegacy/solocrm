import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function applySecurityHeaders(res: NextResponse): NextResponse {
  // Pro-grade strict Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://lh3.googleusercontent.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com https://accounts.google.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://*.supabase.co https://accounts.google.com",
  ].join("; ");

  res.headers.set("Content-Security-Policy", cspHeader);
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return res;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Authenticate session securely with getUser()
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  const { pathname } = request.nextUrl;
  const isPortalPage = pathname.startsWith("/portal");
  const isAuthCallback = pathname.startsWith("/auth/callback");
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");
  const isOnboardingPage = pathname.startsWith("/onboarding");

  // 1. Public dynamic routes strictly bypassing standard auth interception
  if (isPortalPage || isAuthCallback) {
    return applySecurityHeaders(response);
  }

  // 2. Unauthenticated route protection
  if (!user && !isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    if (pathname !== "/" && !isOnboardingPage) {
      redirectUrl.searchParams.set("returnTo", pathname);
    }
    const redirectResponse = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value);
    });
    return applySecurityHeaders(redirectResponse);
  }

  // 3. Authenticated session routing & forced onboarding
  if (user) {
    // Check if user has selected a workspace architecture
    const workspaceType =
      user.user_metadata?.workspace_type ||
      request.cookies.get("solocrm_workspace_type")?.value;

    // A. User has no workspace type selected -> Force redirect to /onboarding
    if (!workspaceType) {
      if (!isOnboardingPage) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/onboarding";
        redirectUrl.search = "";
        const redirectResponse = NextResponse.redirect(redirectUrl);
        response.cookies.getAll().forEach((c) => {
          redirectResponse.cookies.set(c.name, c.value);
        });
        return applySecurityHeaders(redirectResponse);
      }
      return applySecurityHeaders(response);
    }

    // B. User has already onboarded but visits /login, /signup, or /onboarding -> Redirect to /
    if (isAuthPage || isOnboardingPage) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.search = "";
      const redirectResponse = NextResponse.redirect(redirectUrl);
      response.cookies.getAll().forEach((c) => {
        redirectResponse.cookies.set(c.name, c.value);
      });
      return applySecurityHeaders(redirectResponse);
    }
  }

  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static assets)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Static asset extensions (.svg, .png, .jpg, .jpeg, .gif, .webp, .css, .js)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
