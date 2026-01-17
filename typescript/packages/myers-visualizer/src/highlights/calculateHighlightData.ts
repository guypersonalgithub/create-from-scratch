import type { Highlight } from "../types";
import { calculateSkippedData } from "./calculateSkippedData";

// TODO: Replace this with @packages/utils' types version, once the types is extracted into a dev-package of its own.
type AllPropertiesOfType<T, N> = {
  [K in keyof T]: N;
};

type CalculateAdditionArgs = {
  highlight: Highlight;
};

const calculateAddition = ({ highlight }: CalculateAdditionArgs) => {
  const { from, to } = highlight;

  const xDifference = to.x - from.x;
  const yDifference = to.y - from.y;

  const noXDifference = xDifference === 0;
  const noYDifference = yDifference === 0;

  const isDiagonal = !noXDifference && !noYDifference;

  if (isDiagonal) {
    return 0.5;
  }

  if (noYDifference) {
    return 0;
  }

  return -0.8;
};

type SkippedReturnType = ReturnType<typeof calculateSkippedData>;

type CalculateHighlightDataArgs = {
  highlight: Highlight;
  startX: number;
  startY: number;
  distanceX: number;
  distanceY: number;
};

type FunctionReturnType = {
  skipped?: boolean;
  label?: string;
  endComment?: string;
  color?: string;
  highlightStartX: number;
  highlightStartY: number;
  endX: number;
  endY: number;
} & (
  | ({
      skipped: true;
    } & SkippedReturnType)
  | ({
      skipped?: false | never;
    } & Partial<AllPropertiesOfType<SkippedReturnType, never>>)
);

export const calculateHighlightData = ({
  highlight,
  startX,
  startY,
  distanceX,
  distanceY,
}: CalculateHighlightDataArgs): FunctionReturnType => {
  const { from, to, skipped, label, color, endComment } = highlight;

  const yAddition = calculateAddition({ highlight });

  const highlightStartX = startX + from.x * distanceX + 0.5;
  const highlightStartY = startY + from.y * distanceY + yAddition;
  const endX = startX + to.x * distanceX + 0.5;
  const endY = startY + to.y * distanceY + yAddition;

  if (skipped) {
    const data = calculateSkippedData({
      distanceX,
      from,
      to,
      highlightStartX,
      highlightStartY,
      endX,
      endY,
    });

    return { skipped, label, endComment, color, highlightStartX, highlightStartY, endX, endY, ...data };
  }

  return { skipped, label, endComment, color, highlightStartX, highlightStartY, endX, endY };
};
