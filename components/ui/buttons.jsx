import Link from "next/link";

export function LinkButton(props) {
  return (
    <Link
      href={props.href}
      passHref
      className={classNames(
        props.primary
          ? "border-transparent bg-tfm-primary text-white hover:bg-tfm-primary-900"
          : "border-gray-200 bg-white text-tfm-primary hover:bg-gray-50",
        "inline-flex items-center justify-center rounded border font-semibold transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-700",
        props.fullWidth === true
          ? "w-full"
          : "w-full sm:w-auto sm:flex-shrink-0",
        props.extraSmall
          ? "px-1 py-0.5 text-xs sm:px-2 sm:py-1.5"
          : props.small
          ? "px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm"
          : "px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base"
      )}
      tabIndex={props.tabIndex}
      target={props.newTab ? "_blank" : null}
    >
      {props.Icon && !props.loading && (
        <props.Icon
          className={
            props.extraSmall
              ? "-ml-.5 mr-1 h-3 w-3"
              : props.small
              ? "-ml-.5 mr-1 h-4 w-4"
              : "-ml-.5 mr-2 h-5 w-5"
          }
          aria-hidden="true"
        />
      )}
      {props.children}
    </Link>
  );
}

export function Button(props) {
  return (
    <button
      type={props.type ? props.type : "button"}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
      className={classNames(
        props.primary
          ? "border-transparent bg-tfm-primary text-white hover:bg-tfm-primary-900"
          : props.danger
          ? "border-gray-200 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-gray-200 bg-white text-tfm-primary hover:bg-gray-50",
        "inline-flex items-center justify-center rounded border font-semibold transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-700",
        props.fullWidth === true
          ? "w-full"
          : "w-full sm:w-auto sm:flex-shrink-0",
        props.extraSmall
          ? "px-1 py-0.5 text-xs sm:px-2 sm:py-1.5"
          : props.small
          ? "px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm"
          : "px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base"
      )}
      tabIndex={props.tabIndex}
    >
      {props.loading ? (
        <Spinner extraSmall={props.extraSmall} small={props.small} />
      ) : null}
      {props.Icon && !props.loading && (
        <props.Icon
          className={
            props.extraSmall
              ? "-ml-.5 mr-1 h-3 w-3"
              : props.small
              ? "-ml-.5 mr-1 h-4 w-4"
              : "-ml-.5 mr-2 h-5 w-5"
          }
          aria-hidden="true"
        />
      )}
      {props.loading ? null : props.children}
    </button>
  );
}

export function BorderlessButton(props) {
  return (
    <button
      type={props.type ? props.type : "button"}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
      className={classNames(
        "flex items-center justify-center rounded text-sm font-semibold text-tfm-primary transition-all duration-500 ease-in-out hover:text-tfm-primary-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-700",
        props.extraSmall
          ? "px-1 py-0.5 text-xs sm:py-1"
          : props.small
          ? "px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm"
          : "px-3 py-2 text-sm sm:px-4 sm:py-2.5 sm:text-base"
      )}
      title={props.srOnly}
      aria-label={props.srOnly}
      tabIndex={props.tabIndex}
    >
      {props.loading ? <Spinner /> : null}
      {props.Icon && !props.loading && (
        <props.Icon
          className={classNames(
            props.extraSmall ? "h-3 w-3" : props.small ? "h-4 w-4" : "h-5 w-5",
            props.srOnly ? null : "-ml-.5 mr-2"
          )}
          aria-hidden="true"
        />
      )}
      {props.loading ? null : props.srOnly ? (
        <span className="sr-only">{props.srOnly}</span>
      ) : (
        props.children
      )}
    </button>
  );
}

export function LinkSignpost(props) {
  return (
    <Link
      href={props.href}
      passHref
      className={
        "text-sm font-semibold text-tfm-primary transition-all duration-500 ease-in-out hover:text-tfm-primary-400" +
        props.small
          ? ""
          : "sm:text-base"
      }
    >
      {props.children}
    </Link>
  );
}

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "lib/utils";
import Spinner from "./spinner";

export default function UpDownButtons({
  upOnChange,
  downOnChange,
  upDisabled,
  downDisabled,
}) {
  return (
    <div className="isolate grid w-[2.5rem] rounded shadow-sm">
      <button
        type="button"
        className="relative inline-flex items-center justify-center rounded-t border border-gray-200 bg-white p-1 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-tfm-secondary focus:outline-none focus:ring-1 focus:ring-tfm-secondary disabled:hover:bg-white"
        onClick={upOnChange}
        disabled={upDisabled}
      >
        <span className="sr-only">Move Up</span>
        <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="relative -mt-px inline-flex items-center justify-center rounded-b border border-gray-200 bg-white p-1 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-tfm-secondary focus:outline-none focus:ring-1 focus:ring-tfm-secondary disabled:hover:bg-white"
        onClick={downOnChange}
        disabled={downDisabled}
      >
        <span className="sr-only">Move Down</span>
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
