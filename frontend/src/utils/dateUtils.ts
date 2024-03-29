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

const dateUtils = {
  parseTimestampToDate,
  convertDateToTimestamp,
};

export default dateUtils;
