import { Analytics } from "@vercel/analytics/react";
import Providers from "./components/providers";
import "../styles/main.css";

import localFont from "next/font/local";
import { classNames } from "lib/utils";

export const metadata = {
  title: "Total Family Management",
};

export const dynamic = "force-dynamic";

const appleGaramond = localFont({
  src: [
    {
      path: "./fonts/AppleGaramond-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/AppleGaramond-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/AppleGaramond.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/AppleGaramond-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/AppleGaramond-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/AppleGaramond-Italic.ttf",
      style: "italic",
    },
  ],
  variable: "--font-garamond",
});

const aileron = localFont({
  src: [
    {
      path: "./fonts/Aileron-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Aileron-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/Aileron-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Aileron-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Aileron-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/Aileron-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Aileron-SemiBoldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/Aileron-Italic.otf",
      style: "italic",
    },
  ],
  variable: "--font-aileron",
});

const flood = localFont({
  src: "./fonts/Flood.otf",
  weight: "400",
  style: "normal",
  variable: "--font-flood",
});

function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={classNames(
        "h-full min-h-screen overflow-x-hidden bg-tfm-bg text-gray-800 antialiased print:bg-white",
        appleGaramond.variable,
        flood.variable,
        aileron.variable
      )}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-full">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}

export default RootLayout;
