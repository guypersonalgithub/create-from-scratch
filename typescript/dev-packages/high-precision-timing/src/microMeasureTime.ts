type MicroMeasureTimeArgs = {
  callback: () => void;
  customLog?: string;
};

export const microMeasureTime = ({
  callback,
  customLog = "The received callback took",
}: MicroMeasureTimeArgs) => {
  const start = process.hrtime.bigint();
  callback();
  const end = process.hrtime.bigint();
  console.log(`${customLog}: ${(Number(end - start) / 1_000_000).toFixed(2)}ms`);
};
