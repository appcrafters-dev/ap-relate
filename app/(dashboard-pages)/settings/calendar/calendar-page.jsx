"use client";

import { useState } from "react";
import Image from "next/legacy/image";
import { DEFAULT_TIME_FORMAT, TIMEZONES } from "lib/constants";
import Spinner from "@/components/ui/spinner";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { ErrorBox } from "@/components/ui/errors";
import { Button } from "@/components/ui/buttons";
import { TfmFormColumns, TfmFormSelect } from "@/components/ui/forms";
import WorkingHours from "@/components/working-hours";
import { SettingsContextProvider, useSettings } from "context/settings";
import { checkTimeOverlap } from "lib/date";
import moment from "moment-timezone";
import relateAPI from "lib/relate-api-client";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";

async function updateCalendarSettings(coachId, body) {
  console.info("Updating coach", coachId, "settings...");

  const supabase = getSupabaseClientComponentClient();

  console.info("- Updating coach settings...", coachId);

  // Update coach profile
  const { data: updatedCoach, error: updateCoachError } = await supabase.client
    .from("coaches")
    .update(body)
    .eq("id", coachId)
    .select();

  if (updateCoachError) {
    console.error(
      " - Skipping, Error updating coach settings...",
      updateCoachError
    );

    return { data: null, error: updateCoachError };
  }

  console.info("- Done!");
  return { data: updatedCoach, error: null };
}

export default function CalendarSettingsPage({ coach, calendars }) {
  // TODO: move this to settings-layout when move to app directory
  // This wrapper is a workaround for the fact that we can't use server fetching in layout components with Next.js <= v12

  return (
    <SettingsContextProvider userDefaults={coach}>
      <CalendarSettings coach={coach} calendars={calendars} />
    </SettingsContextProvider>
  );
}

function CalendarSettings({ coach, calendars }) {
  const {
    workingHours,
    timeZone,
    setTimeZone,
    minimumNotice,
    calendarsForConflictCheck,
    calendarToAddEvents,
    addCalendarForConflictCheck,
    removeCalendarForConflictCheck,
    setMinimumNotice,
    setCalendarToAddEvents,
  } = useSettings();

  const [formHandlerState, setFormHandlerState] = useState({
    loading: false,
    error: null,
    success: null,
  });

  const getConsentURL = async () => {
    const { data: url } = await relateAPI.get("google/calendar/consent");
    window.location.href = url; // url to google consent page
  };

  const deleteCalendar = async (id) => {
    const { data } = await relateAPI.delete(`google/calendar/${id}`);
    if (data) return window.location.reload();
    return alert("Error deleting calendar");
  };

  const updateCoachSettings = async () => {
    setFormHandlerState({ loading: true, error: null, success: false });

    let isAvailable = false;

    Object.keys(workingHours).forEach((day) => {
      if (workingHours[day].available) isAvailable = true;
    });

    if (!isAvailable) {
      return setFormHandlerState({
        loading: false,
        error: "Please set working hours for at least one day of the week",
        success: false,
      });
    }

    if (calendarsForConflictCheck.length === 0) {
      return setFormHandlerState({
        loading: false,
        error: "Please select at least one calendar to check for conflicts",
        success: false,
      });
    }

    if (!calendarToAddEvents || !timeZone || !minimumNotice) {
      return setFormHandlerState({
        loading: false,
        error: "Please fill out all fields",
        success: false,
      });
    }

    // if calendarToAddEvents is not within the @totalfamilymgmt.com domain, show error
    // if (!calendarToAddEvents.includes("@totalfamilymgmt.com")) {
    //   return setFormHandlerState({
    //     loading: false,
    //     error:
    //       "Please select a calendar within the @totalfamilymgmt.com domain as your default 'Add events to' calendar",
    //     success: false,
    //   });
    // }

    for (const day in workingHours) {
      const hours = workingHours[day].hours.map(({ start, end }) => ({
        start: moment(start, DEFAULT_TIME_FORMAT),
        end: moment(end, DEFAULT_TIME_FORMAT),
      }));

      if (checkTimeOverlap(hours)) {
        return setFormHandlerState({
          loading: false,
          error: `You have overlapping hours on ${day}`,
          success: false,
        });
      }
    }

    const { error } = await updateCalendarSettings(coach.id, {
      default_calendar_id: calendarToAddEvents,
      selected_calendar_ids: calendarsForConflictCheck,
      timezone: timeZone,
      minimum_notice: minimumNotice,
      working_hours: workingHours,
    });

    if (error) {
      return setFormHandlerState({
        loading: false,
        error: error.message,
        success: false,
      });
    }

    return setFormHandlerState({
      loading: false,
      error: null,
      success: true,
    });
  };

  // if no calendars, show link to connect to google
  if (calendars.length === 0)
    return (
      <div className="space-y-4">
        {/* <p className="text-gray-600">
          Connect to your Google Calendar to get started
        </p> */}

        <Button
          fullWidth
          onClick={getConsentURL}
          Icon={() => (
            <Image
              src="/img/google-calendar-icon.svg"
              alt="Google Calendar"
              width={24}
              height={24}
            />
          )}
        >
          &nbsp; &nbsp; Connect to Google Calendar
        </Button>
      </div>
    );

  return (
    <div className="space-y-4">
      {/* working hours section */}
      <div>
        <h2 className="text-xl font-semibold">Working hours</h2>
        <p className="mt-2 text-sm text-gray-600">
          Set your availability for clients to book sessions.
        </p>
      </div>
      <WorkingHours />
      <div className="pb-4">
        <TfmFormColumns>
          <TfmFormSelect
            label="Time Zone"
            id="timezone"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            helpText={
              formHandlerState.error &&
              !timeZone && (
                <span className="text-red-600">This field is required</span>
              )
            }
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </TfmFormSelect>
          <TfmFormSelect
            label="Minimum notice required"
            id="minimum_notice"
            value={minimumNotice}
            onChange={(e) => setMinimumNotice(e.target.value)}
            helpText={
              formHandlerState.error && !minimumNotice ? (
                <span className="text-red-600">This field is required</span>
              ) : (
                "You won't get booked without at least this much warning"
              )
            }
          >
            <option value={60 * 24}>24 hours</option>
            <option value={60 * 24 * 2}>2 days</option>
            <option value={60 * 24 * 7}>1 week</option>
          </TfmFormSelect>
        </TfmFormColumns>
      </div>

      {/* conflicts section */}
      <div>
        <h2 className="text-xl font-semibold">Check for conflicts</h2>
        <p className="mt-2 text-sm text-gray-600">
          Anytime you have an event occurring within your working hours, you
          will be marked as unavailable to avoid double-bookings.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {calendars.map(
          (account) =>
            account && (
              <div
                key={account.id}
                className="flex flex-col overflow-hidden rounded bg-gray-50 shadow"
              >
                <div className="inline-flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                  <h3 className="inline-flex items-center text-lg font-medium leading-6 text-gray-900">
                    {/* google calendar logo */}
                    <Image
                      src="/img/google-calendar-icon.svg"
                      alt="Google Calendar"
                      width={24}
                      height={24}
                      className="mr-4"
                    />
                    Google Calendar
                  </h3>
                  <button
                    className="justify-center rounded border border-transparent p-2 text-sm font-medium text-gray-900 transition-colors hover:border-red-100 hover:bg-red-100 hover:text-red-700 focus-visible:border-red-100 focus-visible:bg-red-100 focus-visible:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
                    tabIndex={-1}
                    onClick={() => {
                      deleteCalendar(account.id);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Disconnect Calendar</span>
                  </button>
                </div>
                <ul className="flex flex-col space-y-4 p-4">
                  <p>
                    Select which calendars you want to check for conflicts on:
                  </p>
                  {account.calendars.map(
                    (cal) =>
                      cal && (
                        <li
                          className="inline-flex items-center text-sm font-medium"
                          key={cal.id}
                        >
                          <input
                            id={cal.id}
                            name={cal.id}
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                addCalendarForConflictCheck(cal.id);
                              } else {
                                removeCalendarForConflictCheck(cal.id);
                              }
                            }}
                            checked={
                              calendarsForConflictCheck.includes(cal.id)
                                ? true
                                : false
                            }
                            className="h-4 w-4 rounded border-gray-300 text-tfm-primary focus:ring-tfm-primary"
                          />
                          <label
                            htmlFor={cal.id}
                            className="ml-3 cursor-pointer"
                          >
                            {cal.name}
                          </label>
                        </li>
                      )
                  )}
                </ul>
              </div>
            )
        )}
      </div>

      <div className="flex justify-center pb-8">
        <button
          type="button"
          className="inline-flex items-center text-xs hover:underline"
          onClick={getConsentURL}
        >
          <PlusIcon className="-ml-1 mr-1 h-3 w-3" />
          Add another calendar
        </button>
      </div>

      {/* default calendar section */}
      <div>
        <h2 className="text-xl font-semibold">Default calendar</h2>
        <p className="mt-2 text-sm text-gray-600">
          Whenever you get booked for a session, we will automatically create an
          event on this calendar.
        </p>
        <div className="mt-4 max-w-sm pb-8">
          <TfmFormSelect
            label="Add events to"
            id="default_calendar_id"
            value={calendarToAddEvents}
            onChange={(e) => setCalendarToAddEvents(e.target.value)}
            helpText={
              formHandlerState.error &&
              !calendarToAddEvents && (
                <span className="text-red-600">This field is required</span>
              )
            }
          >
            <option></option>
            {calendars
              .map((account) =>
                account.calendars.map((calendar) => ({
                  ...calendar,
                  account_id: account.id,
                }))
              )
              .map((accountCalendars) =>
                accountCalendars.map((calendar) => (
                  <option key={calendar.id} value={calendar.id}>
                    {calendar.name}
                  </option>
                ))
              )}
          </TfmFormSelect>
        </div>
      </div>

      {/* save button / form errors section */}
      <Button
        primary
        onClick={updateCoachSettings}
        disabled={formHandlerState.loading}
      >
        {formHandlerState.loading ? <Spinner /> : "Save"}
      </Button>

      {formHandlerState.error && <ErrorBox msg={formHandlerState.error} />}

      {formHandlerState.success && (
        <ErrorBox msg="Calendar settings saved successfully" success />
      )}
    </div>
  );
}
