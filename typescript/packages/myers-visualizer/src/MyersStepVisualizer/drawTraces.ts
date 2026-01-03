import type { Trace } from "./types";

type DrawTracesArgs = {
  ctx: CanvasRenderingContext2D;
  xPositions: Record<number, number>;
  yPositions: Record<number, number>;
  trace: Trace[];
  displayTraceLabels?: boolean;
  isSwitched: boolean;
  keepPathsOf: number[];
};

const linePadding = 20;

export const drawTraces = ({
  ctx,
  xPositions,
  yPositions,
  trace,
  displayTraceLabels,
  isSwitched,
  keepPathsOf,
}: DrawTracesArgs) => {
  const font = ctx.font;
  const match = font.match(/(\d+(?:\.\d+)?)px/);
  const fontSize = match ? Number(match[1]) : 0;
  const heightAddition = fontSize;
  const keptPaths = new Set<number>(keepPathsOf);

  trace.forEach((current, index) => {
    const { from, to, step } = current;

    const fromXPosition = xPositions[step];
    const toXPosition = xPositions[step + 1];
    const fromDifference = from.x - from.y;
    const toDifference = to.x - to.y;

    const isToDifferenceHigher = toDifference > fromDifference;

    const fromYPosition = yPositions[fromDifference];
    const toYPosition = yPositions[toDifference];

    if (displayTraceLabels) {
      const fromLabel = !isSwitched ? `${from.x},${from.y}` : `${from.x}`;
      const toLabel = !isSwitched ? `${to.x},${to.y}` : `${to.x}`;

      ctx.fillText(fromLabel, fromXPosition, fromYPosition);
      ctx.fillText(toLabel, toXPosition, toYPosition);
    }

    const addedPadding = !isToDifferenceHigher ? linePadding : 0;

    if (!isSwitched || (isSwitched && keptPaths.has(index))) {
      ctx.beginPath();
      ctx.moveTo(fromXPosition + linePadding, fromYPosition + addedPadding - heightAddition / 2);
      ctx.lineTo(toXPosition - linePadding, toYPosition - addedPadding + heightAddition / 3);
      ctx.stroke();
    }
  });
};
