import { prettyDate } from "lib/date";
import Link from "next/link";

export default function RelatedPosts({ posts = [] }) {
  return (
    <section className="space-y-4 py-8">
      <h2 className="font-brand text-4xl font-medium md:text-5xl">
        Related Posts
      </h2>
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col items-start">
            <div className="relative w-full">
              <img
                src={post.feature_image || "/img/tfm-logo.png"}
                alt={post.feature_image_alt || ""}
                className="aspect-[16/9] w-full rounded bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
              />
              <div className="absolute inset-0 rounded ring-1 ring-inset ring-gray-900/10" />
            </div>
            <div className="max-w-xl">
              <div className="mt-8 flex items-center gap-x-4 text-xs">
                {post.primary_tag && (
                  <Link
                    href={"/journal/tag/" + post.primary_tag.slug}
                    className="font-accent uppercase tracking-wide text-gray-600"
                  >
                    {post.primary_tag.name}
                  </Link>
                )}
              </div>
              <div className="group relative">
                <h3 className="mt-3 font-brand text-3xl leading-8 text-gray-900 group-hover:text-gray-600">
                  <Link href={"/journal/" + post.slug}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                  {post.excerpt}...
                </p>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase">
                <time dateTime={post.published_at}>
                  {prettyDate(post.published_at)}
                </time>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
