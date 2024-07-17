"use client";

import TfmTabs from "@/app/components/tabs";
import {
  AcademicCapIcon,
  ChatBubbleBottomCenterTextIcon,
  CogIcon,
  HeartIcon,
  PencilIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import FamilyPage from "../../family-page";
import { LinkButton } from "@/components/ui/buttons";
import FamilyDetails from "@/app/(dashboard-pages)/settings/family/family-details";
import { UserRoles } from "lib/models/enums";

export default function FamilyAdminPage({ data, user }) {
  const {
    family,
    headsOfHousehold,
    children,
    pets,
    lifePhases,
    coaches,
    partners,
  } = data;
  return (
    <TfmTabs
      tabs={[
        {
          name: "Overview",
          icon: AcademicCapIcon,
          content: () => (
            <div className="grid space-y-2">
              <h2 className="mb-4 font-brand text-2xl">
                The {family.family_name} Family
              </h2>
              <div>
                <LinkButton
                  href={`/sessions/list?family_id.eq=${family.id}&sort_desc=scheduled_time`}
                  Icon={AcademicCapIcon}
                >
                  View Sessions
                </LinkButton>
              </div>
              <div>
                <LinkButton
                  href={`/sessions/new?family_id=${family.id}&coach_id=${family.assigned_coach_id}`}
                  Icon={PlusIcon}
                >
                  Add Session
                </LinkButton>
              </div>
              <div>
                <LinkButton
                  href={`/family/${family.id}/quotes`}
                  Icon={ChatBubbleBottomCenterTextIcon}
                >
                  View Quotes
                </LinkButton>
              </div>
              <div>
                <LinkButton
                  href={`/family/${family.id}/vision`}
                  Icon={HeartIcon}
                >
                  View Vision
                </LinkButton>
              </div>
              <div>
                <LinkButton
                  href={`/family/${family.id}/values`}
                  Icon={PencilIcon}
                >
                  Edit Family Values
                </LinkButton>
              </div>
            </div>
          ),
        },
        {
          name: "Members",
          icon: UsersIcon,
          content: () => (
            <FamilyPage
              familyName="My Family"
              headsOfHousehold={headsOfHousehold}
              familyChildren={children}
              pets={pets}
              hideHeading
              familyId={family.id}
            />
          ),
        },

        {
          name: "Family Profile",
          icon: CogIcon,
          content: () => (
            <FamilyDetails
              family={family}
              lifePhases={lifePhases}
              partners={partners}
              coaches={coaches}
              viewAdmin={true}
              editAdmin={UserRoles.Admins.includes(user.profile.role)}
            />
          ),
        },
      ]}
    />
  );
}
