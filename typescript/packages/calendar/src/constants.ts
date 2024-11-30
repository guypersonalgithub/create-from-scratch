export const monthDetails = [
  { name: "", days: 0 },
  { name: "January", days: 31 },
  {
    name: "February",
    days: ({ year }: { year: number }) => {
      if (year % 4 === 0) {
        return 29;
      }

      return 28;
    },
  },
  { name: "March", days: 31 },
  { name: "April", days: 30 },
  { name: "May", days: 31 },
  { name: "June", days: 30 },
  { name: "July", days: 31 },
  { name: "August", days: 31 },
  { name: "September", days: 30 },
  { name: "October", days: 31 },
  { name: "November", days: 30 },
  { name: "December", days: 31 },
];

export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wedensday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
