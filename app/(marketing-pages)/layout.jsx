import MarketingNav from "./components/marketing-nav";
import MarketingFooter from "./components/footer";
import {
  getCurrentUser,
  // getSupabaseServerComponentClient,
} from "lib/supabase/supbase.server";

export default async function MarketingLayout({ children }) {
  const user = await getCurrentUser();
  // TODO: put this in context
  // const supabase = getSupabaseServerComponentClient();
  // const { data: categories = [] } = await supabase.client
  //   .from("guide_categories")
  //   .select()
  //   .order("order", { ascending: true });

  // const { data: articles = [] } = await supabase.client
  //   .from("guide_articles")
  //   .select();

  return (
    <>
      <MarketingNav {...{ user }} />
      <main className="space-y-12">{children}</main>
      <MarketingFooter />
    </>
  );
}
