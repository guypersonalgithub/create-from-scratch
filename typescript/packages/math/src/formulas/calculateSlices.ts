type CalculateSlicesArgs = {
  values: number[];
  offsetDeg?: number;
};

type Slice = { value: number; startAngle: number; endAngle: number };

export const calculateSlices = ({ values, offsetDeg = 0 }: CalculateSlicesArgs): Slice[] => {
  const total = values.reduce((a, b) => a + b, 0);
  const anglePerUnit = 360 / total;
  const slices: Slice[] = [];
  let currentAngle = offsetDeg;

  for (const value of values) {
    const startAngle = currentAngle;
    const endAngle = currentAngle + value * anglePerUnit;
    slices.push({ value, startAngle, endAngle });
    currentAngle = endAngle;
  }

  return slices;
};
