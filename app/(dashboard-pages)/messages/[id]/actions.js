"use server";

import { localDateTime } from "lib/date";
import { sendEmailWithTemplate } from "lib/postmark";
import {
  getCurrentUser,
  getSupabaseServerComponentClient,
} from "lib/supabase/supbase.server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function AddMessage(conversationId, formData) {
  const supabase = getSupabaseServerComponentClient();
  const user = await getCurrentUser();

  if (!user || !user.profile)
    throw new Error("You must complete a profile first.");

  const conversation_id = conversationId;

  const messageBody = {
    conversation_id,
    user_profile_id: user?.profile.user_profile_id,
    html_content: formData.get("html_content"),
    source: "app",
    is_internal: formData.get("is_internal") === "true",
  };

  const { data: newMessage, error: messageError } = await supabase.client
    .from("messages")
    .insert(messageBody)
    .select()
    .single();

  if (messageError) throw new Error(messageError.message);

  // Get the recipients for the notification
  const { data: recipients, error: recipientError } = await supabase.client.rpc(
    "get_message_recipients",
    {
      p_message_id: newMessage.id,
    }
  );

  if (recipientError) throw new Error(recipientError.message);

  // Loop through recipients and send them the notification email
  for (let recipient of recipients) {
    console.log("recipient", recipient);
    const emailResponse = await sendEmailWithTemplate({
      // TODO: replace with actual recipient email
      // To: recipient.email,
      To: "flymikeroberts@gmail.com",
      ReplyTo: `a62d719a0de2113b2264ff494b5d3e9b+${conversation_id}@inbound.postmarkapp.com`,
      TemplateAlias: "relate-comment",
      TemplateModel: {
        subject: formData.get("subject"),
        body: newMessage.decrypted_html_content,
        commenter_name:
          newMessage.sender_details?.display_name ||
          newMessage.sender_details?.email,
        message_url: "https://www.totalfamily.io/messages/" + conversation_id,
        timestamp: localDateTime(newMessage.timestamp),
        is_internal: newMessage.is_internal,
      },
    });

    // If sending the notification fails, update the `notification_failed` field on the message
    if (emailResponse.error) {
      await supabase.client
        .from("messages")
        .update({ notification_failed: true })
        .eq("id", newMessage.id);
      // Decide if you want to throw or log this error
      console.error(
        `Failed to send email to ${recipient.email}: ${emailResponse.error.message}`
      );
    }
  }

  // revalidate the conversation page
  revalidatePath("/messages/" + conversation_id);
  revalidatePath("/messages");

  return { message: newMessage, conversation_id };
}

export async function MarkConversationAsUnread(conversationId) {
  const supabase = getSupabaseServerComponentClient();
  const user = await getCurrentUser();

  const { error } = await supabase.client.rpc("mark_conversation_as_unread", {
    p_conversation_id: conversationId,
    p_user_id: user.profile.user_profile_id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/messages");

  return redirect("/messages");
}

export async function MarkConversationAsRead(conversationId) {
  const supabaseClient = getSupabaseServerComponentClient();
  const user = await getCurrentUser();

  const { error } = await supabaseClient.client.rpc(
    "mark_conversation_as_read",
    {
      p_conversation_id: conversationId,
      p_user_id: user.profile.user_profile_id,
    }
  );

  if (error) throw new Error(error.message);

  return revalidatePath("/messages");
}

export async function AssignConversation(conversationId, userId) {
  const supabaseClient = getSupabaseServerComponentClient();

  const { error } = await supabaseClient.client
    .update("conversations", {
      assigned_to_user_profile_id: userId,
    })
    .eq("id", conversationId);

  if (error) throw new Error(error.message);

  return revalidatePath("/messages/" + conversationId);
}
