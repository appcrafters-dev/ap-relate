import { ErrorLayout } from "@/components/layout";

export const dynamic = "force-dynamic";

export default function AuthPagesLayout({ children }) {
  return <ErrorLayout>{children}</ErrorLayout>;
}
