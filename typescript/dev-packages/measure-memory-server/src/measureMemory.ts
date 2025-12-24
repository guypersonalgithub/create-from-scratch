type MeasureMemoryArgs = {
  callback: () => unknown;
};

export const measureMemory = ({ callback }: MeasureMemoryArgs) => {
  if (!global.gc) {
    throw "The garbage collector isn't available during the runtime, so measuring the memory is impossible.";
  }

  global.gc();
  const before = process.memoryUsage().heapUsed;
  const result = callback();

  global.gc();
  const after = process.memoryUsage().heapUsed;

  return {
    result,
    diff: after - before,
  };
};
