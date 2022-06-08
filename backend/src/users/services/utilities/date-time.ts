/**
 * Generates an ISO 8601 date optionally with time appended. Timestring can use
 * ":" to make it a valid filename on Windows.
 * @param config.mode - The format to generate. ("YYYY-MM-DD", optionally with time "T12:00:00") appended.
 * @param config.date - The date to generate.
 * @param config.fileName - If true ":" is used instead of "-".
 * @returns ISO 8601 string
 */
export function dateTime({
  mode = "DATE",
  date = new Date(),
  fileName = false,
}: {
  mode: "DATETIME" | "DATE";
  date: Date;
  fileName?: boolean;
}): string {
  let timeString;
  let dateString;
  let resultString;
  const formatDelimiter = fileName ? "-" : ":";

  switch (mode) {
    case "DATETIME":
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
    case "DATE":
      dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      resultString = `${dateString}${resultString ? resultString : ""}`;
      break;
  }
  return resultString;
}

/** List matching english three-letter-abbreviations to zero-based indexes */
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

/** Converts a time string to hours as floating point number.
 * @param time - Time value in "HH:MM" format
 * @returns Hours as floating point number
 */
export function timeToHoursFloat(time: string): number {
  time = time === "" ? "00:00" : time;
  let float = 0;
  const hours = parseInt(time.split(":")[0]);
  const minutes = parseInt(time.split(":")[1]);
  float += hours;
  float += minutes / 60;
  return float;
}

/** Converts a floating point hours value to a time string.
 * @param floatHours - Hours as floating point number
 * @returns Time value in "HH:MM" format
 */
export function hoursFloatToTime(floatHours: number): string {
  let hours = Math.floor(floatHours);
  let minutes = 60 * (Math.round((floatHours - hours) * 10) / 10);
  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

/** Converts a floating point value and returns a float with precision 2,
 * @param number - Floating point value
 * @returns Number with precision 2; returns integers as-is
 */
export function onlyFloatToPrecision2(number: number): number {
  const precision2 = Math.round(number * 100) / 100;
  return number % 1 === 0 ? number : precision2;
}

/** Converts a string to floating point without returning NaN for empty strings.
 * @param string - Number value
 * @returns Floating point number or integer; 0 for empty strings
 */
export function parseFloatNaNSafe(string: string): number {
  return string !== "" ? parseFloat(string) : 0;
}
