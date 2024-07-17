import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { getSupabaseClient } from "lib/supabase/supabase";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET } = process.env;

export function getSupabaseRouteHandlerClient() {
  const client = createRouteHandlerClient({ cookies });
  return getSupabaseClient(client);
}

export function getSupabaseRouteHandlerSecretClient(persistSession = false) {
  const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET, {
    auth: { persistSession },
  });

  return getSupabaseClient(supabase);
}

export async function getCurrentUser() {
  const supabase = getSupabaseRouteHandlerClient();

  return supabase.getCurrentUser();
}
