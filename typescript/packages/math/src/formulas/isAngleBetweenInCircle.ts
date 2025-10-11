type isAngleBetweenInCircleArgs = {
  angle: number;
  start: number;
  end: number;
};

export const isAngleBetweenInCircle = ({ angle, start, end }: isAngleBetweenInCircleArgs) => {
  if (start > end) {
    return angle >= start || angle <= end;
  }

  return start <= angle && angle <= end;
};
