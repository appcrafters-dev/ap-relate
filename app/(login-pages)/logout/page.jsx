"use client";

import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const supabase = getSupabaseClientComponentClient();
  const router = useRouter();
  const signOut = async () => {
    await supabase.client.auth.signOut();
    await supabase.client.auth.refreshSession();
    router.replace("/login");
  };
  signOut();
  return <p className="animate-pulse">Logging out...</p>;
}
