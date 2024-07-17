import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { formatDate, generateDaysInMonth, prettyDate } from "lib/date";
import { classNames, getFullName } from "lib/utils";
import { useEffect, useState } from "react";
import { BorderlessButton, Button } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import moment from "moment";
import relateAPI from "lib/relate-api-client";

function getTimeString(datetime) {
  datetime = moment(datetime);
  return datetime.format("MMMM D, YYYY [at] h:mm A z");
}

export default function CalendarView({
  onCalenderMonthChange,
  availableTimeSlots = [],
  loading = false,
  startLimit = new Date(),
  endLimit = new Date(startLimit.getFullYear() + 1, startLimit.getMonth()),
  heads_of_household = [],
  timeZone,
  session,
  coach,
  selectedSlot,
  setSelectedSlot,
}) {
  const [selected, setSelected] = useState(startLimit);
  const [month, setMonth] = useState(startLimit.getMonth());
  const [year, setYear] = useState(startLimit.getFullYear());
  const [days, setDays] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [currentSlots, setCurrentSlots] = useState([]);
  const [scheduleFormState, setScheduleFormState] = useState({
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!selected) {
      setCurrentSlots([]);
    } else {
      setCurrentSlots(availableTimeSlots[formatDate(selected)] || []);
    }
  }, [availableTimeSlots, selected]);

  useEffect(() => {
    const daysInMonth = generateDaysInMonth(month, year);
    setDays(daysInMonth);
  }, [month, year]);

  useEffect(() => {
    onCalenderMonthChange(month, year);
  }, [month, year]);

  const handlePreviousMonth = () => {
    if (month === startLimit.getMonth() && year === startLimit.getFullYear())
      return;

    setSelected();

    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    let nextMonth;
    let nextYear;

    if (month === 11) {
      nextMonth = 0;
      nextYear = year + 1;
    } else {
      nextMonth = month + 1;
      nextYear = year;
    }

    if (
      nextYear > endLimit.getFullYear() ||
      (nextYear === endLimit.getFullYear() && nextMonth > endLimit.getMonth())
    ) {
      return;
    }

    setSelected();

    setMonth(nextMonth);
    setYear(nextYear);
  };

  function getDayClassName(day) {
    const classes = ["rounded", "border", "py-2", "transition duration-200"];

    if (!day.isCurrentMonth) return "invisible";

    if (loading) return [...classes, "animate-pulse bg-white"].join(" ");

    const available = isAvailable(day);
    const isToday = formatDate(new Date()) === formatDate(day.date);

    if (!day.isSelected && available && !isToday) {
      classes.push(
        "text-gray-900",
        "bg-white",
        "hover:bg-tfm-primary",
        "hover:text-white",
        "focus:z-10"
      );
    } else if (!day.isSelected)
      classes.push("text-gray-400 border-transparent");

    if (available) classes.push("border-gray-200");

    if (day.isSelected && !isToday)
      classes.push("bg-tfm-primary text-white font-bold");

    if (isToday) classes.push("font-bold text-tfm-primary border-transparent");

    return classes.join(" ");
  }

  function isAvailable(day) {
    if (!day || !day.date) return false;

    const dayDateString = formatDate(day.date);

    const slots = availableTimeSlots[dayDateString];

    return !!slots?.length;
  }

  const scheduleSession = async (e) => {
    e.preventDefault();
    setScheduleFormState({ loading: true, error: null });

    let reqBody = {
      startTime: selectedSlot.start,
      durationMinutes: 90,
      attendees: heads_of_household.map(({ email, first_name, last_name }) => ({
        email,
        displayName: getFullName(first_name, last_name),
      })),
      timeZone,
      coachId: coach.id,
      eventDescription: `Session with ${getFullName(
        coach.first_name,
        coach.last_name
      )} at TFM.\n\nTo join the session, visit: https://totalfamily.io/v/${
        session.short_id
      }\n\nIf you need to reschedule, please visit: https://totalfamily.io/schedule/${
        session.short_id
      }`,
      eventTitle: `TFM Session - ${session.session.title}`,
      shortId: session.short_id,
    };

    if (session.google_event_id) {
      reqBody.googleEventId = session.google_event_id;
    }

    const { error } = await relateAPI.post(
      `families/${session.family_id}/family-sessions/${session.id}/schedule`,
      reqBody
    );

    if (error) {
      return setScheduleFormState({ loading: false, error });
    }

    setScheduleFormState({ loading: false, error: null });
    window.location.reload();
  };

  if (selectedSlot?.start) {
    return (
      <form
        className="my-4 flex h-full flex-col items-center justify-between space-y-4 text-center"
        onSubmit={scheduleSession}
      >
        <h2 className="font-subheading text-2xl font-semibold">
          {new Date(selectedSlot.start).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </h2>
        <p className="text-gray-500">
          Confirm your session. We&apos;ll send emails with an event invite to
          add to your calendars.
        </p>
        <div className="space-y-2">
          {heads_of_household.map((head) => (
            <ContactCard contact={head} key={head.email} />
          ))}
        </div>
        <Button
          type="submit"
          primary
          fullWidth
          Icon={CheckCircleIcon}
          onClick={scheduleSession}
          disabled={scheduleFormState.loading}
          loading={scheduleFormState.loading}
        >
          Confirm
        </Button>
        {scheduleFormState.error && (
          <div className="w-full">
            <ErrorBox
              msg={
                scheduleFormState.error?.message ||
                scheduleFormState.error ||
                "Something went wrong. Please try again."
              }
            />
          </div>
        )}
        <BorderlessButton onClick={() => setSelectedSlot({})} small>
          &larr; Choose a different time
        </BorderlessButton>
      </form>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center text-gray-900">
        <button
          type="button"
          className={classNames(
            "flex flex-none items-center justify-center p-1.5 text-gray-500",
            loading ||
              (month === startLimit.getMonth() &&
                year === startLimit.getFullYear())
              ? "cursor-not-allowed opacity-50"
              : "hover:text-gray-600"
          )}
          onClick={handlePreviousMonth}
          disabled={
            loading ||
            (month === startLimit.getMonth() &&
              year === startLimit.getFullYear())
          }
          title="Previous month"
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex-auto font-subheading text-base font-bold uppercase">
          {new Date(year, month, 1).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          type="button"
          onClick={handleNextMonth}
          disabled={
            loading ||
            (month === endLimit.getMonth() && year === endLimit.getFullYear())
          }
          className={classNames(
            "flex flex-none items-center justify-center p-1.5 text-gray-500",
            loading ||
              (month === endLimit.getMonth() && year === endLimit.getFullYear())
              ? "cursor-not-allowed opacity-50"
              : "hover:text-gray-600"
          )}
          title="Next month"
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-6 grid grid-cols-7 font-subheading text-sm font-semibold uppercase leading-6 text-gray-500">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="isolate mt-2 grid grid-cols-7 gap-1 text-sm">
        {days.map((day) => (
          <button
            key={day.date}
            type="button"
            disabled={loading || !day.isCurrentMonth || !isAvailable(day)}
            className={getDayClassName({
              ...day,
              isSelected:
                selected && formatDate(selected) === formatDate(day.date),
            })}
            onClick={() => setSelected(day.date)}
          >
            {loading ? (
              <div className="mx-auto flex h-7 w-7 animate-pulse items-center justify-center rounded bg-white" />
            ) : (
              <time
                dateTime={day.date}
                className="mx-auto flex h-7 w-7 items-center justify-center rounded"
                title={"Show available times for " + prettyDate(day.date)}
              >
                {day.date.split("-").pop().replace(/^0/, "")}
              </time>
            )}
          </button>
        ))}
      </div>
      {/* sorry, no available times for this month */}
      <Transition
        show={
          !loading &&
          !days.some((day) => isAvailable(day)) &&
          !selectedSlot.start
        }
        enter="transition ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="mt-4">
          <p className="font-subheading text-xs font-semibold uppercase tracking-wide text-gray-500">
            Sorry, there are no available times in{" "}
            {new Date(year, month, 1).toLocaleString("default", {
              month: "long",
            })}
          </p>
        </div>
      </Transition>

      {/* show available slots for selected day */}
      <Transition
        show={!loading && !!currentSlots?.length}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="mt-4">
          <h3 className="flex-auto font-subheading text-sm font-semibold uppercase tracking-wide">
            Select a time
          </h3>
          <ul className="mt-2 space-y-2 text-center">
            {currentSlots
              .filter(
                // show only 3 slots if showMore is false
                (date, index) => (showMore ? true : index < 3)
              )
              .map((date) => (
                <li key={date}>
                  <Button
                    fullWidth
                    onClick={() => setSelectedSlot({ start: date })}
                  >
                    {getTimeString(date)}
                  </Button>
                </li>
              ))}
          </ul>
          {/* show more button */}
          {!showMore && currentSlots.length > 3 && (
            <div className="mt-2">
              <button
                className="font-subheading text-xs font-semibold uppercase tracking-wide"
                onClick={() => setShowMore(true)}
              >
                Show more times...
              </button>
            </div>
          )}
        </div>
      </Transition>
    </div>
  );
}

export function ContactCard({ contact }) {
  return (
    <div className="flex w-full flex-col rounded bg-white p-3 text-center text-sm shadow">
      <p className="font-medium">
        {contact?.first_name} {contact?.last_name}
      </p>
      <p className="mt-1 text-gray-500">{contact?.email}</p>
    </div>
  );
}
