import { Novu } from "@novu/node";
import { getSupabaseRouteHandlerClient } from "lib/supabase/supabase.edge";
import { NextResponse } from "next/server";

export async function POST(req) {
  const novu = new Novu(process.env.NOVU_API_KEY);
  const body = await req.json();
  const supabase = getSupabaseRouteHandlerClient();
  const { data: family, error } = await supabase.client
    .from("families")
    .select(
      `id, 
    partner:partner_id(id, company_legal_name, company_logo_url), 
    members:user_profiles_view(*)`
    )
    .eq("id", body.new_family_id)
    .maybeSingle();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  await Promise.all(
    family.members.map(async (member) => {
      await novu
        .trigger("first-email-invite", {
          to: {
            subscriberId: member.user_profile_id,
            email: member.email,
            firstName: member.first_name,
            lastName: member.last_name,
          },
          payload: {
            inviteLink: "https://www.totalfamily.io/join",
            partner: family.partner ? family.partner : null,
          },
        })
        .catch((e) => {
          console.debug(e);
          return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
          );
        });
    })
  );

  return NextResponse.json(
    { message: "Email sent successfully" },
    { status: 200 }
  );
}
