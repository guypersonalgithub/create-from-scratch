type MeasureTimeArgs = {
  callback: () => void;
  customLog?: string;
};

export const measureTime = ({ callback, customLog = "Test" }: MeasureTimeArgs) => {
  console.time(customLog);
  callback();
  console.timeEnd(customLog);
};
