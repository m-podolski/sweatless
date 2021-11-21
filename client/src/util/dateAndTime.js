// Date
export const months = [
  [0, "Jan"],
  [1, "Feb"],
  [2, "Mar"],
  [3, "Apr"],
  [4, "May"],
  [5, "Jun"],
  [6, "Jul"],
  [7, "Aug"],
  [8, "Sep"],
  [9, "Oct"],
  [10, "Nov"],
  [11, "Dec"],
];

/**
 * Returns an ISO 8601 date (YYYY-MM-DD) optionally with time (e.g. T12:00:00)
 * appended. If optional second argument "fileFormat" is true the timestring
 * uses ("-" instead of ":") to make it a valid filename on Windows
 */
export function dateTime(mode, fileFormat = false, date = new Date()) {
  let timeString;
  let dateString;
  let resultString;
  const formatDelimiter = fileFormat ? "-" : ":";

  switch (mode) {
    case "dateTime":
      timeString = `T${date
        .getHours()
        .toString()
        .padStart(2, "0")}${formatDelimiter}${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}${formatDelimiter}${date
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
      resultString = timeString;
    // fall through
    case "date":
      dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      resultString = `${dateString}${resultString ? resultString : ""}`;
      break;
    default:
      throw new Error("Missing or incorrect argument 'mode'");
  }
  return resultString;
}

// Time conversion

/** Takes a "." or "," delimited string hours value and returns time (HH:MM) */
export function hoursDec2ToTime(decimalHours) {
  const splitValue = decimalHours.replace(",", ".").split(".");
  const minutes = Math.round(
    60 * (decimalHours.replace(",", ".") - splitValue[0]),
  )
    .toString()
    .padStart(2, "0");
  return `${splitValue[0]}:${minutes}`;
}

/** Takes a floating point hours value and returns time (HH:MM) */
export function hoursFloatToTime(floatHours) {
  let hours = Math.floor(floatHours);
  let minutes = 60 * (Math.round((floatHours - hours) * 10) / 10);
  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

/** Takes a 3-digit minutes value and returns time (HH:MM) */
export function minutesToTime(minutes) {
  const minutesRest = minutes % 60;
  const fullHours = (minutes - minutesRest) / 60;
  const minutesPad = minutesRest.toString().padStart(2, "0");
  return `${fullHours}:${minutesPad}`;
}

/** Takes a time string value and returns hours as float */
export function timeToHoursFloat(time) {
  time = time === "" ? "00:00" : time;
  let float = 0;
  const hours = parseInt(time.split(":")[0]);
  const minutes = parseInt(time.split(":")[1]);
  float += hours;
  float += minutes / 60;
  return float;
}

// Value conversion

/** Takes a string value and returns 0 for empty strings */
export function parseFloatNaNSafe(string) {
  return string !== "" ? parseFloat(string) : 0;
}

/** Takes a float value and returns float with 2 decimal places,
 * returns integers as-is */
export function onlyFloatToDec2(number) {
  const toDecPlaces2 = Math.round(number * 100) / 100;
  return number % 1 === 0 ? number : toDecPlaces2;
}
