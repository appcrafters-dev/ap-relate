import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import { classNames } from "lib/utils";

export function ErrorBox({
  msg = "Sorry, something went wrong. Please try again later.",
  success = false,
}) {
  return (
    <div
      className={classNames(
        "rounded p-4",
        success ? "bg-green-50" : "bg-red-50"
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {success ? (
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          ) : (
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          )}
        </div>
        <div className="ml-3">
          <h3
            className={classNames(
              "text-sm font-medium",
              success ? "text-green-800" : "text-red-800"
            )}
          >
            {msg}
          </h3>
        </div>
      </div>
    </div>
  );
}
