import dayjs from "dayjs";

export function getLocaleDate(dateTime: Date) {
  const time = dayjs(dateTime);

  return time.isToday()
    ? time
        .toDate()
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : time.toDate().toLocaleTimeString([], {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}
