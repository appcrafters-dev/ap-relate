import { getSupabaseServerComponentClient } from "lib/supabase/supbase.server";

import { ErrorBox } from "@/components/ui/errors";
import Content from "../../components/content";
import { notFound } from "next/navigation";

export default async function GuideArticlePage({ params }) {
  const supabase = getSupabaseServerComponentClient();
  const slugPath = params.slugs.join("/");
  const { data, error } = await supabase.getGuidePage(slugPath);

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  // TODO: on refresh, notFound() is not working and hangs on loading spinner
  if (!data) notFound();

  if (!data)
    return (
      <ErrorBox msg="Sorry, this article either doesn't exist or moved somewhere else." />
    );

  const categoryTitle = data.category?.title || data.parent_category?.title;

  return (
    <Content
      htmlContent={data.content}
      subheading={categoryTitle}
      heading={data.title}
    />
  );
}
