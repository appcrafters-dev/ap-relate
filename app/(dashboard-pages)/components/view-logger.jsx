"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";

export function ViewLogger({ user }) {
  const pathname = usePathname();
  const supabase = getSupabaseClientComponentClient();

  const logView = async () => {
    if (process.env.NODE_ENV === "development" || !user?.profile || !pathname)
      return;
    await supabase.client.from("view_logs").insert({
      user_profile_id: user.profile.user_profile_id,
      route: pathname,
    });
  };

  useEffect(() => {
    setTimeout(async () => await logView(), 5000);
  }, [pathname, user.id, logView]);

  return null;
}
