import { getPosts, getTag } from "lib/ghost";
import Posts from "../../posts";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { slug } = params;
  const tag = await getTag(slug);

  if (!tag) return notFound();

  const posts = await getPosts({ filter: `tag:${slug}` });

  return (
    <Posts
      pageTitle={tag.name || slug}
      pageDescription={
        tag.description
          ? tag.description
          : `A collection of ${tag.count?.posts} post${
              tag.count && tag.count.posts !== 1 ? "s" : ""
            }`
      }
      posts={posts}
    />
  );
}
