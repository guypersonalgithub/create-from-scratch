type ClearCanvasArgs = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
};

export const clearCanvas = ({ ctx, width, height }: ClearCanvasArgs) => {
  ctx.clearRect(0, 0, width, height);
};
