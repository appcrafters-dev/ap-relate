"use client";

import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { BorderlessButton, Button } from "@/components/ui/buttons";
import {
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { TfmFormSelect, TfmInput } from "@/components/ui/forms";
import { useRouter } from "next/navigation";

export default function DocFilters({ columns, route, searchParams = {} }) {
  const router = useRouter();
  const initialFilters = Object.entries(searchParams).reduce(
    (acc, [key, value]) => {
      const [filterKey, operator] = key.split(".");
      const columnExists = columns.find(
        (col) => col.filterConfig?.key === filterKey
      );
      // If the key is 'sort_asc' or 'sort_desc', leave it untouched
      if (filterKey === "sort_asc" || filterKey === "sort_desc") {
        acc[filterKey] = value;
      } else {
        if (columnExists) {
          // If no operator is set after the period, then the default should be 'eq'
          const finalOperator = operator || "eq";
          acc[filterKey] = { operator: finalOperator, value };
        }
      }
      return acc;
    },
    {}
  );

  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (filterKey, operator, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: { operator, value },
    }));
  };

  const unusedColumn = columns.find(
    (col) => col.filterConfig?.key && !filters[col.filterConfig?.key]
  );

  const addFilter = () => {
    if (!unusedColumn) return;
    const newFilterKey = unusedColumn.filterConfig?.key;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [newFilterKey]: { operator: "eq", value: "" },
    }));
  };

  const filterOptions = [
    { label: "Equals", value: "eq" },
    { label: "Contains", value: "like" },
    { label: "Greater than", value: "gt" },
    { label: "Less than", value: "lt" },
  ];

  const applyFilters = (e) => {
    if (e) e.preventDefault();

    const newParams = new URLSearchParams();

    for (const [filterKey, filter] of Object.entries(filters)) {
      if (filter.value !== "") {
        // If the key is 'sort_asc' or 'sort_desc', append it as is
        if (filterKey === "sort_asc" || filterKey === "sort_desc") {
          newParams.append(filterKey, filter);
        } else {
          newParams.append(`${filterKey}.${filter.operator}`, filter.value);
        }
      }
    }

    router.replace(`${route}?${newParams.toString()}`);
  };

  return (
    <Disclosure>
      {({ open }) => (
        <div className="rounded-tr">
          <Disclosure.Button
            as={Button}
            extraSmall
            primary
            Icon={AdjustmentsHorizontalIcon}
          >
            <span className="lg:whitespace-nowrap">
              {open ? "Hide filters" : "View filters"}
            </span>
          </Disclosure.Button>

          <Disclosure.Panel
            as="form"
            onSubmit={applyFilters}
            className="absolute right-0 z-10 mr-2 mt-1 flex w-full max-w-md flex-col rounded border bg-gray-50 shadow-xl md:max-w-lg"
          >
            <div className="flex w-full flex-col items-center justify-between space-y-3 p-3 font-normal">
              {/* <pre>{JSON.stringify(filters, null, 2)}</pre> */}
              {filters && Object.keys(filters).length === 0 && (
                <p className="p-3 font-subheading text-sm text-gray-600">
                  No filters applied to this view, add a column below to filter
                  the data.
                </p>
              )}
              {Object.keys(filters).map((filterKey) => {
                const column = columns.find(
                  (col) => col.filterConfig?.key === filterKey
                );
                if (!column) return null;
                return (
                  <div
                    key={filterKey}
                    className="inline-flex w-full items-center justify-between space-x-2 font-normal"
                  >
                    <TfmFormSelect
                      id={`filter-columns-${filterKey}`}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        const oldValue = filters[filterKey];
                        setFilters((prevFilters) => {
                          const { [filterKey]: old, ...others } = prevFilters;
                          return { ...others, [newKey]: oldValue };
                        });
                      }}
                      value={filterKey}
                      extraSmall
                      required
                    >
                      <option value="">Select column</option>
                      {columns
                        .filter((col) => col.filterConfig?.key)
                        .map((column) => (
                          <option
                            key={column.filterConfig?.key}
                            value={column.filterConfig?.key}
                          >
                            {column.displayName}
                          </option>
                        ))}
                    </TfmFormSelect>
                    <TfmFormSelect
                      id={`filter-operators-${filterKey}`}
                      onChange={(e) =>
                        handleFilterChange(
                          column.filterConfig?.key,
                          e.target.value,
                          filters[column.filterConfig?.key]?.value
                        )
                      }
                      value={filters[column.filterConfig?.key]?.operator}
                      extraSmall
                      required
                    >
                      {filterOptions
                        .filter(
                          // only show the "like" operator if the column is untyped
                          (option) =>
                            option.value !== "like" ||
                            column.filterConfig?.unTyped
                        )
                        .map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </TfmFormSelect>
                    <div className="flex-grow">
                      {filters[column.filterConfig?.key]?.operator === "like" &&
                      column.filterConfig?.unTyped ? (
                        <TfmInput
                          id={`filter-value-${filterKey}`}
                          onChange={(e) =>
                            handleFilterChange(
                              column.filterConfig?.key,
                              filters[column.filterConfig?.key]?.operator,
                              e.target.value
                            )
                          }
                          value={filters[column.filterConfig?.key]?.value || ""}
                          extraSmall
                          required
                        />
                      ) : (
                        <TfmFormSelect
                          id={`filter-value-${filterKey}`}
                          onChange={(e) =>
                            handleFilterChange(
                              column.filterConfig?.key,
                              filters[column.filterConfig?.key]?.operator,
                              e.target.value
                            )
                          }
                          value={filters[column.filterConfig?.key]?.value || ""}
                          extraSmall
                          required
                        >
                          <option value=""></option>
                          {column.options
                            .sort((a, b) => a.label.localeCompare(b.label))
                            .map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          {/* {data.map((doc, idx) => (
                    <option key={idx} value={JSON.stringify(doc[column.name])}>
                      {JSON.stringify(doc[column.name])}
                    </option>
                  ))} */}
                        </TfmFormSelect>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <BorderlessButton
                        Icon={XMarkIcon}
                        onClick={() => {
                          setFilters((prevFilters) => {
                            const { [filterKey]: old, ...others } = prevFilters;
                            return { ...others };
                          });
                        }}
                        srOnly="Remove filter"
                        tabIndex={-1}
                        extraSmall
                      />
                    </div>
                  </div>
                );
              })}
              {unusedColumn && (
                <BorderlessButton
                  onClick={addFilter}
                  Icon={PlusIcon}
                  extraSmall
                >
                  Add filter
                </BorderlessButton>
              )}
            </div>
            {filters && Object.keys(filters).length > 0 && (
              <div className="flex w-full justify-end space-x-2 border-t bg-gray-50 p-3">
                <Button
                  extraSmall
                  onClick={() => {
                    setFilters({});
                    router.push(route);
                  }}
                  Icon={XMarkIcon}
                  tabIndex={-1}
                >
                  Clear all
                </Button>
                <Button type="submit" primary extraSmall Icon={FunnelIcon}>
                  Apply
                </Button>
              </div>
            )}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
