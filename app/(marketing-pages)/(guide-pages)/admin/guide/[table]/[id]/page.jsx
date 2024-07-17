import { UserRoles } from "lib/models/enums";
import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";
import GuideArticleAdmin from "./admin-page";
import { ErrorBox } from "@/components/ui/errors";

export default async function GuideArticlePage({ params }) {
  if (await isUserRoleRestricted(UserRoles.Admin)) return notFound();

  const supabase = getSupabaseServerComponentClient();
  const { table, id } = params;
  const { data, error } = await supabase.getGuideAdminPage(table, id);

  if (error)
    return <ErrorBox msg={error.message || "Sorry, something went wrong"} />;

  if (!data) return "Not found";

  return (
    <GuideArticleAdmin
      {...{
        data,
        id,
        table,
      }}
    />
  );
}
