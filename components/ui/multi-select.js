import { useState } from "react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { classNames } from "lib/utils";

export default function MultiSelect({
  options,
  label,
  id,
  descriptor = id,
  selectedValues,
  setSelectedValues,
}) {
  const [query, setQuery] = useState("");
  //   const [selectedValues, setSelectedValues] = useState([]);

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={selectedValues}
      onChange={setSelectedValues}
      multiple
    >
      <Combobox.Label className="block font-subheading text-sm font-semibold uppercase tracking-wider text-tfm-primary-900">
        {label}
      </Combobox.Label>
      {selectedValues.length > 0 && (
        <ul className="my-2 flex flex-wrap gap-2">
          {selectedValues.map((value) => (
            <li
              key={value}
              className="inline-flex rounded bg-gray-100 px-3 py-1 font-subheading text-sm font-semibold uppercase text-gray-800"
            >
              {value}
              <button
                type="button"
                className="ml-1.5"
                onClick={() => {
                  setSelectedValues((values) =>
                    values.filter((v) => v !== value)
                  );
                }}
              >
                <span className="sr-only">Remove {value}</span>
                <XMarkIcon
                  className="h-3 w-3 text-tfm-primary-500"
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative mt-1">
        <Combobox.Input
          //   className="w-full rounded-md border border-gray-200 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          className="mt-2 block w-full appearance-none rounded border border-gray-200 p-3 placeholder-gray-400 shadow-sm focus:border-tfm-secondary focus:outline-none focus:ring-tfm-secondary sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={"Select one or more " + descriptor + "..."}
          id={id}
          name={id}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredOptions.map((option, idx) => (
            <Combobox.Option
              key={idx}
              value={option}
              className={({ active }) =>
                classNames(
                  "relative cursor-default select-none py-2 pl-3 pr-9",
                  active ? "bg-tfm-primary text-white" : "text-gray-900"
                )
              }
            >
              {({ active, selected }) => (
                <>
                  <span
                    className={classNames(
                      "block truncate",
                      selected && "font-semibold"
                    )}
                  >
                    {option}
                  </span>

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
          {query.length > 0 && (
            <Combobox.Option
              value={query}
              className={({ active }) =>
                classNames(
                  "relative cursor-default select-none py-2 pl-3 pr-9",
                  active ? "bg-tfm-primary text-white" : "text-gray-900"
                )
              }
            >
              Create &quot;{query}&quot;
            </Combobox.Option>
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
