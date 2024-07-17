import { getSupabaseServerComponentClient } from "lib/supabase/supbase.server";
import UpsertResourceForm from "../../new/new-resource-form";

export default async function EditResourcePage({ params }) {
  const supabase = getSupabaseServerComponentClient();
  const { data: resource, error } = await supabase.client
    .from("resources")
    .select("*")
    .eq("id", params.id)
    .single();

  console.log(resource);
  console.log(error);

  if (error) return <pre>{error.message}</pre>;

  return <UpsertResourceForm resource={resource} />;
}
