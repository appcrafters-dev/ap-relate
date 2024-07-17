import { LinkButton } from "@/components/ui/buttons";
import { ErrorLayout } from "@/components/layout";
import { getCurrentUser } from "lib/supabase/supbase.server";
import { HomeIcon } from "@heroicons/react/20/solid";

export default async function NotFound() {
  const user = await getCurrentUser();
  return (
    <ErrorLayout>
      <div className="py-12">
        <p className="font-accent text-sm uppercase tracking-wide text-black text-opacity-50">
          404 error
        </p>
        <h1 className="mt-2 font-brand text-4xl">
          Uh oh! I think you{"'"}re lost.
        </h1>
        <p className="mt-2 font-subheading text-lg text-black text-opacity-50">
          It looks like the page you{"'"}re looking for doesn{"'"}t exist.
        </p>
        <div className="mt-6">
          <LinkButton href={user ? "/dashboard" : "/"} Icon={HomeIcon} primary>
            {user ? "Go to Dashboard" : "Return to Homepage"}
          </LinkButton>
        </div>
      </div>
    </ErrorLayout>
  );
}
