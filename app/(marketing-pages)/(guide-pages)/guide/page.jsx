import { LinkSignpost } from "@/components/ui/buttons";
import { getSupabaseServerComponentClient } from "lib/supabase/supbase.server";

export default async function GuideHomepage() {
  const supabase = getSupabaseServerComponentClient();
  const { data: categories, error } = await supabase.client
    .from("guide_categories")
    .select()
    .is("parent_id", null);

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <div>
      <h1>Guide Home</h1>
      <ul>
        <LinkSignpost href="/guide">Guide Home</LinkSignpost>
        {categories.map((category) => (
          <LinkSignpost key={category.id} href={`/guide/${category.slug}`}>
            {category.name}
          </LinkSignpost>
        ))}
      </ul>
    </div>
  );
}
