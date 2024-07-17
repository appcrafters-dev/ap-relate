import { LinkButton } from "@/components/ui/buttons";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { getSupabaseServerComponentClient } from "lib/supabase/supbase.server";
import Link from "next/link";

export default async function ResourceIdPage({ params }) {
  const id = params.id;
  const supabase = getSupabaseServerComponentClient();

  const { data, error } = await supabase.client
    .from("resources")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return <p>{error.message}</p>;
  }
  if (data && data.file_path) {
    console.log(data);
    // download the file from supabase storage
    const { data: fileData, error: fileError } = await supabase.client.storage
      .from("resources")
      .createSignedUrl(data.file_path, 60);

    console.log(fileData || fileError);

    return (
      <div className="flex flex-col space-y-6">
        <Link href="/resources" className="text-sm italic text-gray-500">
          &larr; Back to All Resources
        </Link>
        <div className="overflow-hidden rounded bg-white shadow-sm">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="font-brand text-4xl text-tfm-primary">
              {data.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-500">
              {data.description}
            </p>
          </div>
          {data.cover_image && (
            <div className="max-h-[400px] overflow-hidden">
              <img
                src={data.cover_image}
                alt={`Cover of ${data.title}`}
                className="h-auto max-w-full object-cover"
              />
            </div>
          )}
          <div className="inline-flex w-full justify-between space-x-4 px-4 py-4 sm:px-6">
            <LinkButton
              newTab
              Icon={ArrowDownTrayIcon}
              href={fileData.signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              primary
            >
              Download Resource
            </LinkButton>
            <LinkButton href={`/resources/${id}/edit`} className="ml-4">
              Edit
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }
}
