import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getSupabaseClient } from "lib/supabase/supabase";

export function getSupabaseClientComponentClient() {
  const client = createClientComponentClient();

  return getSupabaseClient(client);
}

export function getCurrentUser() {
  const supabase = getSupabaseClientComponentClient();

  return supabase.getCurrentUser();
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
