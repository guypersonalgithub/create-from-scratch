type DrawGraphAxesArgs = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  offset?: number;
};

export const drawGraphAxes = ({ ctx, width, height, offset = 0 }: DrawGraphAxesArgs) => {
  ctx.beginPath();
  ctx.moveTo(offset, 0);
  ctx.lineTo(offset, height - offset);
  ctx.lineTo(width, height - offset);
  ctx.stroke();
};
