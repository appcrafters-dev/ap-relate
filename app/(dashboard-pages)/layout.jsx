import { getSupabaseServerComponentClient } from "lib/supabase/supbase.server";
import AuthLayout from "./auth-layout";

export const dynamic = "force-dynamic";

function getUserDetails() {
  const supabase = getSupabaseServerComponentClient();
  return supabase.getCurrentUser();
}

export default async function Layout({ children }) {
  const user = await getUserDetails();

  if (!user) return "Login required...";

  return <AuthLayout user={user}>{children}</AuthLayout>;
}
