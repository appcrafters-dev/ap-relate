import { prettyDate } from "lib/date";
import Link from "next/link";

export default function Posts({
  posts = [],
  pageTitle = "TFM Journal",
  pageDescription = "Discussing our research, thoughts, and best practices for a thriving personal and professional life.",
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <h2 className="font-brand text-6xl tracking-tight text-gray-900">
          {pageTitle}
        </h2>
        <p className="mt-2 font-subheading text-lg uppercase text-gray-600">
          {pageDescription}
        </p>
        <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
          {posts.length ? (
            posts.map((post) => (
              <article
                key={post.id}
                className="relative isolate flex flex-col gap-8 py-4 lg:flex-row"
              >
                <div className="lg:aspect-square relative aspect-[16/9] sm:aspect-[2/1] lg:w-64 lg:shrink-0">
                  <Link href={"/journal/" + post.slug}>
                    <img
                      src={post.feature_image || "/img/tfm-logo.png"}
                      alt={post.feature_image_alt || ""}
                      className="absolute inset-0 h-full w-full rounded bg-tfm-primary object-cover shadow-sm"
                    />
                  </Link>
                </div>
                <div>
                  {post.primary_tag && (
                    <Link
                      href={"/journal/tag/" + post.primary_tag.slug}
                      className="font-accent uppercase tracking-wide text-gray-600"
                    >
                      {post.primary_tag.name}
                    </Link>
                  )}
                  <div className="group relative max-w-xl">
                    <h3 className="mt-3 font-brand text-4xl leading-8 text-tfm-primary group-hover:text-gray-600">
                      <Link href={"/journal/" + post.slug}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-5 text-sm leading-6 text-gray-600">
                      {post.excerpt}...
                    </p>
                    <p className="mt-3 font-subheading text-sm uppercase">
                      <time dateTime={post.published_at}>
                        {prettyDate(post.published_at)}
                      </time>
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center font-subheading uppercase text-gray-600">
              Oops! No posts found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
