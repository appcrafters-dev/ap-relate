import { HeartIcon } from "@heroicons/react/24/outline";

export default function Loading() {
  return (
    <div className="flex justify-center px-4 pb-12 pt-48">
      <HeartIcon className="h-12 w-12 animate-pulse text-tfm-secondary" />
    </div>
  );
}
