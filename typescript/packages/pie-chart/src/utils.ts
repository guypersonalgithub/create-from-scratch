import { calculatePieSliceAngleThroughValue } from "@packages/math";
import type { CalculatedSlice, PieChartData } from "./types";

type CalculateBasicPropertiesArgs<T extends boolean | undefined> = {
  data: PieChartData[];
  width: number;
  height: number;
  staggered?: T;
  includeLabels?: boolean;
};

export const calculateBasicProperties = <T extends boolean | undefined>({
  data,
  width,
  height,
  staggered,
  includeLabels,
}: CalculateBasicPropertiesArgs<T>) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 10;

  let startAngle = 0;

  if (!staggered) {
    const calculatedSlices: CalculatedSlice<false>[] = [];

    data.forEach((item) => {
      const sliceAngle = calculatePieSliceAngleThroughValue({ value: item.value, total });
      const midAngle = startAngle + sliceAngle / 2;

      if (includeLabels) {
        const labelX = centerX + (radius / 1.5) * Math.cos(midAngle);
        const labelY = centerY + (radius / 1.5) * Math.sin(midAngle);

        calculatedSlices.push({ sliceAngle, startAngle, labelX, labelY });
      } else {
        calculatedSlices.push({ sliceAngle, startAngle });
      }
      startAngle += sliceAngle;
    });

    return {
      total,
      centerX,
      centerY,
      radius,
      calculatedSlices,
    };
  }

  const calculatedSlices: CalculatedSlice<true>[] = [];
  const totalSlicesUntilCurrentSum: number[] = [];

  data.forEach((item, index) => {
    const sliceAngle = calculatePieSliceAngleThroughValue({ value: item.value, total });
    const totalSum =
      index === 0 ? 0 : totalSlicesUntilCurrentSum[index - 1] + data[index - 1].value;
    const sliceStart = totalSum / total;
    const sliceEnd = sliceStart + item.value / total;
    const midAngle = startAngle + sliceAngle / 2;

    if (includeLabels) {
      const labelX = centerX + (radius / 1.5) * Math.cos(midAngle);
      const labelY = centerY + (radius / 1.5) * Math.sin(midAngle);

      calculatedSlices.push({
        sliceAngle,
        sliceStart,
        sliceEnd,
        startAngle,
        labelX,
        labelY,
      });
    } else {
      calculatedSlices.push({
        sliceAngle,
        sliceStart,
        sliceEnd,
        startAngle,
      });
    }

    startAngle += sliceAngle;

    totalSlicesUntilCurrentSum.push(totalSum);
  });

  return {
    total,
    centerX,
    centerY,
    radius,
    calculatedSlices,
  };
};

type DrawSliceSeparatorsArgs = {
  centerX: number;
  centerY: number;
  radius: number;
  angle: number;
  ctx: CanvasRenderingContext2D;
};

export const drawSliceSeparators = ({ centerX, centerY, radius, angle, ctx }: DrawSliceSeparatorsArgs) => {
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(x, y);
  ctx.stroke();
};
