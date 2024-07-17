import Invitation from "./invite-page";
import { getSupabaseServerComponentClient } from "lib/supabase/supbase.server";
import { ErrorBox } from "@/components/ui/errors";

export const metadata = {
  title: "Total Family Management - Invitation",
};

async function getInvitationDetails(code) {
  const supabase = getSupabaseServerComponentClient();

  const { data: data, error: inviteError } = await supabase.client
    .from("connect_invitations")
    .select("*, family:families(*)")
    .eq("invite_code", code)
    .maybeSingle();

  if (inviteError || !data) {
    return {
      error:
        "There was a problem finding your invitation. Please contact support@totalfamilymgmt.com.",
    };
  }

  const familyDetails =
    data.status === "Invited"
      ? {
          family_name: data.family.family_name.split(" Family")[0],
          family: data.family.id,
        }
      : null;

  const error = getErrorFromResponse(data);

  return { familyDetails, error };
}

function getErrorFromResponse(data) {
  if (!data.family) return "This invitation is invalid.";
  if (data.status === "Expired") {
    return "This invitation has expired. Please contact support@totalfamilymgmt.com for a new link.";
  }
  if (data.status !== "Invited") {
    return "This invitation has already been redeemed. If you need to add another person to your account, please contact support@totalfamilymgmt.com.";
  }
  return null;
}

export default async function InvitationPage({ params }) {
  const { familyDetails, error } = await getInvitationDetails(params.code);

  if (error) {
    return (
      <div className="mx-auto max-w-md space-y-8 px-4 py-24">
        <ErrorBox msg={fetchError} />
      </div>
    );
  }

  return <Invitation family={familyDetails} code={params.code} />;
}
