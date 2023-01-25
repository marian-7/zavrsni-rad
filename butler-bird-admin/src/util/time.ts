import { toNumber } from "lodash";

export function time(hourFormat: number = 24) {
  let time = [];
  const minute = ["00", "30"];
  for (let i = 0; i <= hourFormat; i++) {
    for (let j = 0; j < minute.length; j++) {
      if (i >= hourFormat && j >= minute.length - 1) {
        continue;
      }
      if (i < 10) {
        time.push(`0${i}:${minute[j]}:00`);
      } else {
        time.push(`${i}:${minute[j]}:00`);
      }
    }
  }

  return time;
}

function separateUnits(time: string) {
  const [hours, minutes, seconds] = time.split(":");
  return {
    hours: toNumber(hours),
    minutes: toNumber(minutes),
    seconds: toNumber(seconds),
  };
}

export function isTimeBefore(time1: string, time2: string) {
  const t1 = separateUnits(time1);
  const t2 = separateUnits(time2);

  if (t1.hours < t2.hours) {
    return true;
  }
  if (t1.hours > t2.hours) {
    return false;
  }
  if (t1.minutes < t2.minutes) {
    return true;
  }
  if (t1.minutes > t2.minutes) {
    return false;
  }
  if (t1.seconds < t2.seconds) {
    return true;
  }
  if (t1.seconds > t2.seconds) {
    return false;
  }
  return false;
}

export function isTimeAfter(time1: string, time2: string) {
  const t1 = separateUnits(time1);
  const t2 = separateUnits(time2);

  if (t1.hours > t2.hours) {
    return true;
  }
  if (t1.hours < t2.hours) {
    return false;
  }
  if (t1.minutes > t2.minutes) {
    return true;
  }
  if (t1.minutes < t2.minutes) {
    return false;
  }
  if (t1.seconds > t2.seconds) {
    return true;
  }
  if (t1.seconds < t2.seconds) {
    return false;
  }
  return false;
}
