import { calculateSquaredDifference } from "../calculateSquaredDifference";

type CalculateStandardDeviationArgs = {
  data: number[];
  standardDeviationType: "sample" | "population";
};

export const calculateStandardDeviation = ({
  data,
  standardDeviationType,
}: CalculateStandardDeviationArgs) => {
  const squaredDifferences = calculateSquaredDifference({ data });
  const squaredDifferencesSum = squaredDifferences.reduce((sum, current) => {
    return sum + current;
  }, 0);
  const divideBy = standardDeviationType === "sample" ? data.length - 1 : data.length;
  const variance = squaredDifferencesSum / divideBy;
  return Math.sqrt(variance);
};
