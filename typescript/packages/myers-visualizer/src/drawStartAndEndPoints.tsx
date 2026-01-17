type DrawStartAndEndPointsArgs = {
  ctx: CanvasRenderingContext2D;
  oldStr: string;
  newStr: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export const drawStartAndEndPoints = ({
  ctx,
  oldStr,
  newStr,
  startX,
  startY,
  endX,
  endY,
}: DrawStartAndEndPointsArgs) => {
  ctx.fillText("0,0", startX - 20, startY - 10);
  ctx.fillText(`${oldStr.length},${newStr.length}`, endX + 20, endY + 10);
};
