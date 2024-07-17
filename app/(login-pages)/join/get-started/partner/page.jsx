import { getCurrentUser } from "lib/supabase/supbase.server";
import { redirect } from "next/navigation";
import PartnerGetStartedPage from "./get-started-page";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) return redirect("/join");
  if (user.partner) return redirect("/dashboard");
  // if (await hasRole(UserRoles.FamilyMembers))
  // return redirect("/join/get-started/family");
  return <PartnerGetStartedPage profile={user.profile || {}} user={user} />;
}
