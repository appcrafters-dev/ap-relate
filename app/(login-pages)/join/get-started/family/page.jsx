import {
  getCurrentUser,
  getSupabaseServerComponentClient,
  hasRole,
} from "lib/supabase/supbase.server";
import { redirect } from "next/navigation";
import FamilyGetStartedPage from "./get-started-page";
import { UserRoles } from "lib/models/enums";
import { ErrorBox } from "@/components/ui/errors";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) return redirect("/join");
  if (user.family) return redirect("/dashboard");
  if (await hasRole(UserRoles.Partners))
    return redirect("/join/get-started/partner");
  const supabase = getSupabaseServerComponentClient();
  const { data: lifePhases, error } = await supabase.client
    .from("life_phases")
    .select("id, title, description");

  if (error) return <ErrorBox />;

  return (
    <FamilyGetStartedPage
      profile={user.profile || {}}
      user={user}
      lifePhases={lifePhases}
    />
  );
}
