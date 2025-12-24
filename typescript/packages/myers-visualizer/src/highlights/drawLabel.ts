type DrawLabelArgs = {
  ctx: CanvasRenderingContext2D;
  label: string;
  highlightStartX: number;
  highlightStartY: number;
};

export const drawLabel = ({ ctx, label, highlightStartX, highlightStartY }: DrawLabelArgs) => {
  const previousFillStyle = ctx.fillStyle;
  ctx.fillStyle = "black";
  const measures = ctx.measureText(label);
  const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = measures;
  const height = actualBoundingBoxAscent + actualBoundingBoxDescent;

  const startLabelX = highlightStartX + 20;
  const startLabelY = highlightStartY - height * 2.5;

  ctx.beginPath();
  ctx.arc(startLabelX, startLabelY, Math.max(height, width), 0, 360);
  ctx.stroke();

  ctx.fillText(label, startLabelX, startLabelY + 1);
  ctx.fillStyle = previousFillStyle;
};
