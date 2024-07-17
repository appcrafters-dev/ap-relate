"use client";

import { Button, LinkSignpost } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import {
  TfmAvatarUploader,
  TfmFormHeading,
  TfmFormSelect,
  TfmInput,
  TfmTextArea,
} from "@/components/ui/forms";
import { PlusIcon } from "@heroicons/react/20/solid";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpsertResourceForm({ resource = {} }) {
  const supabaseClient = getSupabaseClientComponentClient();
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();
  const [coverImage, setCoverImage] = useState(resource?.cover_image || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setUploading(true);

    const title = e.target.title.value;
    const description = e.target.description.value;
    const target_roles = JSON.parse(e.target.target_roles.value);
    const published = e.target.published.value;
    let file_path = resource?.file_path;

    if (!resource?.id) {
      const file = e.target.resource.files[0];
      const { data: fileData, error: fileError } =
        await supabaseClient.client.storage
          .from("resources")
          .upload(file.name, file);

      if (fileError) {
        setUploading(false);
        return setErrorMsg(fileError.message);
      }
      if (fileData) console.log("File uploaded: ", fileData);
      file_path = fileData.path;
    }

    const { data, error } = resource?.id
      ? await supabaseClient.client
          .from("resources")
          .update({
            title,
            description,
            target_roles,
            published,
            file_path,
            cover_image: coverImage,
          })
          .eq("id", resource?.id)
          .select("*")
          .single()
      : await supabaseClient.client
          .from("resources")
          .insert({
            title,
            description,
            target_roles,
            published,
            file_path,
          })
          .select("*")
          .single();

    console.log(data);

    setUploading(false);

    if (error) {
      console.error("Error: ", error);
      setErrorMsg(error.message);
    } else {
      console.log("Resource added: ", data);
      router.replace("/resources/" + data.id);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-lg flex-col space-y-4"
    >
      <TfmFormHeading>
        {resource?.id ? "Update" : "Add"} Resource
      </TfmFormHeading>
      <TfmInput
        label="Title"
        id="title"
        required
        defaultValue={resource?.title}
      />
      <TfmTextArea
        label="Description"
        id="description"
        required
        defaultValue={resource?.description}
      />
      <TfmAvatarUploader
        label="Cover Image"
        src={coverImage}
        setSrc={setCoverImage}
        fileName={resource?.id + "_cover_image"}
      />
      {!resource?.id && (
        <TfmInput type="file" label="Resource" id="resource" required />
      )}
      {resource?.id && <a href={resource?.file_path}>View Resource</a>}
      <TfmFormSelect
        label="Target Audience"
        id="target_roles"
        required
        defaultValue={JSON.stringify(resource?.target_roles)}
      >
        <option value="" />
        <option value={JSON.stringify(["partner"])}>Partners</option>
        <option value={JSON.stringify(["coach", "family"])}>Families</option>
        <option value={JSON.stringify(["coach"])}>Coaches</option>
      </TfmFormSelect>
      <TfmFormSelect
        label="Publish?"
        id="published"
        required
        defaultValue={resource?.published}
      >
        <option value="" />
        <option value="false">No, keep as Draft</option>
        <option value="true">Yes</option>
      </TfmFormSelect>
      {errorMsg && <ErrorBox msg={errorMsg} />}
      <Button type="submit" primary Icon={PlusIcon} loading={uploading}>
        {resource?.id ? "Update Resource" : "Add Resource"}
      </Button>
      <center>
        <LinkSignpost href="/resources">Cancel</LinkSignpost>
      </center>
    </form>
  );
}
