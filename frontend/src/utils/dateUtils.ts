const parseTimestampToDate = (timestamp: number) => {
  const date = new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Singapore",
  });

  return date;
};

const convertDateToTimestamp = (date: string | Date) => {
  if (typeof date === "string") {
    date = new Date(date);

    // adjust the time zone to Singapore time
    date.setHours(date.getHours() - 8);
  }

  const timestamp = date.getTime();
  return timestamp;
};

const toLocalISOString = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(date.getTime() - offset);
  return adjustedDate.toISOString().slice(0, 16);
};

const dateUtils = {
  parseTimestampToDate,
  convertDateToTimestamp,
  toLocalISOString,
};

export default dateUtils;
