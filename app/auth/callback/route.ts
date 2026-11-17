import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (!code) {
    return NextResponse.json({
      error: "Missing auth code in query parameter",
      desc: "Google OAuth failed",
    });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  // If error: do NOT redirect back to login, return JSON with exact cause
  if (error) {
    return NextResponse.json({
      error: error.message,
      desc: "Google OAuth failed",
    });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({
      error: userError?.message || "User session could not be retrieved",
      desc: "Google OAuth failed",
    });
  }

  const workspaceType = user.user_metadata?.workspace_type;

  // If missing workspace_type, redirect to /onboarding
  if (!workspaceType) {
    return NextResponse.redirect(new URL("/onboarding", origin));
  }

  // If present, redirect to / (or the next param)
  const redirectUrl = new URL(next, origin);
  const response = NextResponse.redirect(redirectUrl);

  // Persist workspace cookie for Edge middleware recognition
  response.cookies.set("solocrm_workspace_type", workspaceType, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
