type InitializeBordersArgs = {
  ctx: CanvasRenderingContext2D;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export const initializeBorders = ({ ctx, startX, startY, endX, endY }: InitializeBordersArgs) => {
  ctx.beginPath();
  ctx.moveTo(startX, startY - 25);
  ctx.lineTo(startX, endY + 25);
  ctx.moveTo(startX - 25, startY);
  ctx.lineTo(endX + 25, startY);
  ctx.fillStyle = "red";
  ctx.fillText("Depth(steps)", startX + 40, startY - 40);
  ctx.fillText("K(x - y)", startX + 50, endY);
  ctx.fillStyle = "black";
  ctx.stroke();
};
