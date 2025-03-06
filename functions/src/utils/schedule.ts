import { addMinutes } from "date-fns";

export const buildRange = (startDate: Date, endDate: Date, interval: number) => {
  const range = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const end = addMinutes(currentDate, interval);
    range.push({ start: currentDate, end });
    currentDate = end;
  }
  return range;
};