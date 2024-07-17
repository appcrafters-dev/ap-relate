import { getSinglePage } from "lib/ghost";
import { redirect } from "next/navigation";

export default async function GhostPage({ slug }) {
  const page = await getSinglePage(slug);

  if (!page) return redirect("/journal");

  return (
    <div className="my-16 space-y-8 px-4 pt-16">
      <div className="mx-auto max-w-prose">
        <h1 className="font-brand text-4xl md:text-6xl">{page.title}</h1>
      </div>
      {page.feature_image && (
        <img
          src={page.feature_image}
          className="mx-auto w-full max-w-lg rounded"
        />
      )}
      <article
        className="prose mx-auto lg:prose-xl"
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
    </div>
  );
}
