interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface Performance {
  memory?: PerformanceMemory;
}

const getHeapUsed = () => {
  return (performance as Performance).memory?.usedJSHeapSize;
};

type MeasureMemoryArgs = {
  callback: () => unknown;
};

export const measureMemory = ({ callback }: MeasureMemoryArgs) => {
  const before = getHeapUsed();
  const result = callback();
  const after = getHeapUsed();

  console.log(performance);

  return {
    result,
    bytes: (after ?? 0) - (before ?? 0),
  };
};
