import moment from "moment";

export function getDocType(doctype) {
  const doctypes = {
    "head-of-household": "Head of Household",
    child: "Child",
    pet: "Pet",
  };
  return doctypes[doctype] || null;
}

export function isAdminRole(role) {
  return role && (role === "admin" || role === "advisor");
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function getFullName(firstName, lastName) {
  if (firstName instanceof Object) {
    firstName = firstName.first_name;
    lastName = firstName.last_name;
  }

  let fullName = firstName;
  if (lastName) fullName += " " + lastName;
  return fullName;
}

export function pluck(array, key) {
  return array.map((item) => item[key]);
}

export function getLocalTime(utcTime, timeZone) {
  const [hours, minutes, seconds = 0] = utcTime.split(":");
  const utcDate = new Date(Date.UTC(2000, 0, 1, hours, minutes, seconds));
  const localDate = new Date(
    utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000
  );

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZone: timeZone,
  }).format(localDate);
}

export function groupBy(array, key) {
  return array.reduce((result, current) => {
    const value = current[key];

    if (!result[value]) {
      result[value] = current;
    } else if (Array.isArray(result[value])) {
      result[value].push(current);
    } else {
      result[value] = [result[value], current];
    }
    return result;
  }, {});
}

export function generateTimeSlots(startTime, endTime, slotInterval = 30) {
  startTime = moment(startTime);
  endTime = moment(endTime);

  const allTimes = [];

  while (startTime < endTime) {
    allTimes.push(startTime);
    startTime = startTime.clone().add(slotInterval, "minutes");
  }

  return allTimes;
}

export function generateTimeStringSlots(startTime, endTime, slotInterval = 30) {
  startTime = moment(startTime);
  endTime = moment(endTime);

  const allTimes = [];

  while (startTime < endTime) {
    allTimes.push(startTime.format("HH:mm"));
    startTime = startTime.clone().add(slotInterval, "minutes");
  }

  return allTimes;
}

export function stripClasses(html) {
  return html
    ? html.replace(/<div class="ql-editor read-mode">|<\/div>/g, "")
    : "";
}

export function moneyFormat(num) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function phoneFormat(phone) {
  phone = phone.replace(/[^0-9()]/g, "");
  const phoneRegex = /(\d{3})(\d{3})(\d{4})/;
  return phone.replace(phoneRegex, "($1) $2-$3");
}

// Function to get a snippet around the search term
export function getSnippet(content, searchTerm) {
  const searchTermLower = searchTerm.toLowerCase();
  const contentLower = content.toLowerCase();
  const startIndex = contentLower.indexOf(searchTermLower);

  if (startIndex === -1) {
    // Search term not found, return the beginning of the content
    return content.substring(0, 300);
  } else {
    // Search term found, return a snippet around it
    const start = Math.max(startIndex - 100, 0);
    const end = start + 300;
    let snippet = content.substring(start, end);

    // Add ellipsis before and after the snippet if it's not at the beginning or end
    if (start > 0) {
      snippet = "..." + snippet;
    }
    if (end < content.length) {
      snippet = snippet + "...";
    }

    return snippet;
  }
}

export function isUuid(string) {
  if (typeof string !== "string") return false;
  return string.match(/^(\w{8}-\w{4}-\w{4}-\w{4}-\w{12}|\w{24,24})$/);
}
