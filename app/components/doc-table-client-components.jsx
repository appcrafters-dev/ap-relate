"use client";

import { localDateTime, prettyDate } from "lib/date";

export function SessionDatetime({ date }) {
  return (
    <div>
      <p>{prettyDate(date)}</p>
      <p className="text-gray-500">
        {
          localDateTime(
            date,
            Intl.DateTimeFormat().resolvedOptions().timeZone
          ).split(" at ")[1]
        }
      </p>
    </div>
  );
}
