import moment from "moment-timezone";
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  DEFAULT_DATETIME_FORMAT,
  DAYS_OF_WEEK,
} from "lib/constants";
import { generateTimeSlots } from "lib/utils";

export function relativeDate(dateTime) {
  return moment(dateTime).fromNow();
}

export function prettyDate(date) {
  return moment(date).format("MMMM Do, YYYY");
}

export function localDateTime(str, timezone) {
  // Use the provided timezone or guess if not provided
  let targetTimezone = timezone || moment.tz.guess();
  return moment(str).tz(targetTimezone).format("MMMM Do, YYYY [at] h:mm A z");
}

export function localDate(date) {
  return moment(date).format(DEFAULT_DATE_FORMAT);
}

export function formatDate(input) {
  let date;

  if (typeof input === "string") {
    const [year, month, day] = input
      .split("-")
      .map((part) => parseInt(part, 10));
    date = new Date(year, month - 1, day); // Month is zero-based
  } else if (input instanceof Date) {
    date = input;
  } else {
    console.error("Invalid date input:", input);
    return null;
  }

  if (isNaN(date)) {
    console.error("Invalid date:", input);
    return null;
  }

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

export function getAge(date) {
  const birthdate = moment(date);
  const today = moment();
  let ageInMonths = today.diff(birthdate, "months");
  if (today.date() < birthdate.date()) {
    ageInMonths--;
  }
  if (ageInMonths < 12) {
    return `${ageInMonths} months`;
  }
  const ageInYears = Math.floor(ageInMonths / 12);
  return ageInYears;
}

export function generateDaysInMonth(month, year) {
  const date = new Date(year, month, 1);
  const firstDay = date.getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const daysInMonth = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthLastDay = prevMonth.getDate();
    daysInMonth.push({
      date: `${prevMonth.getFullYear()}-${prevMonth.getMonth() + 1}-${
        prevMonthLastDay - i
      }`,
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= lastDay; i++) {
    daysInMonth.push({
      date: `${year}-${month + 1}-${i}`,
      isCurrentMonth: true,
    });
  }

  const nextMonthDays = 7 - (daysInMonth.length % 7);
  for (let i = 1; i <= nextMonthDays; i++) {
    const nextMonth = new Date(year, month + 1, i);
    daysInMonth.push({
      date: `${nextMonth.getFullYear()}-${
        nextMonth.getMonth() + 1
      }-${nextMonth.getDate()}`,
      isCurrentMonth: false,
    });
  }

  return daysInMonth;
}

export function checkTimeOverlap(timeSegments) {
  if (timeSegments.length === 1) return false;

  timeSegments = timeSegments.sort((a, b) => a.start.diff(b.start));

  for (let i = 0; i < timeSegments.length - 1; i++) {
    const currentEndTime = timeSegments[i].end;
    const nextStartTime = timeSegments[i + 1].start;

    if (currentEndTime.isAfter(nextStartTime)) return true;
  }

  return false;
}

/*
  - skip days that advisor is not available
  - convert working hours to the user's timezone
*/
export function changeWorkingHoursTimezone(
  workingHours,
  sourceTimezone,
  destinationTimezone
) {
  if (sourceTimezone === destinationTimezone) return { ...workingHours };

  const TIME_FORMAT = "dddd-HH:mm";
  const TIME_FORMAT_2 = "HH:mm";
  const convertedWorkingHours = {};

  for (const day of DAYS_OF_WEEK) {
    convertedWorkingHours[day] = { hours: [], available: true };
  }

  for (const day in workingHours) {
    if (!workingHours[day].available) continue;

    for (const hours of workingHours[day].hours) {
      if (
        moment(hours.start, TIME_FORMAT_2) >= moment(hours.end, TIME_FORMAT_2)
      ) {
        throw new Error("Start time must be before end time");
      }
      const [startTimeDay, startTime] = moment
        .tz(`${day}-${hours.start}`, TIME_FORMAT, sourceTimezone)
        .tz(destinationTimezone)
        .format(TIME_FORMAT)
        .split("-");

      const [endTimeDay, endTime] = moment
        .tz(`${day}-${hours.end}`, TIME_FORMAT, sourceTimezone)
        .tz(destinationTimezone)
        .format(TIME_FORMAT)
        .split("-");

      if (startTimeDay === endTimeDay) {
        convertedWorkingHours[startTimeDay].hours.push({
          start: startTime,
          end: endTime,
        });
      } else {
        convertedWorkingHours[startTimeDay].hours.push({
          start: startTime,
          end: "23:59",
        });
        convertedWorkingHours[endTimeDay].hours.push({
          start: "00:00",
          end: endTime,
        });
      }
    }
  }

  // remove days that are not available
  for (const day of DAYS_OF_WEEK) {
    if (convertedWorkingHours[day].hours.length <= 0) {
      delete convertedWorkingHours[day];
    }
  }

  return convertedWorkingHours;
}

export function generateAvailableTimeSlots(
  startDate,
  endDate,
  sessionDuration,
  workingHours = [],
  busyHours = [],
  minimumNotice = 12 * 60 // 12 hours,
) {
  startDate = moment.max(moment(startDate), moment());
  endDate = moment(endDate).endOf("day");

  const noticeDate = moment().add(minimumNotice, "m");
  startDate = moment.max(startDate, noticeDate.add(1, "hour").startOf("hour"));

  const allPossibleSlots = generateTimeSlots(startDate, endDate, 30);

  const filteredTimeSlots = allPossibleSlots.filter((sessionStartTime) => {
    const sessionEndTime = moment(sessionStartTime).add(
      sessionDuration,
      "minutes"
    );
    const day = sessionStartTime.format("dddd");
    const { available, hours } = workingHours[day] || {};

    if (!available || sessionStartTime.isBefore(moment())) return false;

    const isInWorkingHours = hours.some(({ start, end }) => {
      const lastPossibleTime = moment(end, DEFAULT_TIME_FORMAT).subtract(
        sessionDuration,
        "minutes"
      );
      const _time = sessionStartTime.format(DEFAULT_TIME_FORMAT);
      return (
        _time >= start && _time <= lastPossibleTime.format(DEFAULT_TIME_FORMAT)
      );
    });

    if (!isInWorkingHours) return false;

    const isOverlapWithBusyHours = busyHours.some(({ start, end }) => {
      start = moment(start);
      end = moment(end);

      // add buffer of 30 minutes before and after the busy slot
      const busySlot = {
        start: start.clone().subtract(30, "minutes"),
        end: end.clone().add(30, "minutes"),
      };

      return (
        sessionStartTime.isBetween(busySlot.start, busySlot.end, null, "[)") ||
        sessionEndTime.isBetween(busySlot.start, busySlot.end, null, "(]")
      );
    });

    return !isOverlapWithBusyHours;
  });

  return filteredTimeSlots.reduce((acc, timeSlot) => {
    const date = timeSlot.format(DEFAULT_DATE_FORMAT);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(timeSlot.format(DEFAULT_DATETIME_FORMAT));
    return acc;
  }, {});
}
