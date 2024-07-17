import { getCurrentUser } from "lib/supabase/supbase.server";
import UpsertResourceForm from "./new-resource-form";

export default async function NewResourceServerPage() {
  const user = await getCurrentUser();

  if (user?.app_metadata.role !== "admin") {
    return (
      <div>
        <p>
          You do not have permission to view this. Please contact your admin for
          more info.
        </p>
      </div>
    );
  } else return <UpsertResourceForm />;
}
