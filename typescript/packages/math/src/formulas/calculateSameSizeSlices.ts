type CalculateSameSizeSlicesArgs = {
  slices: (string | number)[];
  rotationOffset?: number;
};

export const calculateSameSizeSlices = ({
  slices,
  rotationOffset = 0,
}: CalculateSameSizeSlicesArgs) => {
  const total = slices.length;

  return slices.map((slice, index) => {
    const sliceAngle = 360 / total;
    const start = Math.abs(index * sliceAngle + rotationOffset) % 360;
    const end = Math.abs((index + 1) * sliceAngle + rotationOffset) % 360;
    return { start, end, slice };
  });
};
