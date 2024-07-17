import {
  getCurrentUser,
  getSupabaseRouteHandlerSecretClient,
} from "lib/supabase/supabase.edge";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const supabase = getSupabaseRouteHandlerSecretClient();

  const user = await getCurrentUser();

  const { roleId } = await req.json();

  if (!roleId) {
    return NextResponse.json({ error: "roleId is required" }, { status: 400 });
  }
  console.log("roleId:", roleId); // log roleId

  const { data: userProfile, error: userProfileError } = await supabase.client
    .from("user_profiles_view")
    .select()
    .eq("id", roleId)
    .single();

  if (userProfileError || !userProfile) {
    return NextResponse.json(
      { error: userProfileError || "Sorry, there was a problem." },
      { status: 500 }
    );
  }

  console.log("userProfile ID:", userProfile.id); // log userProfile

  const { data: supaUser, error } =
    await supabase.client.auth.admin.updateUserById(user.id, {
      user_metadata: {
        default_user_profile: userProfile,
        role: userProfile.role,
      },
    });

  if (error || !supaUser) {
    return NextResponse.json(
      { error: error || "Sorry, there was a problem." },
      { status: 500 }
    );
  }

  console.log("supaUser ID:", supaUser.id);
  return NextResponse.json({ data: supaUser }, { status: 200 });
}
