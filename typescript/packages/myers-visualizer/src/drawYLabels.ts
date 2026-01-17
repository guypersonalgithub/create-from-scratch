type DrawYLabelsArgs = {
  ctx: CanvasRenderingContext2D;
  newStr: string;
  startX: number;
  startY: number;
  distanceY: number;
  endX: number;
};

export const drawYLabels = ({
  ctx,
  newStr,
  startX,
  startY,
  distanceY,
  endX,
}: DrawYLabelsArgs) => {
    const newStrLength = newStr.length;

  for (let i = 0; i < newStrLength; i++) {
    const current = newStr[i];
    const num = i + 1;
    const y = distanceY * num + startY;

    ctx.fillText(current, startX - 20, y);

    if (i < newStrLength - 1) {
      ctx.fillText(`${num}`, endX + 20, y);
    }
  }
};
