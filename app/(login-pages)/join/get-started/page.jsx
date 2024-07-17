import OrDivider from "@/app/components/divider";

import { LinkButton } from "@/components/ui/buttons";
import { BuildingLibraryIcon, UsersIcon } from "@heroicons/react/20/solid";

import { getCurrentUser } from "lib/supabase/supbase.server";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) return redirect("/join");

  return (
    <div className="space-y-4 text-center">
      <h1 className="text-left font-brand text-4xl font-bold italic text-tfm-primary">
        Welcome to TFM!
      </h1>
      <p className="text-left text-gray-500">
        Before we get started, let us know who you are:
      </p>

      <div>
        <h2 className="text-lg font-semibold leading-8 text-gray-800">
          For Families, Individuals &amp; Couples
        </h2>
        {/* <p className="text-sm text-gray-500">
          Every family deserves to have healthy, happy and connected
          relationships. Experience a new kind of family meeting with private
          coaching and support.
        </p> */}
      </div>
      <LinkButton
        href="/join/get-started/family"
        primary
        fullWidth
        Icon={UsersIcon}
      >
        Continue as a Family
      </LinkButton>

      <OrDivider />

      <div>
        <h2 className="text-lg font-semibold leading-8 text-gray-800">
          For Wealth Firms &amp; Employers
        </h2>
        {/* <p className="text-sm text-gray-500">
          Support your clients in a new way with a platform to build stronger
          relationships and families. Manage your client relationships, track
          progress, and simplify billing.
        </p> */}
      </div>
      <LinkButton
        href="/join/get-started/partner"
        primary
        fullWidth
        Icon={BuildingLibraryIcon}
      >
        Continue as a Partner
      </LinkButton>
    </div>
  );
}
