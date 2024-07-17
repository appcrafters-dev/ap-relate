import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserRoles } from "lib/models/enums";
import { getSupabaseClient } from "lib/supabase/supabase";
import { cookies } from "next/headers";

export function getSupabaseServerComponentClient() {
  const client = createServerComponentClient({ cookies });

  return getSupabaseClient(client);
}

export function getCurrentUser() {
  const supabase = getSupabaseServerComponentClient();

  return supabase.getCurrentUser();
}

export async function getConversationAgents(ids = null) {
  const supabaseAdmin = getSupabaseServerComponentClient();

  const { data: agents, error } = await supabaseAdmin.client
    .from("user_profiles_view")
    .select(
      `
    user_profile_id,
    first_name,
    last_name,
    email,
    role,
    avatar_url
  `
    )
    .in("role", UserRoles.CoachesAndAdmins);

  if (error) return { error };

  return { agents };
}

export async function isUserRoleRestricted(roles = [] || "") {
  if (!Array.isArray(roles)) roles = [roles];

  const user = await getCurrentUser();

  const isRestricted = !user || !roles.includes(user?.profile?.role || null);

  return isRestricted;
}

export async function hasRole(roles = [] || "") {
  if (!Array.isArray(roles)) roles = [roles];

  console.log("Checking for roles: ", roles);

  const user = await getCurrentUser();
  if (!user) return false;

  const userRole = user?.profile?.role || null;
  console.log("User's role: ", userRole);

  const includesRole = roles.includes(userRole);

  console.log("User has role: ", includesRole);
  return includesRole;
}
