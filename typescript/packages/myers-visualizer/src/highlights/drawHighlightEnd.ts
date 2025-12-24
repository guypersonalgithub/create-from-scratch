type DrawHighlightEndArgs = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  startAngle?: number;
  endAngle?: number;
};

export const drawHighlightEnd = ({
  ctx,
  x,
  y,
  radius,
  startAngle = 0,
  endAngle = Math.PI * 2,
}: DrawHighlightEndArgs) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.fill();
  ctx.stroke();
};
