import {
  getCurrentUser,
  getSupabaseServerComponentClient,
} from "lib/supabase/supbase.server";
import GuideLayout from "./layout-client";

export default async function GuideLayoutServer({ children }) {
  const user = await getCurrentUser();
  const supabase = getSupabaseServerComponentClient();
  const { data: categories, error } = await supabase.client
    .from("guide_categories")
    .select()
    .order("order", { ascending: true });

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  const { data: articles, error: articlesError } = await supabase.client
    .from("guide_articles")
    .select();

  if (articlesError) return <pre>{JSON.stringify(articlesError, null, 2)}</pre>;

  return (
    <GuideLayout {...{ articles, categories, user }}>{children}</GuideLayout>
  );
}
