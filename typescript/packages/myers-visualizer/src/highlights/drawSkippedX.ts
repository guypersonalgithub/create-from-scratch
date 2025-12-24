type DrawSkippedXArgs = {
  ctx: CanvasRenderingContext2D;
  firstX: number;
  firstY: number;
  secondX: number;
  secondY: number;
  firstEnd: number;
  secondEnd: number;
};

export const drawSkippedX = ({
  ctx,
  firstX,
  firstY,
  secondX,
  secondY,
  firstEnd,
  secondEnd,
}: DrawSkippedXArgs) => {
  ctx.beginPath();
  ctx.moveTo(firstX, firstY);
  ctx.lineTo(secondX, firstEnd);
  ctx.moveTo(secondX, secondY);
  ctx.lineTo(firstX, secondEnd);
  ctx.stroke();
};
