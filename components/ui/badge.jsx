import { classNames } from "lib/utils";

export default function Badge({ children, color = "gray" }) {
  return (
    <span
      className={classNames(
        "inline-flex rounded px-2 py-1 font-subheading text-xs font-semibold uppercase",
        color === "green"
          ? "bg-green-100 text-green-800"
          : color === "red"
          ? "bg-red-100 text-red-800"
          : color === "yellow"
          ? "bg-yellow-100 text-yellow-800"
          : color === "blue"
          ? "bg-blue-100 text-blue-800"
          : "bg-gray-100 text-gray-800"
      )}
    >
      {children}
    </span>
  );
}
