export default function FamilyMemberLayoutSkeleton() {
  return (
    <main className="-mt-10 animate-pulse overflow-hidden">
      <article className="blur-md">
        <div>
          <div className="h-32 bg-gradient-to-r from-tfm-secondary to-tfm-sand" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              {/* Skeleton for avatar */}
              <div className="flex">
                <div className="h-24 w-24 animate-pulse rounded-full bg-gray-200 ring-4 ring-white sm:h-32 sm:w-32"></div>
              </div>
              {/* Skeleton for name and edit button */}
              <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div className="mt-6 min-w-0 flex-1 animate-pulse sm:hidden 2xl:block">
                  <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
                </div>
                <div className="mt-6 flex animate-pulse flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <div className="h-8 w-24 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
            <div className="mt-6 hidden min-w-0 flex-1 animate-pulse sm:block 2xl:hidden">
              <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>

        {/* Skeleton for Tabs */}
        <div className="mt-6 sm:mt-2 2xl:mt-5">
          <div className="border-b border-gray-200">
            <div className="mx-auto max-w-5xl animate-pulse px-4 sm:px-6 lg:px-8">
              <div className="-mb-px flex space-x-8 overflow-y-auto">
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className="mt-4 h-4 w-24 rounded bg-gray-200"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton for Tab Panels */}
        <div className="mx-auto mt-6 max-w-5xl animate-pulse px-4 sm:px-6 lg:px-8">
          <div
            as="dl"
            className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2"
          >
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="sm:col-span-1">
                <div className="mt-2 h-4 w-1/3 rounded bg-gray-200"></div>
                <div className="mt-3 h-4 w-3/4 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
