import { Button } from "@/components/ui/buttons";

export default async function DocTableLoading({
  heading,
  subheading,
  columns = [],
}) {
  // create an array of 7 empty objects with columns as keys
  // this will be the rows of the table
  let docList = [];
  const keys = columns.map((column) => column.name);
  const numberOfEmptyDatas = 7;
  for (let i = 0; i < numberOfEmptyDatas; i++) {
    docList.push(keys.reduce((obj, key) => ({ ...obj, [key]: null }), {}));
  }

  return (
    <div className="-mx-4 max-w-7xl space-y-8 sm:mx-auto">
      <h1 className="px-4 font-brand text-4xl text-tfm-primary lg:px-0">
        {heading}
      </h1>
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
                    "hidden bg-gray-100 p-2 px-4 text-left font-subheading text-sm font-semibold uppercase text-tfm-primary xl:table-cell" +
                    (index === 0 ? " rounded-tl" : "") +
                    (index === columns.length - 1 ? " rounded-tr" : "")
                  }
                >
                  {column.displayName}
                </th>
              ))}
              <th
                scope="col"
                className="hidden justify-end bg-gray-100 p-3 md:flex md:rounded-tr"
              >
                <Button primary extraSmall loading={true} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {docList.map((doc, docIdx) => (
              <tr key={docIdx}>
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className={"hidden p-4 text-sm xl:table-cell"}
                  >
                    <div
                      className="h-4 animate-pulse rounded bg-gray-200"
                      style={{ width: `${33 + Math.random() * 67}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
