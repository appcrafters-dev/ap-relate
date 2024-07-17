import {
  changeWorkingHoursTimezone,
  generateAvailableTimeSlots,
} from "lib/date";

import { DEFAULT_DATETIME_FORMAT } from "lib/constants";
import moment from "moment";

const Timezones = {
  UTC: "UTC",
  AsiaKolkata: "Asia/Kolkata",
  AmericaNewYork: "America/New_York",
  AustraliaMelbourne: "Australia/Melbourne",
};

describe("changeWorkingHoursTimezone", () => {
  it("should return the same working hours when source and destination timezones are the same", () => {
    const workingHours = {
      Monday: {
        available: true,
        hours: [{ start: "09:00", end: "17:00" }],
      },
    };

    const result = changeWorkingHoursTimezone(
      workingHours,
      Timezones.UTC,
      Timezones.UTC
    );
    expect(result).toEqual(workingHours);
  });

  it("should convert working hours without spanning to a new day", () => {
    const workingHours = {
      Monday: {
        available: true,
        hours: [{ start: "09:00", end: "17:00" }],
      },
    };

    const result = changeWorkingHoursTimezone(
      workingHours,
      Timezones.UTC,
      Timezones.AsiaKolkata
    );

    expect(result.Monday.hours[0].start).toBe("14:30");
    expect(result.Monday.hours[0].end).toBe("22:30");
  });

  it("should convert working hours to span across next day", () => {
    const workingHours = {
      Monday: {
        available: true,
        hours: [{ start: "16:00", end: "23:00" }],
      },
    };

    const result = changeWorkingHoursTimezone(
      workingHours,
      Timezones.UTC,
      Timezones.AsiaKolkata
    );

    expect(result.Monday.hours[0].start).toBe("21:30");
    expect(result.Monday.hours[0].end).toBe("23:59");
    expect(result.Tuesday.available).toBe(true);
    expect(result.Tuesday.hours[0].start).toBe("00:00");
    expect(result.Tuesday.hours[0].end).toBe("04:30");
  });

  it("should convert working hours for timezone behind", () => {
    const workingHours = {
      Monday: {
        available: true,
        hours: [{ start: "02:30", end: "06:30" }],
      },
    };

    const result = changeWorkingHoursTimezone(
      workingHours,
      Timezones.AsiaKolkata,
      Timezones.UTC
    );

    expect(result.Sunday.hours).toHaveLength(1);
    expect(result.Sunday.available).toBe(true);
    expect(result.Sunday.hours[0].start).toBe("21:00");
    expect(result.Sunday.hours[0].end).toBe("23:59");

    expect(result.Monday.hours).toHaveLength(1);
    expect(result.Monday.available).toBe(true);
    expect(result.Monday.hours[0].start).toBe("00:00");
    expect(result.Monday.hours[0].end).toBe("01:00");
  });

  it("should throw error if working hours are not in valid form", () => {
    const workingHours = {
      Monday: {
        available: true,
        hours: [{ start: "22:00", end: "02:00" }],
      },
    };

    expect(() =>
      changeWorkingHoursTimezone(
        workingHours,
        Timezones.UTC,
        Timezones.AsiaKolkata
      )
    ).toThrow("Start time must be before end time");
  });

  it("should handle days when the advisor is unavailable", () => {
    const workingHours = {
      Monday: {
        available: false,
        hours: [],
      },
    };

    const result = changeWorkingHoursTimezone(
      workingHours,
      Timezones.UTC,
      Timezones.AsiaKolkata
    );

    expect(result.Monday).toBeUndefined();
  });

  it("should convert working hours for multiple days", () => {
    const workingHours = {
      Monday: {
        available: true,
        hours: [{ start: "09:00", end: "17:00" }],
      },
      Tuesday: {
        available: true,
        hours: [{ start: "10:00", end: "16:00" }],
      },
    };

    const result = changeWorkingHoursTimezone(
      workingHours,
      Timezones.UTC,
      Timezones.AsiaKolkata
    );

    expect(result.Monday.hours).toHaveLength(1);
    expect(result.Monday.hours[0].start).toBe("14:30");
    expect(result.Monday.hours[0].end).toBe("22:30");

    expect(result.Tuesday.hours).toHaveLength(1);
    expect(result.Tuesday.hours[0].start).toBe("15:30");
    expect(result.Tuesday.hours[0].end).toBe("21:30");
  });

  it("should convert working hours for multiple days where conversion span across next day", () => {
    const workingHours = {
      Monday: {
        available: true,
        hours: [{ start: "16:00", end: "23:00" }],
      },
      Tuesday: {
        available: true,
        hours: [{ start: "16:00", end: "23:00" }],
      },
    };

    const result = changeWorkingHoursTimezone(
      workingHours,
      Timezones.UTC,
      Timezones.AsiaKolkata
    );

    expect(result.Monday.hours).toHaveLength(1);
    expect(result.Monday.hours[0].start).toBe("21:30");
    expect(result.Monday.hours[0].end).toBe("23:59");

    expect(result.Tuesday.available).toBe(true);
    expect(result.Tuesday.hours).toHaveLength(2);
    expect(result.Tuesday.hours[0].start).toBe("00:00");
    expect(result.Tuesday.hours[0].end).toBe("04:30");
    expect(result.Tuesday.hours[1].start).toBe("21:30");
    expect(result.Tuesday.hours[1].end).toBe("23:59");

    expect(result.Wednesday.available).toBe(true);
    expect(result.Wednesday.hours).toHaveLength(1);
    expect(result.Wednesday.hours[0].start).toBe("00:00");
    expect(result.Wednesday.hours[0].end).toBe("04:30");
  });

  it("should convert working hours for multiple days where conversion span across next day and the advisor is unavailable on one of the days", () => {
    const workingHours = {
      Friday: {
        available: true,
        hours: [{ start: "13:00", end: "21:00" }],
      },
      Saturday: {
        available: false,
        hours: [{ start: "09:00", end: "17:00" }],
      },
    };

    const result = changeWorkingHoursTimezone(
      workingHours,
      Timezones.AmericaNewYork,
      Timezones.AustraliaMelbourne
    );

    expect(result.Friday).toBeUndefined();
    expect(result.Saturday.hours).toHaveLength(1);
    expect(result.Saturday.hours[0].start).toBe("03:00");
    expect(result.Saturday.hours[0].end).toBe("11:00");

    expect(result.Sunday).toBeUndefined();
  });
});

describe("generateAvailableTimeSlots", () => {
  beforeAll(() => {
    moment.tz.setDefault(Timezones.AsiaKolkata);
  });

  afterAll(() => {
    moment.tz.setDefault();
  });

  it("should return empty array if no working hours are available", () => {
    const now = moment();
    const startDate = now.clone().add(1, "day").startOf("day");
    const startDateStr = startDate.format("YYYY-MM-DD");
    const endDate = startDateStr;
    const sessionDuration = 90; // 1.5 hour
    const minimumNotice = 10 * 60; // 10 minutes
    const workingHours = {
      [now.format("dddd")]: {
        available: true,
        hours: [{ start: "09:00", end: "17:00" }],
      },
      [startDate.format("dddd")]: {
        available: true,
        hours: [{ start: "09:00", end: "17:00" }],
      },
    };
    const busyHours = [
      {
        start: startDate.clone().set({ hour: 9 }),
        end: startDate.clone().set({ hour: 10 }),
      },
      {
        start: startDate.clone().set({ hour: 13 }),
        end: startDate.clone().set({ hour: 14 }),
      },
    ];
    const expectedAvailableTimeSlots = [
      startDate.clone().set({ hour: 10, minute: 30 }),
      startDate.clone().set({ hour: 11 }),
      startDate.clone().set({ hour: 14, minute: 30 }),
      startDate.clone().set({ hour: 15 }),
      startDate.clone().set({ hour: 15, minute: 30 }),
    ].map((t) => t.format(DEFAULT_DATETIME_FORMAT));
    const result = generateAvailableTimeSlots(
      startDateStr,
      endDate,
      sessionDuration,
      workingHours,
      busyHours,
      minimumNotice
    );
    expect(result).toEqual(expectedAvailableTimeSlots);
  });
});
