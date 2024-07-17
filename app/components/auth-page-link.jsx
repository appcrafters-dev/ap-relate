import Link from "next/link";

export default function AuthPageLink({ text, url, arrow = null }) {
  return (
    <div className="block text-center">
      <Link
        href={url}
        className="block text-center text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        {arrow == "left" && <>&larr;</>} {text}{" "}
        {arrow == "right" && <>&rarr;</>}
      </Link>
    </div>
  );
}
