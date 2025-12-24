export type PieChartData = {
  label: string;
  value: number;
  color: string;
};

export type CalculatedSlice<T extends boolean | undefined> = {
  sliceAngle: number;
  startAngle: number;
  labelX?: number;
  labelY?: number;
} & (T extends true
  ? {
      sliceStart: number;
      sliceEnd: number;
    }
  : {
      sliceStart?: never;
      sliceEnd?: never;
    });

export type CachedCalculatedProperties =
  | {
      total: number;
      centerX: number;
      centerY: number;
      radius: number;
      calculatedSlices: CalculatedSlice<false>[];
    }
  | {
      total: number;
      centerX: number;
      centerY: number;
      radius: number;
      calculatedSlices: CalculatedSlice<true>[];
    };
