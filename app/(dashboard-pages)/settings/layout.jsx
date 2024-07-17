import { getCurrentUser } from "lib/supabase/supbase.server";
import SettingsLayout from "./settings-layout";

export default async function Layout({ children }) {
  const user = await getCurrentUser();
  return <SettingsLayout user={user}>{children}</SettingsLayout>;
}
