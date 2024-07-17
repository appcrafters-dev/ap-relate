"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
// import { ViewportContextProvider } from "@context/view-port";

export default function Providers({ children }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  //   if (typeof window !== "undefined") {
  //     const url = new URL(window.location.href);
  //     const hashParams = new URLSearchParams(url.hash.slice(1));
  //     const errorDescription = hashParams.get("error_description");
  //     if (errorDescription) {
  //       window.location.href = `/login?error=${errorDescription}`;
  //     }
  //   }

  return (
    // <ViewportContextProvider>
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
    // </ViewportContextProvider>
  );
}
