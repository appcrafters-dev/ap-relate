import { classNames } from "lib/utils";

export default function Spinner({ small = false, extraSmall = false }) {
  return (
    <>
      <svg
        className={classNames(
          "spinner",
          extraSmall ? "h-4 w-4" : small ? "h-5 w-5" : "h-[1.5rem] w-[1.5rem]"
        )}
        viewBox="0 0 50 50"
        fill="currentColor"
      >
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        ></circle>
      </svg>
    </>
  );
}
