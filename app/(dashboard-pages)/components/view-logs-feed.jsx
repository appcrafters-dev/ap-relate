import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { relativeDate } from "lib/date";

export function ViewLogsFeed() {
  const [logs, setLogs] = useState([]);
  const pathname = usePathname();
  const supabase = getSupabaseClientComponentClient();

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase.client
        .from("view_logs")
        .select(
          "id, created_at, ...user_profile_id(first_name, last_name), route"
        )
        .eq("route", pathname)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching view logs:", error);
        return;
      }

      setLogs(data);
    };

    fetchLogs();
  }, [pathname]);

  if (logs.length === 0) return null;

  return (
    <div className="py-8">
      <ul className="font-subheading text-xs font-semibold uppercase text-gray-600">
        {logs.map((log, index) => (
          <li key={index}>
            <b>
              {log.first_name} {log.last_name}
            </b>{" "}
            viewed {relativeDate(log.created_at)}
          </li>
        ))}
      </ul>
    </div>
  );
}
