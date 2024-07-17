"use client";

import { RadioGroup } from "@headlessui/react";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { classNames } from "lib/utils";
import { createRef, useEffect, useState } from "react";
import Spinner from "./spinner";

export function TfmInput({
  id,
  label = null,
  type = "text",
  value = undefined,
  onChange = null,
  helpText = null,
  required = false,
  disabled = false,
  min = null,
  max = null,
  step = null,
  topHelpText = null,
  placeholder = null,
  autoComplete = null,
  small = false,
  extraSmall = false,
  defaultValue = null,
}) {
  return (
    <div>
      {label && (
        <div className="mb-2 inline-flex w-full items-center justify-between">
          <label
            htmlFor={id}
            className="block font-subheading text-sm font-semibold uppercase tracking-wider text-tfm-primary-900"
          >
            {label}
          </label>
          {topHelpText}
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        autoComplete={autoComplete}
        className={classNames(
          "block w-full appearance-none rounded border border-gray-200 placeholder-gray-400 shadow-sm focus:border-tfm-secondary focus:outline-none focus:ring-tfm-secondary",
          disabled ? "bg-gray-100" : "bg-white",
          extraSmall
            ? "p-2 pr-5 text-xs"
            : small
            ? "p-2 pr-4 text-sm"
            : "p-3 pr-4"
        )}
      />
      {helpText && (
        <p className="mt-2 text-xs tracking-tight text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

export function TfmFormSelect({
  id,
  label = null,
  value = undefined,
  onChange = null,
  helpText = null,
  required = false,
  disabled = false,
  topHelpText = null,
  defaultValue = null,
  children,
  small = false,
  extraSmall = false,
}) {
  return (
    <div>
      {label && (
        <div className="mb-2 inline-flex w-full items-center justify-between">
          <label
            htmlFor={id}
            className="block font-subheading text-sm font-semibold uppercase tracking-wider text-tfm-primary-900"
          >
            {label}
          </label>
          {topHelpText}
        </div>
      )}
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        defaultValue={defaultValue}
        className={classNames(
          "block w-full appearance-none rounded border border-gray-200 placeholder-gray-400 shadow-sm focus:border-tfm-secondary focus:outline-none focus:ring-tfm-secondary",
          disabled ? "bg-gray-100" : "bg-white",
          extraSmall
            ? "p-2 pr-5 text-xs"
            : small
            ? "p-2 pr-4 text-sm"
            : "p-3 pr-4"
        )}
      >
        {children}
      </select>
      {helpText && (
        <p className="mt-2 text-xs tracking-tight text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

export function TfmFormColumns({ children }) {
  return (
    <div className="space-y-4 md:grid md:grid-cols-2 md:gap-x-4 md:space-y-0">
      {children}
    </div>
  );
}

export function TfmFormHeading({ children }) {
  return <h2 className="font-brand text-3xl text-gray-900">{children}</h2>;
}

export function TfmCheckbox({
  id,
  label = null,
  checked = undefined,
  onChange = undefined,
  required = false,
  disabled = false,
  children = null,
}) {
  return (
    <div className="flex items-start">
      <div className="flex h-5 items-center">
        <input
          type="checkbox"
          id={id}
          name={id}
          checked={checked}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-300 text-tfm-primary focus:ring-tfm-secondary"
        />
      </div>
      <div className="ml-2 block text-sm">
        <label htmlFor={id} className="font-subheading text-sm text-gray-500">
          {children || label}
        </label>
      </div>
    </div>
  );
}

export function TfmTextArea({
  id,
  label = null,
  value = undefined,
  onChange = null,
  helpText = null,
  required = false,
  disabled = false,
  rows = 3,
  defaultValue = null,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-subheading text-sm font-semibold uppercase tracking-wider text-tfm-primary-900"
      >
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        defaultValue={defaultValue}
        rows={rows}
        className="mt-2 block w-full appearance-none rounded border border-gray-200 p-3 placeholder-gray-400 shadow-sm focus:border-tfm-secondary focus:outline-none focus:ring-tfm-secondary"
      />
      {helpText && (
        <p className="mt-2 text-xs tracking-tight text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

export function TfmAvatarUploader({
  src = null,
  setSrc,
  fileName,
  label = "Upload a photo",
  helpText = null,
}) {
  const supabase = getSupabaseClientComponentClient();
  const [preview, setPreview] = useState(src);
  const [uploadError, setUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e) => {
    setUploading(true);

    const file = e.target.files[0];

    setPreview(URL.createObjectURL(file));

    const filePath = `${fileName}.${file.type.replace("image/", "")}`;
    const bucket = supabase.client.storage.from("images");

    const { data, error } = await bucket.upload(filePath, file, {
      upsert: true,
    });

    if (error) {
      console.log(error);
      setUploadError(error);
      setUploading(false);
      return;
    }

    if (data) {
      const {
        data: { publicUrl },
      } = bucket.getPublicUrl(filePath);
      console.log("URL", publicUrl);
      setSrc(publicUrl);

      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <p className="mb-2 block font-subheading text-sm font-semibold uppercase tracking-wider text-tfm-primary-900">
        {label}
      </p>
      <div className="relative h-36 w-48 overflow-hidden rounded shadow-sm">
        {preview ? (
          <img
            src={preview}
            className="relative h-full w-full rounded object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center rounded border border-gray-200 bg-gray-50">
            <ArrowUpOnSquareIcon className="h-10 w-10 text-gray-300" />
          </div>
        )}

        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-tfm-primary-900 bg-opacity-60 text-white">
            <Spinner />
            <span className="sr-only">Uploading photo...</span>
          </div>
        ) : (
          <label
            htmlFor="avatar"
            className="absolute inset-0 flex h-full w-full items-center justify-center bg-tfm-primary-900 bg-opacity-60 text-sm font-semibold text-white opacity-0 transition-opacity duration-100 ease-in-out focus-within:opacity-100 hover:opacity-100"
          >
            <span>{preview ? "Change" : "Upload"}</span>
            <span className="sr-only"> photo</span>
            <input
              type="file"
              id="avatar"
              className="absolute inset-0 h-36 w-48 cursor-pointer rounded border-gray-200 opacity-0"
              accept="image/*"
              multiple={false}
              onChange={handleChange}
            />
          </label>
        )}
      </div>
      {helpText || uploadError ? (
        <p className="mt-2 text-xs tracking-tight text-gray-500">
          {uploadError ? (
            <span className="text-red-500">{uploadError.message}</span>
          ) : (
            helpText
          )}
        </p>
      ) : null}
    </div>
  );
}

import TipTapEditor from "./text-editor";

export function TfmTextEditor(props) {
  return <TipTapEditor {...props} />;
}

import {
  CheckIcon,
  ChevronUpDownIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";

export default function TfmCombobox({
  selected,
  setSelected,
  options,
  label,
  hideLabel = false,
  disabled = false,
}) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option
            .replace(/\//g, " - ")
            .replace(/_/g, " ")
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={selected}
      onChange={setSelected}
      className="relative max-w-[14rem]"
      disabled={disabled}
    >
      <Combobox.Label
        className={
          hideLabel
            ? "sr-only"
            : "mb-2 block font-subheading text-sm font-semibold uppercase tracking-wider text-tfm-primary-900"
        }
      >
        {label}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-tfm-secondary-500 focus:outline-none focus:ring-1 focus:ring-tfm-secondary-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option) =>
            option.replace(/\//g, " - ").replace(/_/g, " ")
          }
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r px-2 focus:outline-none">
          {disabled ? null : (
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          )}
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option, idx) => (
              <Combobox.Option
                key={idx}
                value={option}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-tfm-secondary text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex">
                      <span
                        className={classNames(
                          "truncate",
                          selected && "font-semibold"
                        )}
                      >
                        {option.replace(/\//g, " - ").replace(/_/g, " ")}
                      </span>
                      {/* <span
                        className={classNames(
                          "ml-2 truncate text-gray-500",
                          active ? "text-indigo-200" : "text-gray-500"
                        )}
                      >
                        {person.username}
                      </span> */}
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-tfm-primary"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

export function TfmStarRating({
  id,
  label = null,
  value = undefined,
  onChange = null,
  required = false,
  disabled = false,
}) {
  const ratingValues = [
    { name: "1 star", helpText: "It wasn't for me.", value: 0.2 },
    { name: "2 stars", helpText: "It could have been better.", value: 0.4 },
    { name: "3 stars", helpText: "It was okay.", value: 0.6 },
    { name: "4 stars", helpText: "It was good!", value: 0.8 },
    { name: "5 stars", helpText: "It was great!", value: 1 },
  ];

  return (
    <div>
      <RadioGroup
        {...{
          id,
          label,
          value,
          onChange,
          required,
          disabled,
        }}
      >
        <RadioGroup.Label className="mb-2 block font-subheading text-sm font-semibold uppercase tracking-wider text-tfm-primary-900">
          {label}
        </RadioGroup.Label>
        <div className="inline-flex flex-row-reverse gap-1">
          {ratingValues.reverse().map((rating) => (
            <RadioGroup.Option
              key={rating.value}
              value={rating.value}
              className={({ active, checked }) =>
                classNames(
                  "cursor-pointer text-gray-200 transition-colors",
                  "flex-1 hover:text-yellow-400",
                  "peer",
                  "peer-hover:text-yellow-400",
                  active ? "text-yellow-500" : "",
                  checked ? "text-yellow-500" : "",
                  value >= rating.value ? "text-yellow-500" : ""
                )
              }
            >
              <span className="sr-only">{rating.name}</span>
              <StarIcon className="h-6 w-6" aria-hidden="true" />
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      {value > 0 && (
        <p className="mt-2 text-xs tracking-tight text-gray-500">
          {ratingValues.find((rating) => rating.value === value).helpText}
        </p>
      )}
    </div>
  );
}

export function OTPInput({
  label = "Enter your one-time passcode:",
  onChange = null,
  onBlur = null,
  helpText = null,
  required = true,
  disabled = false,
  onVerify = null,
}) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpRefs = Array.from({ length: 6 }, () => createRef());

  // set focus to first input on mount
  useEffect(() => {
    otpRefs[0].current.focus();
  }, []);

  const handleChange = (index, e) => {
    if (e.target.value !== "") {
      if (index < otpRefs.length - 1) {
        otpRefs[index + 1].current.focus();
      } else {
        e.target.blur();
      }
    }
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (onChange) {
      onChange(newOtp.join(""));
    }

    if (newOtp.join("").length === 6 && onVerify) {
      onVerify(newOtp.join(""));
    }
  };

  const handleKeyPress = (e) => {
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedValue = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{1,6}$/.test(pastedValue)) {
      const newOtp = pastedValue.split("");
      setOtp(newOtp);
      otpRefs[5].current.focus();
      if (onChange) {
        onChange(newOtp.join(""));
      }
      if (newOtp.join("").length === 6 && onVerify) {
        onVerify(newOtp.join(""));
      }
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur(otp.join(""));
    }
    if (otp.join("").length === 6 && onVerify) {
      onVerify(otp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        otpRefs[index - 1].current.focus();
      }
    }
  };

  return (
    <div className="text-center">
      <label
        htmlFor={otpRefs[0]}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="my-2 inline-flex justify-between space-x-2">
        {otp.map((value, index) => (
          <input
            key={index}
            ref={otpRefs[index]}
            id={otpRefs[index]}
            type="tel"
            maxLength="1"
            value={value}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            onPaste={handlePaste}
            onBlur={handleBlur}
            required={required}
            disabled={disabled}
            className="w-12 appearance-none rounded border border-gray-200 bg-white px-3 py-2 text-center font-medium placeholder-gray-400 shadow-sm focus:border-tfm-secondary focus:ring-tfm-secondary"
          />
        ))}
      </div>
      {helpText && (
        <div className="mt-2 text-xs tracking-tight text-gray-600">
          {helpText}
        </div>
      )}
    </div>
  );
}
