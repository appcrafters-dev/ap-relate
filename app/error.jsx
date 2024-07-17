"use client";
import { ErrorLayout } from "@/components/layout";
import { LinkSignpost } from "@/components/ui/buttons";

export default function ErrorPage({ error, reset }) {
  return (
    <ErrorLayout>
      <div className="py-12">
        <p className="font-brand text-sm font-semibold uppercase tracking-wide text-black text-opacity-50">
          {error.code || "500 error"}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
          Something went wrong.
        </h1>
        <p className="mt-2 text-lg font-medium text-black text-opacity-50">
          Error: {error.message || "An unknown error occurred."}
        </p>
        <div className="mt-6">
          <LinkSignpost href="/">Go back home &rarr;</LinkSignpost>
        </div>
      </div>
    </ErrorLayout>
  );
}
