"use client";

import { Button, LinkButton } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import {
  TfmFormSelect,
  TfmInput,
  TfmTextArea,
  TfmTextEditor,
} from "@/components/ui/forms";
import { LinkIcon, TrashIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/solid";

import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GuideArticleAdmin({ data, table, id }) {
  const supabase = getSupabaseClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [content, setContent] = useState(data.content);
  const [slug, setSlug] = useState(data.slug);
  const [error, setError] = useState(null);
  const router = useRouter();

  const upsertGuidePage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const body = new FormData(e.target);
    const args = Object.fromEntries(body.entries());
    console.log("updateGuideBody", body);
    console.log("upsertGuideArgs", args);
    const { data, error } = await supabase.client
      .from("guide_" + table)
      .upsert({ ...args, content, id })
      .select()
      .single();

    console.log("updateGuide", data || error);
    if (error) setError(error.message || "An error occurred.");
    return setLoading(false);
  };

  const deleteGuidePage = async () => {
    setDeleteLoading(true);
    const { error } = await supabase.client
      .from("guide_" + table)
      .delete()
      .eq("id", id);
    console.log("deleteGuide", data || error);
    if (error) setError(error.message || "An error occurred.");
    else router.push("/admin/guide");
  };

  return (
    <form className="space-y-4" onSubmit={upsertGuidePage}>
      <input
        defaultValue={data.title}
        name="title"
        className="block w-full rounded border border-gray-200 font-brand text-4xl font-semibold shadow-sm focus:border-tfm-secondary focus:outline-none focus:ring-tfm-secondary sm:text-5xl"
      />
      <input type="hidden" name="order" value={data.order} />
      {table === "articles" && (
        <input type="hidden" name="category_id" value={data.category_id} />
      )}
      <TfmTextEditor value={content} onChange={(c) => setContent(c)} />
      <TfmInput
        id="slug"
        label="Slug"
        value={slug}
        onChange={(e) => {
          // validate the slug, only allow alphanumeric characters and dashes, lowercase, and replace spaces with dashes
          let value = e.target.value;
          value = value.trim().toLowerCase();
          value = value.replace(/\s/g, "-");
          value = value.replace(/[^a-z0-9-]/g, "");
          setSlug(value);
        }}
      />
      <TfmTextArea
        id="seo_description"
        defaultValue={data.seo_description}
        label="SEO Description"
      />
      {table === "articles" && (
        <TfmFormSelect
          defaultValue={data.is_published}
          id="is_published"
          label="Status"
        >
          <option value="false">Draft</option>
          <option value="true">Published</option>
        </TfmFormSelect>
      )}

      <Button type="submit" loading={loading} Icon={CheckIcon} primary>
        Save {table === "categories" ? "Category" : "Article"}
      </Button>
      <hr />
      <div className="flex items-center space-x-4">
        <LinkButton
          href={"/guide/" + data.slug_path}
          Icon={LinkIcon}
          small
          newTab
        >
          Preview
        </LinkButton>
        <Button
          loading={deleteLoading}
          onClick={deleteGuidePage}
          Icon={TrashIcon}
          small
          danger
        >
          Delete {table === "categories" ? "Category" : "Article"}
        </Button>
      </div>
      {error && <ErrorBox msg={error} />}
    </form>
  );
}
