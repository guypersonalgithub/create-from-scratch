type CalculateAverageArgs = {
  data: number[];
};

export const calculateAverage = ({ data }: CalculateAverageArgs) => {
  return (
    data.reduce((sum, current) => {
      return sum + current;
    }, 0) / data.length
  );
};
