"use client";

import Spinner from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex justify-center px-4 pb-12 pt-48 text-gray-400">
      <Spinner />
    </div>
  );
}
