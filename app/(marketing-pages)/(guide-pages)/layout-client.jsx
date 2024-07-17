"use client";

import { usePathname } from "next/navigation";
import { GuideNavigation } from "./components/navigation";
import FullWidthPromo from "../components/full-width-promo";

function Hero() {
  return (
    <FullWidthPromo title="The TFM Guide" subtitle="Learn how to use TFM" />
  );
}

export default function GuideLayout({ children, articles, categories }) {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/guide" && <Hero />}
      <div className="container relative mx-auto flex w-full flex-auto justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden border-r lg:relative lg:block lg:flex-none">
          <div className="sticky top-[4.75rem] mt-12 h-[calc(100vh-4.75rem)] w-64 overflow-y-auto overflow-x-hidden py-16 pl-0.5 pr-8 xl:w-72 xl:pr-16">
            <GuideNavigation {...{ articles, categories }} />
          </div>
        </div>
        <div className="flex w-full flex-auto justify-between pt-20">
          {children}
        </div>
      </div>
    </>
  );
}
