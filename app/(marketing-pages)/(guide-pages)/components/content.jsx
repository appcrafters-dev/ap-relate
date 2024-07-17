"use client";
import { BorderlessButton } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import { LinkIcon } from "@heroicons/react/20/solid";
import parse, { domToReact } from "html-react-parser";
import { classNames } from "lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createElement, useEffect, useState } from "react";

export default function Content({ htmlContent, subheading, heading }) {
  const pathname = usePathname();
  const [toc, setToc] = useState([]);
  const [currentSection, setCurrentSection] = useState(toc[0]?.slug);
  const [parsedContent, setParsedContent] = useState(null);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  useEffect(() => {
    const headings = [];
    const options = {
      replace: (domNode) => {
        if (
          !domNode.attribs ||
          !domNode.children ||
          !["h1", "h2", "h3", "h4", "h5", "h6"].includes(domNode.name)
        ) {
          return;
        }

        const text = domNode.children[0].data;
        const slug = getSlug(text);
        headings.push({ level: domNode.name, text, slug });

        const childElements = domToReact(domNode.children, options);
        return createElement(
          domNode.name,
          { id: slug },
          Array.isArray(childElements) && childElements.length === 1
            ? childElements[0]
            : childElements
        );
      },
    };

    // Ensure htmlContent is a string
    if (typeof htmlContent !== "string") {
      console.error("htmlContent must be a string", { htmlContent });
      return;
    }

    const parsed = parse(htmlContent, options);
    setParsedContent(parsed);
    setToc(headings);
    setCurrentSection(headings[0]?.slug);

    const onScroll = () => {
      let current = headings[0]?.slug;
      for (let heading of headings) {
        const element = document.getElementById(heading.slug);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < 200) current = heading.slug;
      }
      setCurrentSection(current);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [htmlContent]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2500);
    });
  };

  const isActive = (slug) => slug === currentSection;

  return (
    <div className="flex w-full space-x-16">
      <div className="flex flex-grow flex-col">
        {subheading && (
          <p className="mb-2 font-accent text-base tracking-wide text-tfm-secondary">
            {subheading}
          </p>
        )}
        <div className="relative inline-flex items-center justify-between gap-4">
          <h1 className="font-brand text-4xl sm:text-6xl">{heading}</h1>
          <BorderlessButton
            Icon={LinkIcon}
            onClick={handleCopyLink}
            small
            srOnly="Copy link to article"
          />
          {/* Feedback message */}
          {showCopyFeedback && (
            <div className="absolute right-0 top-12 z-50 mt-2 rounded shadow-md">
              <ErrorBox success msg="Link copied to clipboard!" />
            </div>
          )}
        </div>
        <article className="prose mt-8 w-full max-w-none border-t pt-8 prose-headings:scroll-mt-28">
          {parsedContent}
        </article>
      </div>
      {toc.filter(
        // make sure the headings are not empty
        ({ text }) => text && text.length > 0
      ).length > 0 && (
        <div className="hidden pb-8 2xl:sticky 2xl:top-[8rem] 2xl:block 2xl:h-[calc(100vh-8rem)] 2xl:flex-none 2xl:overflow-y-auto">
          <h2 className="font-accent text-sm tracking-wide text-tfm-secondary">
            On this page
          </h2>
          <nav aria-labelledby="on-this-page-title" className="w-56">
            <ol role="list" className="mt-4 space-y-3 text-sm">
              {toc.map((heading, index) => (
                <li key={index}>
                  <Link
                    href={`${pathname}#${heading.slug}`}
                    className={classNames(
                      isActive(heading.slug)
                        ? "font-medium text-tfm-primary-900"
                        : "text-tfm-primary hover:text-tfm-primary-900",
                      "transition-colors duration-200"
                    )}
                  >
                    {heading.text}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      )}
    </div>
  );
}

function getSlug(text) {
  return (text || "").toLowerCase().replace(/\s+/g, "-");
}
