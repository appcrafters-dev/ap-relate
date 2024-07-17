"use client";

import { createElement, useEffect, useState } from "react";
import parse, { domToReact } from "html-react-parser";

export default function TableOfContents({ htmlContent }) {
  const [toc, setToc] = useState([]);

  useEffect(() => {
    const headings = [];
    const options = {
      replace: ({ attribs, children, name }) => {
        if (
          !attribs ||
          !children ||
          !["h1", "h2", "h3", "h4", "h5", "h6"].includes(name)
        ) {
          return;
        }

        const text = children[0].data;
        const slug = getSlug(text);
        headings.push({ level: name, text, slug });

        return createElement(name, { id: slug }, domToReact(children, options));
      },
    };

    parse(htmlContent, options);
    setToc(headings);
  }, [htmlContent]);

  if (!toc.length) return null;

  return (
    <div className="toc">
      <h2>On this page</h2>
      <ul>
        {toc.map((heading, index) => (
          <li key={index}>
            <a href={`#${heading.slug}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getSlug(text) {
  return text.toLowerCase().replace(/\s+/g, "-");
}
