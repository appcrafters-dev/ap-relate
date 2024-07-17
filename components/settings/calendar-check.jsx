import { Button } from "@/components/ui/buttons";
import moment from "moment-timezone";

export default function CalendarCheck({
  troubleshootData,
  selectedDay,
  timeZone,
  loading,
}) {
  if (!troubleshootData || loading) return <p>Loading...</p>;

  const { advisorSettings, busyHours, availableTimeSlots } = troubleshootData;

  if (!selectedDay) return <p>Select a day to get started</p>;

  // return message if selected day is in the past
  if (moment(selectedDay).isBefore(moment().startOf("day")))
    return <p>Please select a day in the future</p>;

  if (!advisorSettings)
    return <p>It appears your calendar is not set up properly</p>;

  const {
    working_hours: workingHours,
    timezone: advisorTimezone,
    minimum_notice: minimumNotice,
  } = advisorSettings;

  const selectedDayOfWeek = moment(selectedDay).tz(timeZone).format("dddd");
  const dayData = workingHours[selectedDayOfWeek];
  const minimumNoticeInHours = moment().add(minimumNotice, "minutes");
  const selectedCalendarIds = advisorSettings.selected_calendar_ids;

  const dayIsInMinimumNoticePeriod =
    moment(selectedDay).isBefore(minimumNoticeInHours);

  // Define the selected day start and end
  const selectedDayStart = moment.tz(selectedDay, timeZone).startOf("day");
  const selectedDayEnd = moment.tz(selectedDay, timeZone).endOf("day");

  // Filter the busyHours
  const filteredBusyHours = busyHours.filter((slot) => {
    const slotStart = moment.tz(slot.start, timeZone);
    const slotEnd = moment.tz(slot.end, timeZone);
    return (
      (slotStart.isSameOrAfter(selectedDayStart) &&
        slotStart.isBefore(selectedDayEnd)) ||
      (slotEnd.isAfter(selectedDayStart) &&
        slotEnd.isSameOrBefore(selectedDayEnd)) ||
      (slotStart.isBefore(selectedDayStart) && slotEnd.isAfter(selectedDayEnd))
    );
  });

  const filteredAvailableTimeSlots = availableTimeSlots.filter((slot) => {
    const slotTime = moment.tz(slot, timeZone);
    return (
      slotTime.isSameOrAfter(selectedDayStart) &&
      slotTime.isBefore(selectedDayEnd)
    );
  });

  return (
    <div>
      <h2 className="mb-2 font-brand text-2xl font-semibold">
        Default Working Hours
      </h2>
      <p className="mb-2">
        {dayData.available ? "Available on " : "Not available on "}
        {selectedDayOfWeek}s
      </p>
      {dayData.available && (
        <ul className="list-inside list-disc">
          {dayData.hours.map((hour, index) => (
            <li key={index} className="ml-2 list-item text-gray-600">
              {moment(hour.start, "HH:mm").tz(timeZone).format("hh:mm A z")} -{" "}
              {moment(hour.end, "HH:mm").tz(timeZone).format("hh:mm A z")}
            </li>
          ))}
        </ul>
      )}

      <h2 className="mb-2 mt-6 font-brand text-2xl font-semibold">Conflicts</h2>
      {filteredBusyHours.length === 0 ? (
        <p className="text-gray-600">
          No events on{" "}
          {moment(selectedDay).tz(timeZone).format("MMMM Do, YYYY")}
        </p>
      ) : (
        filteredBusyHours.map((slot, idx) => {
          const slotStart = moment(slot.start).tz(timeZone).format("hh:mm A");
          const slotEnd = moment(slot.end).tz(timeZone).format("hh:mm A");
          return (
            <div key={idx} className="mb-2">
              <p className="font-medium">Busy Event {idx + 1}</p>
              <p className="text-gray-600">{`${slotStart} - ${slotEnd}`}</p>
            </div>
          );
        })
      )}
      <p className="mt-4 font-brand text-sm italic">
        TFM is connected to these calendars: {selectedCalendarIds.join(", ")}
      </p>

      <h2 className="mb-2 mt-6 font-brand text-2xl font-semibold">
        Available Time Slots
      </h2>
      {filteredAvailableTimeSlots.length === 0 ? (
        <p className="text-gray-600">
          No available slots for{" "}
          {moment(selectedDay).tz(timeZone).format("MMMM Do, YYYY")}. Clients
          will <b>not</b> be able to book a session with you.
        </p>
      ) : (
        filteredAvailableTimeSlots.map((slot, idx) => {
          const slotTime = new Date(slot).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          return (
            <div key={idx} className="mb-2">
              <Button disabled>{slotTime}</Button>
            </div>
          );
        })
      )}
      {dayIsInMinimumNoticePeriod && (
        <p className="mt-4 font-brand text-sm italic text-red-600">
          This day falls within your minimum notice of {minimumNotice / 60}{" "}
          hours. This might be why there are no available slots.
        </p>
      )}
    </div>
  );
}
