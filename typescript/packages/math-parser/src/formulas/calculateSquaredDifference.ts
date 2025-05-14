import { calculateAverage } from "./calculateAverage";

type CalculateSquaredDifferenceArgs = {
  data: number[];
};

export const calculateSquaredDifference = ({ data }: CalculateSquaredDifferenceArgs) => {
  const average = calculateAverage({ data });

  return data.map((value) => {
    const difference = value - average;
    return Math.pow(difference, 2);
  });
};
