"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { classNames } from "lib/utils";
import { UserRoles } from "lib/models/enums";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import Spinner from "@/components/ui/spinner";

export default function FamilySelector({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabaseClient = getSupabaseClientComponentClient();
  const includesRole = (roles = []) => {
    if (!Array.isArray(roles)) roles = [roles];
    return user.profiles.some((p) => roles.includes(p.role));
  };

  const initialProfileId = user.profile?.id || null;
  const [defaultProfileId, setDefaultProfileId] = useState(initialProfileId);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const updateCurrentProfile = async (profileId) => {
    setLoadingProfile(true);

    try {
      if (defaultProfileId === profileId) return;
      const profile = user.profiles.find((p) => p.id === profileId);

      setDefaultProfileId(profileId);
      localStorage.setItem("defaultProfileId", profileId);

      const { error } = await supabaseClient.client.auth.updateUser({
        data: {
          default_user_profile: profile,
          role: profile.role,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error updating current profile", error);
      alert("Error updating current profile");
    } finally {
      setLoadingProfile(false);
      await supabaseClient.client.auth.refreshSession();
      if (pathname !== "/dashboard") router.push("/dashboard");
      router.refresh();
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "defaultProfileId") {
        if (e.newValue !== defaultProfileId) {
          updateCurrentProfile(e.newValue);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [defaultProfileId]);

  const getProfile = (profileId) => {
    return user.profiles.find((p) => p.id === profileId);
  };

  const getFamilyOrPartner = (profileId) => {
    const profile = getProfile(profileId);
    return (
      user.families?.find((f) => f.id === profile.family_id) ||
      user.partners?.find((p) => p.id === profile.partner_id)
    );
  };

  const getFamilyOrPartnerName = (profileId) => {
    const familyOrPartner = getFamilyOrPartner(profileId);
    return familyOrPartner?.family_name || familyOrPartner?.company_legal_name;
  };

  const showFamilySelector =
    !includesRole(UserRoles.CoachesAndAdmins) && user.profiles.length > 1;

  return showFamilySelector ? (
    <div className="flex flex-col pb-4">
      <Listbox
        as="div"
        className="relative max-w-[14rem]"
        value={defaultProfileId}
        onChange={updateCurrentProfile}
      >
        <Listbox.Label className="font-subheading text-sm font-bold uppercase tracking-wide text-gray-400">
          Switch Account
        </Listbox.Label>
        <div className="relative mt-1">
          <Listbox.Button className="mt-2 inline-flex w-full items-center justify-between rounded  border-2 border-transparent bg-tfm-primary-900 p-2 px-3 font-semibold text-gray-300 shadow-sm transition-colors hover:border-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm">
            {getFamilyOrPartnerName(defaultProfileId) || "Select a family..."}
            {loadingProfile ? (
              <Spinner />
            ) : (
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </Listbox.Button>

          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-25 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-200 ease-out"
            leaveFrom="transform scale-200 opacity-100"
            leaveTo="transform scale-25 opacity-0"
          >
            <Listbox.Options className="z-50 mt-2 max-h-60 w-full divide-y overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {user.profiles.length > 1 &&
                user.profiles.map((option, idx) => (
                  <Listbox.Option
                    key={idx}
                    value={option.id}
                    className={({ active }) =>
                      classNames(
                        "relative cursor-pointer select-none py-2 pl-3 pr-9",
                        active ? "bg-tfm-secondary text-white" : "text-gray-900"
                      )
                    }
                  >
                    {({ active, selected }) => {
                      const familyOrPartner = getFamilyOrPartner(option.id);
                      return (
                        <>
                          <div className="block">
                            <p
                              className={classNames(
                                "truncate text-base font-semibold",
                                selected && "font-bold"
                              )}
                            >
                              {getFamilyOrPartnerName(option.id)}
                              {familyOrPartner.heads_of_household?.length >
                              1 ? (
                                <span
                                  className={classNames(
                                    "text-xs",
                                    active ? "text-white" : "text-gray-500"
                                  )}
                                >
                                  (
                                  {familyOrPartner.heads_of_household.join(
                                    ", "
                                  )}
                                  )
                                </span>
                              ) : null}
                            </p>
                            <p
                              className={classNames(
                                "ml-1.5 mt-1 truncate text-xs text-gray-500",
                                active ? "text-white" : "text-gray-500"
                              )}
                            >
                              <span className="font-semibold">
                                {familyOrPartner.family_name
                                  ? "Family "
                                  : "Partner "}
                                ID:{" "}
                              </span>
                              {familyOrPartner.id}
                              {familyOrPartner.coach}
                            </p>
                          </div>

                          {selected && (
                            <span
                              className={classNames(
                                "absolute inset-y-0 right-0 flex items-center pr-4",
                                active ? "text-white" : "text-tfm-primary"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      );
                    }}
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  ) : null;
}
