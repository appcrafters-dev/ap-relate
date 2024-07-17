import { LinkButton } from "@/components/ui/buttons";
import { PlusIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { UserRoles } from "lib/models/enums";
import {
  getCurrentUser,
  getSupabaseServerComponentClient,
} from "lib/supabase/supbase.server";
import Link from "next/link";

export default async function PartnerResources() {
  const supabase = getSupabaseServerComponentClient();
  const user = await getCurrentUser();

  const { data: resources, error } = await supabase.client
    .from("resources")
    .select("*");

  return (
    <div className="space-y-8">
      <h1 className="font-brand text-4xl font-bold italic text-tfm-primary">
        Resources
      </h1>
      <ul className="grid gap-4 md:grid-cols-2">
        {resources.length ? (
          resources.map((resource, idx) => (
            <li
              key={idx}
              className="col-span-1 flex flex-col justify-between divide-y divide-gray-200 rounded bg-white shadow"
            >
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="mx-auto max-w-sm flex-1 truncate md:max-w-none">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-base font-medium text-gray-900">
                      {resource.title}
                    </h3>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-500">
                    {resource.description}
                  </p>
                </div>
                {resource.cover_image && (
                  <img
                    className="h-16 w-16 flex-shrink-0 rounded bg-gray-300"
                    src={resource.cover_image}
                    alt=""
                  />
                )}
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <Link
                      href={`/resources/${resource.id}`}
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      <span className="mr-2">Open</span>
                      <ChevronRightIcon
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No resources found.</p>
        )}
      </ul>
      {/* <pre>{JSON.stringify(resources || error, null, 2)}</pre> */}
      {user.profile.role === UserRoles.Admin && (
        <LinkButton href="/resources/new" primary Icon={PlusIcon}>
          New
        </LinkButton>
      )}
    </div>
  );
}
