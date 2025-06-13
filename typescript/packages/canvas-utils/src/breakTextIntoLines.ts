type BreakTextIntoLinesArgs = {
  ctx: CanvasRenderingContext2D;
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  lineHeight: number;
};

export const BreakTextIntoLinesArgs = ({
  ctx,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
}: BreakTextIntoLinesArgs) => {
  const words = text.split(" ");
  let line = "";
  let lineY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, lineY);
      line = words[i] + " ";
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, lineY);
};
