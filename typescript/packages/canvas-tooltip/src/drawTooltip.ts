export type DrawTooltipArgs = {
  id: string;
  ctx: CanvasRenderingContext2D;
  text: string;
  x: number;
  y: number;
  padding?: number;
  fontSize?: number;
  textBaseline?: CanvasTextBaseline;
  font?: string;
  backgroundColor?: string;
  color?: string;
  opacity?: number;
};

export const drawTooltip = ({
  ctx,
  text,
  x,
  y,
  padding = 6,
  fontSize = 14,
  textBaseline = "top",
  font = "sans-serif",
  backgroundColor = "rgba(0, 0, 0, 0.75)",
  color = "white",
  opacity = 1,
}: DrawTooltipArgs) => {
  const previousFont = ctx.font;
  const previousBaseline = ctx.textBaseline;
  ctx.font = `${fontSize}px ${font}`;
  ctx.textBaseline = textBaseline;

  const textMetrics = ctx.measureText(text);
  const width = textMetrics.width + padding * 2;
  const height = fontSize + padding;

  ctx.globalAlpha = opacity;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fillText(text, x + padding, y + padding / 2);
  ctx.globalAlpha = 1;
  ctx.font = previousFont;
  ctx.textBaseline = previousBaseline;
};
