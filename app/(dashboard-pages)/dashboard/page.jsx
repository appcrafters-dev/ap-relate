import { redirect } from "next/navigation";
import Dashboard from "./dashboard-page";
import {
  getCurrentUser,
  getSupabaseServerComponentClient,
  hasRole,
} from "lib/supabase/supbase.server";
import { UserRoles } from "lib/models/enums";
import CoachDashboard from "./coach-dashboard-page";
import PartnerDashboard from "./partner-dashboard-page";

export const dynamic = "force-dynamic";

async function getFamilyDashboard(familyId) {
  const supabase = getSupabaseServerComponentClient();

  const { data: family, error: familyError } = await supabase.client
    .from("families")
    .select(
      `
        *,
        partner:partner_id(*), 
        coach:assigned_coach_id(...user_profiles_view(*)),
        sessions:family_sessions(*),
        quotes(*, family_member:family_member_id(...user_profiles_view!family_members_id_fkey(*))),
        members:user_profiles_view(*)
      `
    )
    .eq("id", familyId)
    .single();

  if (familyError) return { data: null, error: familyError };

  family.headsOfHousehold = [];
  family.children = [];

  family.members.forEach((member) => {
    if (!member.is_child) {
      family.headsOfHousehold.push(member);
    } else {
      family.children.push(member);
    }
  });

  family.quoteOfTheDay =
    family.quotes?.length &&
    family.quotes[Math.floor(Math.random() * family.quotes.length)];

  return { data: family, error: null };
}

export default async function DashboardView() {
  const user = await getCurrentUser();

  // if user does not have a profile, redirect to the profile creation page
  if (!user.profile) return redirect("/join/get-started");

  if (await hasRole(UserRoles.CoachesAndAdmins)) {
    // show coach dashboard
    // get upcoming sessions for the coach
    const supabase = getSupabaseServerComponentClient();
    const sessionFields =
      "id, scheduled_time, status, ...session_id(title), ...family_id(family_name), short_id";
    const { data: upcomingSessions, error: upcomingSessionsError } =
      await supabase.client
        .from("family_sessions")
        .select(sessionFields)
        .eq("coach_id", user.profile.id)
        .eq("status", "Scheduled")
        .gte(
          "scheduled_time",
          new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
        )
        .order("scheduled_time", { ascending: true })
        .limit(4);

    // get sessions that are in the past, but do not have a status of "Completed" - these require notes
    const { data: sessionsNeedingNotes, error: sessionsNeedingNotesError } =
      await supabase.client
        .from("family_sessions")
        .select(sessionFields)
        .eq("coach_id", user.profile.id)
        .eq("status", "Scheduled")
        .lte("scheduled_time", new Date().toISOString())
        .order("scheduled_time", { ascending: true });

    // get newly assigned families
    const { data: newestFamily, error: newestFamilyError } =
      await supabase.client
        .from("families")
        .select(
          "id, family_name, status, ...life_phase_id(title), partner:partner_id(id, company_legal_name), created_at"
        )
        .eq("assigned_coach_id", user.profile.id)
        .neq("status", "Inactive")
        .neq("status", "Delinquent")
        .order("created_at", { descending: true })
        .limit(1)
        .single();

    if (
      upcomingSessionsError ||
      sessionsNeedingNotesError ||
      newestFamilyError
    ) {
      console.error(
        "ERROR - getDashboard:",
        upcomingSessionsError,
        sessionsNeedingNotesError,
        newestFamilyError
      );
      return (
        <p>
          Sorry, there was a problem loading your dashboard. Don&apos;t worry,
          you can still use the main menu to navigate within the app.
        </p>
      );
    }

    return (
      <CoachDashboard
        user={user}
        upcomingSessions={upcomingSessions}
        sessionsNeedingNotes={sessionsNeedingNotes}
        newestFamily={newestFamily}
      />
    );
  } else if (await hasRole(UserRoles.Partners)) {
    // show partner dashboard
    return <PartnerDashboard partner={user.partner} families={user.families} />;
  } else {
    const { data: family, error } = await getFamilyDashboard(user?.family?.id);

    if (error) {
      console.error("ERROR - getDashboard:", error);
      return (
        <p>
          Sorry, there was a problem loading your dashboard. Don&apos;t worry,
          you can still use the main menu to navigate within the app.
        </p>
      );
    }

    return (
      <Dashboard
        user={user}
        familyStatus={family.status}
        coach={family.coach}
        partner={family.partner}
        familyMembers={family.members}
        sessions={family.sessions}
        quoteOfTheDay={family.quoteOfTheDay}
      />
    );
  }
}
