import { getPosts } from "lib/ghost";
import Posts from "./posts";

export const dynamic = "force-dynamic";

export default async function JournalHomePage() {
  const posts = await getPosts();

  return <Posts posts={posts || []} />;
}
