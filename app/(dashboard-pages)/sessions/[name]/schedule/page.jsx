import { getSupabaseServerComponentClient } from "lib/supabase/supbase.server";

import Session from "./schedule-page";
import { notFound } from "next/navigation";
import { isUuid } from "lib/utils";

export const metadata = {
  title: "Schedule your Session - Total Family Management",
};

export const dynamic = "force-dynamic";

async function getSession(id) {
  const supabase = getSupabaseServerComponentClient();

  const query = supabase.client.from("family_sessions").select(
    `
      id,
      short_id,
      _frappe_id,
      status,
      scheduled_time,
      family_id,
      google_event_id,
      calendar_quarter:planned_quarter_id(id, starts_on, ends_on),
      session:sessions(id, number, title, description, subtitle, total_family_framework, life_phases(title)), 
      coach:coaches(*, ...user_roles(*, ...user_profiles(first_name, last_name))),
      family:families(id, family_members:family_members(*,...user_roles(...user_profiles(email, first_name, last_name))))
      `
  );

  if (isUuid(id)) {
    query.eq("id", id);
  } else {
    query.or(`short_id.eq.${id}, _frappe_id.eq.${id}`);
  }

  return await query.maybeSingle();
}

export default async function SessionPage({ params }) {
  const { data: session, error } = await getSession(params.name);

  if (!session) return notFound();

  if (error) {
    console.error("ERROR - getSession:", error);
    return <p>Something went wrong, please try again later.</p>;
  }

  return (
    <Session
      coach={session.coach}
      heads_of_household={session.family.family_members.filter(
        (m) => !m.is_child
      )}
      session={session}
      error={error}
    />
  );
}
