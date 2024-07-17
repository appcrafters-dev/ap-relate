"use server";

import {
  getCurrentUser,
  getSupabaseServerComponentClient,
} from "lib/supabase/supbase.server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function startConversation(formData) {
  const supabase = getSupabaseServerComponentClient();
  const user = await getCurrentUser();

  if (!user || !user.profile)
    throw new Error("You must complete a profile first.");

  const body = {
    from_user_profile_id: user?.profile?.user_profile_id,
    assigned_to_user_profile_id:
      formData.get("assigned_to_user_profile_id") || null,
    subject: formData.get("subject"),
  };

  console.log("newConversationBody", body);

  const { data: newConversation, error } = await supabase.client
    .from("conversations")
    .insert(body)
    .select()
    .single();

  console.log("newConversation", newConversation || error);
  if (error) throw new Error(error.message);

  const messageBody = {
    html_content: formData.get("html_content"),
    user_profile_id: user.profile.user_profile_id,
    source: "app",
    is_internal: formData.get("is_internal") === "true",
    conversation_id: newConversation.id,
  };

  console.log("newMessageBody", messageBody);

  const { error: messageError } = await supabase.client
    .from("messages")
    .insert(messageBody)
    .select()
    .single();

  if (messageError) throw new Error(messageError.message);

  revalidatePath("/messages");

  return redirect("/messages/" + newConversation.id);
}
