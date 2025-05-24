type DrawRectangleArgs = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export const drawRectangle = ({ ctx, x, y, width, height, color }: DrawRectangleArgs) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
};
