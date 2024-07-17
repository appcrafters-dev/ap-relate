import { classNames } from "lib/utils";

export function TableHeaderCol({
  title,
  mobileHide = false,
  textAlign = "left",
}) {
  return (
    <th
      scope="col"
      className={classNames(
        "py-3.5 pl-4 pr-3 text-left font-brand text-sm font-semibold uppercase tracking-wider text-gray-900 sm:pl-6",
        mobileHide ? "hidden md:table-cell" : "",
        textAlign === "right" ? "text-right" : "",
        textAlign === "center" ? "text-center" : "",
        textAlign === "left" ? "text-left" : ""
      )}
    >
      {title}
    </th>
  );
}

export function TableRowCol({
  children,
  mobileHide = false,
  textAlign = "left",
}) {
  return (
    <td
      className={classNames(
        "w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6",
        mobileHide ? "hidden md:table-cell" : "",
        textAlign === "right" ? "text-right" : "",
        textAlign === "center" ? "text-center" : "",
        textAlign === "left" ? "text-left" : ""
      )}
    >
      {children}
    </td>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="min-w-full bg-gray-50">
      <tr>{children}</tr>
    </thead>
  );
}

export function Table({ headerCols = [], children }) {
  return (
    <div className="overflow-x-auto rounded shadow ring-1 ring-black ring-opacity-5">
      <table className="min-w-full divide-y divide-gray-300 rounded bg-white">
        <TableHeader>
          {headerCols.map((col) => (
            <TableHeaderCol
              key={col.title}
              title={col.title}
              textAlign={col.textAlign}
            >
              {col.title}
            </TableHeaderCol>
          ))}
        </TableHeader>
        <tbody className="min-w-full divide-y divide-gray-200 bg-white">
          {children}
        </tbody>
      </table>
    </div>
  );
}
