type DrawLabelsArgs = {
  ctx: CanvasRenderingContext2D;
  stepsDifference: number;
  differenceRange: { min: number; max: number };
  startX: number;
  startY: number;
  distanceX: number;
  distanceY: number;
};

export const drawLabels = ({
  ctx,
  stepsDifference,
  differenceRange,
  startX,
  startY,
  distanceX,
  distanceY,
}: DrawLabelsArgs) => {
  const xPositions: Record<number, number> = {};
  const yPositions: Record<number, number> = {};

  for (let i = 0; i <= stepsDifference + 1; i++) {
    const num = i + 1;
    const x = distanceX * num + startX;

    xPositions[i] = x;

    ctx.fillText(`${i}`, x, startY - 20);
  }

  let yCounter = 0;
  for (let i = differenceRange.max; i >= differenceRange.min; i--) {
    yCounter++;
    const y = distanceY * yCounter + startY;

    yPositions[i] = y;

    ctx.fillText(`${i}`, startX - 20, y);
  }

  return { xPositions, yPositions };
};
