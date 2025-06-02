type MeasureTimeValueArgs = {
  callback: () => void;
};

export const measureTimeValue = ({ callback }: MeasureTimeValueArgs) => {
  const start = performance.now();

  callback();

  const end = performance.now();
  const duration = end - start;
  return duration;
};
