import { prettyDate } from "lib/date";
import { getPosts, getSinglePost } from "lib/ghost";
import { redirect } from "next/navigation";
import RelatedPosts from "./related-posts";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { slug } = params;

  if (!slug) return redirect("/journal");

  const post = await getSinglePost(slug);

  if (!post) return redirect("/journal");

  const tags = post.tags.map((tag) => tag.slug).join(", ");

  const relatedPosts =
    (await getPosts({
      filter: tags.length ? `tag:[${tags}]+id:-${post.id}` : `id:-${post.id}`,
      limit: 3,
    })) || [];

  if (!relatedPosts.length) {
    const defaultPosts = (await getPosts({ limit: 3 })) || [];
    relatedPosts.push(...defaultPosts);
  }

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-prose">
        <h1 className="font-brand text-4xl md:text-6xl">{post.title}</h1>
        <div className="relative mt-8 flex items-center gap-x-4">
          <img
            src={post.primary_author.profile_image || "/img/tfm-fun-logo.png"}
            alt=""
            className="h-10 w-10 rounded-full bg-gray-50"
          />
          <div className="leading-6">
            <p className="font-medium text-gray-900">
              {post.primary_author?.name}
            </p>
            <p className="font-subheading text-sm uppercase text-gray-600">
              <time dateTime={post.updated_at}>
                {prettyDate(post.updated_at)}
              </time>
            </p>
          </div>
        </div>
      </div>
      {post.feature_image && (
        <img
          src={post.feature_image}
          className="mx-auto w-full max-w-lg rounded"
        />
      )}
      <article
        className="prose mx-auto lg:prose-xl"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <RelatedPosts posts={relatedPosts} />
    </div>
  );
}
