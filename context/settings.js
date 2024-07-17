import { createContext, useContext, useEffect, useState } from "react";
import { DAYS_OF_WEEK, USER_TIMEZONE } from "lib/constants";

const defaultStartTime = "09:00";
const defaultEndTime = "17:00";

const defaultWorkingHours = DAYS_OF_WEEK.reduce((whs, day) => {
  whs[day] = {
    available: false,
    hours: [{ start: defaultStartTime, end: defaultEndTime }],
  };
  return whs;
}, {});

export const SettingsContext = createContext({
  workingHours: defaultWorkingHours,
  setDayAsAvailable: (day) => {},
  setDayAsUnavailable: (day) => {},
  addWorkingHours: (day, start, end) => {},
  updateStartTime: (day, index, start) => {},
  updateEndTime: (day, index, end) => {},
  removeWorkingHours: (day, index) => {},

  calendarsForConflictCheck: [],
  addCalendarForConflictCheck: (calendarId) => {},
  removeCalendarForConflictCheck: (calendarId) => {},

  timeZone: {},
  setTimeZone: (timezone) => {},

  minimumNotice: 1440,
  setMinimumNotice: (minimumNotice) => {},

  calendarToAddEvents: null,
  setCalendarToAddEvents: (calendarToAddEvents) => {},
});

export function SettingsContextProvider({ userDefaults, children }) {
  const [workingHours, setWorkingHours] = useState(
    userDefaults?.working_hours || defaultWorkingHours
  );

  const [calendarsForConflictCheck, setCalendarsForConflictCheck] = useState(
    userDefaults?.selected_calendar_ids || []
  );

  const addCalendarForConflictCheck = (calendarId) => {
    setCalendarsForConflictCheck([...calendarsForConflictCheck, calendarId]);
  };

  const removeCalendarForConflictCheck = (calendarId) => {
    setCalendarsForConflictCheck(
      calendarsForConflictCheck.filter((id) => id !== calendarId)
    );
  };

  function setDayAvailability(day, isAvailable = false) {
    setWorkingHours({
      ...workingHours,
      [day]: {
        ...workingHours[day],
        available: isAvailable,
      },
    });
  }

  const addWorkingHours = (day, start, end) => {
    const _workingHours = { ...workingHours };

    _workingHours[day] = {
      ..._workingHours[day],
      hours: [
        ...(workingHours[day].hours || []),
        {
          start: start || defaultStartTime,
          end: end || defaultEndTime,
        },
      ],
    };

    setWorkingHours(_workingHours);
  };

  const removeWorkingHours = (day, index) => {
    const _workingHours = { ...workingHours };
    _workingHours[day] = {
      ..._workingHours[day],
      hours: _workingHours[day].hours.filter((_, i) => i !== index),
    };
    setWorkingHours(_workingHours);
  };

  function _updateWorkingHours(day, index, key, value) {
    const _workingHours = { ...workingHours };

    _workingHours[day] = {
      ..._workingHours[day],
      hours: _workingHours[day].hours.map((wh, i) => {
        if (i === index) {
          return { ...wh, [key]: value };
        }
        return wh;
      }),
    };

    setWorkingHours(_workingHours);
  }

  function updateStartTime(day, index, start) {
    _updateWorkingHours(day, index, "start", start);
  }

  function updateEndTime(day, index, end) {
    _updateWorkingHours(day, index, "end", end);
  }

  const [calendarToAddEvents, setCalendarToAddEvents] = useState(
    userDefaults?.default_calendar_id || ""
  );

  const [timeZone, setTimeZone] = useState(userDefaults?.timezone);

  const [minimumNotice, setMinimumNotice] = useState(
    userDefaults?.minimum_notice || 1440
  );

  useEffect(() => {
    if (!timeZone) {
      setTimeZone(USER_TIMEZONE);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        workingHours,
        setDayAsAvailable: (day) => setDayAvailability(day, true),
        setDayAsUnavailable: (day) => setDayAvailability(day, false),

        addWorkingHours,
        updateStartTime,
        updateEndTime,
        removeWorkingHours,

        calendarsForConflictCheck,
        addCalendarForConflictCheck,
        removeCalendarForConflictCheck,

        timeZone,
        setTimeZone,

        minimumNotice,
        setMinimumNotice,

        calendarToAddEvents,
        setCalendarToAddEvents,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
