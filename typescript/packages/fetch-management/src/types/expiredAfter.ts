type TimeUnit = "seconds" | "minutes" | "hours" | "days";
export type ExpiredAfter = `never` | `${number} ${TimeUnit}`;
