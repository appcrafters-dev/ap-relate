import { UserRoles } from "lib/models/enums";
import { getSupabaseRouteHandlerSecretClient } from "lib/supabase/supabase.edge";
import { isUserRoleRestricted } from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  if (await isUserRoleRestricted(UserRoles.Admins)) notFound();

  const supabase = getSupabaseRouteHandlerSecretClient();

  const { data, error } = await supabase.client
    .from("families")
    .select("id, status, family_name, family_mantra")
    .order("family_name", { ascending: true })
    .csv();

  if (error)
    return new NextResponse(JSON.stringify(error, null, 2), { status: 500 });

  return new NextResponse(data, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=tfm-family-purpose-statements-${new Date().toLocaleDateString()}.csv`,
    },
  });
}
