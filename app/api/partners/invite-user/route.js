import { getSupabaseRouteHandlerSecretClient } from "lib/supabase/supabase.edge";

export async function POST(req, res) {
  const { email, first_name, last_name, occupation, role } = await req.json();
  const supabase = getSupabaseRouteHandlerSecretClient();
  const { data: user, error } = await supabase.client
    .from("users")
    .select()
    .eq("email", email)
    .single();
  if (error) {
    console.error("Error finding user", email, error);
    return res.status(500).json({ error });
  }
  if (!user) {
    console.error("User not found", email);
    return res.status(404).json({ error: "User not found" });
  }
  const { data: partner, error: partnerError } = await supabase.client
    .from("partners")
    .select()
    .eq("user_id", user.id)
    .single();
  if (partnerError) {
    console.error("Error finding partner", user.id, partnerError);
    return res.status(500).json({ error: partnerError });
  }
  if (partner) {
    console.error("User is already a partner", user.id);
    return res.status(400).json({ error: "User is already a partner" });
  }
  const { error: insertError } = await supabase.client
    .from("partners")
    .insert([{ user_id: user.id, role }])
    .single();
  if (insertError) {
    console.error("Error inserting partner", user.id, insertError);
    return res.status(500).json({ error: insertError });
  }
  return res.status(200).json({ message: "User invited to be a partner" });
}
