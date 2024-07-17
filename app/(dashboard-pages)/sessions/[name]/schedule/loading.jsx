export default function SessionLoadingSkeleton() {
  return (
    <div className="mx-auto grid max-w-md animate-pulse bg-white shadow blur filter sm:rounded-xl">
      <div className="space-y-4 px-4 py-5 sm:px-6">
        {/* Skeleton for the title */}
        <div className="mt-2 h-6 w-3/4 rounded bg-gray-200"></div>

        <div className="space-y-4">
          {/* Skeleton for the session fields */}
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          ))}

          {/* Skeleton for the Scheduled Time or Time Zone */}
          <div className="flex items-center space-x-3">
            <div className="h-5 w-5 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Skeleton for the Reschedule button */}
        <div className="space-y-4 pt-4 text-center">
          <div className="mx-auto h-8 w-1/3 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
