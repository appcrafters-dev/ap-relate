"use client";
import {
  AcademicCapIcon,
  ClockIcon,
  GlobeAltIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  CalendarDaysIcon,
  XMarkIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import CalendarView from "@/components/calendar-view";

import { classNames } from "lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DEFAULT_DATETIME_FORMAT,
  TIMEZONES,
  USER_TIMEZONE,
} from "lib/constants";
import moment from "moment-timezone";
import TfmCombobox from "@/components/ui/forms";
import { Button, LinkButton } from "@/components/ui/buttons";
import { localDateTime } from "lib/date";
import { ErrorBox } from "@/components/ui/errors";
import relateAPI from "lib/relate-api-client";

function SessionField({ title, Icon, description, children = null }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-subheading text-sm font-bold uppercase text-tfm-primary">
          {title}
        </p>
        {description && (
          <p className="truncate text-gray-500">{description || ""}</p>
        )}
        {children}
      </div>
    </div>
  );
}

export default function Session({ session, coach, heads_of_household, error }) {
  // TODO: this should come from the API
  // session.duration = 90;
  const [status, setStatus] = useState(session?.status);
  const [timeZone, setTimeZone] = useState(USER_TIMEZONE);
  const today = moment().startOf("day");

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calenderMonth, setCalenderMonth] = useState({
    month: today.month(),
    year: today.year(),
  });
  const [selectedSlot, setSelectedSlot] = useState({});

  const now = new Date();
  const nextYear = new Date(now.getFullYear() + 1, now.getMonth());

  let startLimit = session?.planned_for_starts_on
    ? new Date(session?.planned_for_starts_on)
    : now;
  if (startLimit < now) {
    startLimit = now;
  }

  const endLimit = session?.planned_for_ends_on
    ? new Date(session?.planned_for_ends_on)
    : nextYear;

  function onCalenderMonthChange(month, year) {
    setCalenderMonth({ month, year });
  }

  async function fetchAvailableSlots(month, year, timeZone) {
    setLoading(true);

    moment.tz.setDefault(timeZone);

    const now = moment();

    let startTime = moment({ year, month, day: 1 });
    if (startTime < now) startTime = now;

    const { data, error } = await relateAPI.post(
      `coaches/${coach.id}/availability`,
      {
        startTime: startTime.tz(timeZone).format(DEFAULT_DATETIME_FORMAT),
        endTime: startTime
          .clone()
          .endOf("month")
          .format(DEFAULT_DATETIME_FORMAT),
        timeZone,
        sessionDuration: 90,
      }
    );

    setLoading(false);

    if (error) {
      setStatus("error");
    } else {
      setAvailableTimeSlots(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (status === "Scheduled") return;
    fetchAvailableSlots(calenderMonth.month, calenderMonth.year, timeZone);
  }, [calenderMonth, timeZone]);

  const sessionFields = [
    {
      title: "Session",
      description: session?.session.title,
      Icon: AcademicCapIcon,
    },
    {
      title: "Your Coach",
      description: `${coach?.first_name} ${coach?.last_name}`,
      Icon: UserIcon,
    },
    {
      title: "Duration",
      description: "90 Minutes",
      Icon: ClockIcon,
    },
  ];

  // TODO: handle cancel and reschedule
  if (error || status === "error") {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-center font-brand text-3xl text-gray-900">
          Oops! Something went wrong.
        </h1>
        <ErrorBox
          msg={
            error ||
            "Sorry, there was a problem loading the calendar. Please contact us at hello@totalfamily.io for help scheduling this session."
          }
        />
        <LinkButton href="/sessions" primary fullWidth>
          &larr; Go Back
        </LinkButton>
      </div>
    );
  }
  let nMonth;
  let nYear;

  const month = startLimit.getMonth();
  const year = startLimit.getFullYear();

  if (month === 11) {
    nMonth = 0;
    nYear = year + 1;
  } else {
    nMonth = month + 1;
    nYear = year;
  }

  if (
    nYear > endLimit.getFullYear() ||
    (nYear === endLimit.getFullYear() && nMonth > endLimit.getMonth())
  ) {
    return (
      <>
        <center>
          <h1>You have exceeded the endlimit to schedule the session.</h1>
        </center>
      </>
    );
  } else {
    return (
      <>
        <div
          className={classNames(
            "-mx-4 grid bg-white sm:rounded sm:shadow-sm",
            status === "Scheduled"
              ? "sm:mx-auto sm:max-w-md"
              : "sm:mx-0 lg:grid-cols-2"
          )}
        >
          <div className="space-y-4 px-4 py-5 sm:px-6">
            <h1 className="font-brand text-4xl text-gray-900">
              {status === "Scheduled"
                ? "You're scheduled with"
                : `Schedule ${session.session.title} with`}{" "}
              <span className="font-bold italic">{coach.first_name}</span>
            </h1>
            <div className="space-y-4">
              {sessionFields.map((field, idx) => (
                <SessionField key={idx} {...field} />
              ))}

              {status == "Scheduled" ? (
                <SessionField
                  title="Scheduled for"
                  Icon={CalendarIcon}
                  description={localDateTime(session.scheduled_time + "Z")}
                />
              ) : (
                <SessionField title="Time Zone" Icon={GlobeAltIcon}>
                  <TfmCombobox
                    selected={timeZone}
                    setSelected={setTimeZone}
                    options={TIMEZONES}
                    label="Time Zone"
                    hideLabel
                    disabled={Object.keys(selectedSlot).length > 0}
                  />
                </SessionField>
              )}
            </div>
            {status === "Scheduled" && (
              <div className="w-full items-center space-y-4 pt-4 text-center">
                <Button
                  onClick={() => setStatus("pending")}
                  Icon={CalendarDaysIcon}
                  fullWidth
                  primary
                >
                  Reschedule
                </Button>
                <Button
                  onClick={() => setStatus("error")}
                  Icon={XMarkIcon}
                  fullWidth
                  small
                >
                  I need to cancel
                </Button>
              </div>
            )}
          </div>
          {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
          {status != "Scheduled" && (
            <div className="bg-gray-50 sm:rounded-b-xl lg:rounded-none lg:rounded-r-xl">
              <div className="px-4 py-5 sm:px-6">
                <CalendarView
                  {...{
                    availableTimeSlots,
                    onCalenderMonthChange,
                    loading,
                    coach,
                    heads_of_household,
                    timeZone,
                    session,
                    startLimit,
                    endLimit,
                    selectedSlot,
                    setSelectedSlot,
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <Link
            className="pt-2 text-xs text-gray-500"
            href={`/sessions/${session.id}`}
          >
            &larr; Return to Session
          </Link>
        </div>
      </>
    );
  }
}
