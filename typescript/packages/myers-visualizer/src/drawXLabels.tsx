type DrawXLabelsArgs = {
  ctx: CanvasRenderingContext2D;
  oldStr: string;
  startX: number;
  startY: number;
  distanceX: number;
  endY: number;
};

export const drawXLabels = ({
  ctx,
  oldStr,
  startX,
  startY,
  distanceX,
  endY,
}: DrawXLabelsArgs) => {
  const oldStrLength = oldStr.length;

  for (let i = 0; i < oldStrLength; i++) {
    const current = oldStr[i];
    const num = i + 1;
    const x = distanceX * num + startX;

    ctx.fillText(current, x, startY - 20);

    if (i < oldStrLength - 1) {
      ctx.fillText(`${num}`, x, endY + 20);
    }
  }
};
