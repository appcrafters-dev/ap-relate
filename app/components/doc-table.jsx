import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { classNames } from "lib/utils";
import Link from "next/link";
import DocFilters from "./doc-table-filters";
import { LinkSignpost } from "@/components/ui/buttons";

export default async function DocTable({
  heading = null,
  subheading = null,
  docList,
  columns,
  mobileColumn,
  rowLink = null,
  rowLinkText = "View →",
  route,
  searchParams,
}) {
  const sortColumn = searchParams?.sort_asc || searchParams?.sort_desc;
  const sortOrder = searchParams?.sort_asc ? "asc" : "desc";

  const hasSearchParamKey = (column) => {
    const key = column.filterConfig?.key;
    if (!key) return false;
    const keyInSearchParams = Object.keys(searchParams).find(
      (k) => k.split(".")[0] === key
    );
    return keyInSearchParams;
  };

  const getSortLink = (column) => {
    const newSearchParams = { ...searchParams };
    if (newSearchParams.sort_asc) delete newSearchParams.sort_asc;
    if (newSearchParams.sort_desc) delete newSearchParams.sort_desc;

    if (sortColumn === column) {
      newSearchParams[sortOrder === "asc" ? "sort_desc" : "sort_asc"] = column;
    } else {
      newSearchParams.sort_asc = column;
    }

    return `${route}?${new URLSearchParams(newSearchParams)}`;
  };

  const getOptions = async (filterKey) => {
    const colMapper = columns.find(
      (col) => col.filterConfig?.key === filterKey
    );
    if (!colMapper) return [];
    const values = docList.map((doc) => doc[colMapper.name]);
    const uniqValues = Array.from(new Set(values));

    const options = await Promise.all(
      uniqValues.map(async (value) => {
        const formattedValue =
          typeof colMapper.filterConfig?.valueFormat === "function"
            ? await colMapper.filterConfig.valueFormat(value, colMapper, values)
            : value;
        const formattedLabel =
          typeof colMapper.format === "function"
            ? await colMapper.format(value, colMapper, values)
            : value;
        return {
          value: formattedValue,
          label:
            typeof formattedLabel === "string"
              ? formattedLabel
              : formattedValue,
        };
      })
    );

    // remove any options that are null or undefined, or duplicate values
    const filteredOptions = Array.from(
      new Set(options.map((option) => JSON.stringify(option)))
    )
      .map((option) => JSON.parse(option))
      .filter((option) => option.value);

    return filteredOptions;
  };

  const columnsForFilters = await Promise.all(
    columns
      .filter((col) => col.filterConfig?.key)
      .map(async (col) => ({
        ...col,
        options: await getOptions(col.filterConfig.key),
      }))
  );

  // return <pre>{JSON.stringify(columnsForFilters, null, 2)}</pre>;

  return (
    <div className="-mx-4 max-w-7xl space-y-8 sm:mx-auto">
      {heading && (
        <h1 className="px-4 font-brand text-4xl text-tfm-primary lg:px-0">
          {heading}
        </h1>
      )}
      {subheading && <p className="px-4 text-gray-500 lg:px-0">{subheading}</p>}
      <div className="flex w-full border bg-white shadow sm:rounded">
        <table className="w-full">
          <thead className="sticky top-12 z-10 w-full rounded-t md:top-0">
            <tr className="w-full border-b">
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={
                    "hidden bg-gray-100 p-2 px-4 text-left font-subheading text-sm font-semibold uppercase text-tfm-primary lg:table-cell" +
                    (index === 0 ? " rounded-tl" : "") +
                    (index === columns.length - 1 ? " rounded-tr" : "")
                  }
                >
                  {column.filterConfig?.key ? (
                    <Link
                      href={getSortLink(column.filterConfig?.key)}
                      className="group inline-flex items-center justify-center"
                      title={`Sort by ${column.displayName}`}
                    >
                      {hasSearchParamKey(column) && (
                        <AdjustmentsHorizontalIcon
                          className="mr-1.5 h-3 w-3 text-gray-600"
                          aria-hidden="true"
                        />
                      )}
                      {column.displayName}
                      <ChevronDownIcon
                        className={classNames(
                          "ml-1.5 h-5 w-5 flex-none rounded text-gray-600 transition group-hover:text-gray-600",
                          sortColumn === column.filterConfig?.key
                            ? "text-gray-600"
                            : "invisible group-hover:visible",
                          sortColumn === column.filterConfig?.key &&
                            sortOrder === "desc"
                            ? "group-hover:rotate-180"
                            : "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    column.displayName
                  )}
                </th>
              ))}
              <th
                scope="col"
                className={
                  "bg-gray-100 p-1 text-center font-subheading text-sm font-semibold uppercase text-gray-900 lg:hidden"
                }
              >
                {mobileColumn.displayName}
              </th>
              <th
                scope="col"
                className="flex justify-end bg-gray-100 p-3 md:rounded-tr"
              >
                <DocFilters
                  columns={columnsForFilters}
                  route={route}
                  searchParams={searchParams}
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {docList.map((doc, docIdx) => (
              <tr key={docIdx}>
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className={"hidden p-4 text-sm lg:table-cell"}
                  >
                    {column.format
                      ? column.format(doc[column.name], column.name, doc)
                      : doc[column.name]}
                  </td>
                ))}
                <td className="p-4 text-sm lg:hidden">
                  {mobileColumn.format(doc)}
                </td>

                {rowLink && (
                  <td className={"p-2 pr-3 text-right text-sm font-semibold"}>
                    <LinkSignpost href={rowLink(doc)} small>
                      {rowLinkText ?? "View →"}
                    </LinkSignpost>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          {docList.length === 0 && (
            <tfoot>
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="table-cell px-8 py-20 text-center"
                >
                  <h2 className="font-subheading font-semibold text-tfm-primary">
                    No results found
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {"We can't find anything at the moment."}
                    {Object.keys(searchParams).length > 0 &&
                      " Try adjusting your filters or search terms."}
                  </p>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {docList.length > 0 && (
        <p className="text-center font-subheading text-sm font-semibold uppercase text-gray-500">
          Showing {docList.length.toLocaleString()} results
        </p>
      )}
    </div>
  );
}
