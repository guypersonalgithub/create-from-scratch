import { PaginationProps } from "@packages/pagination";
import { CSSProperties, ReactNode } from "react";

export type TableProps<T extends Record<string, unknown>> = {
  data?: T[];
  requestData?: {
    isLoading: boolean;
    isError: boolean;
    amountOfRows?: number;
  };
  onRowClick?: (data: T) => void;
  columns: Column<T>[];
  rows?: {
    headerRow?: Size | ClassName;
    dataRow?: Size | ClassName;
  };
  columnGap?: number;
  headerContainer?: CSSProperties;
  rowContainer?: CSSProperties;
  dataRowStyle?: (data: T, index: number) => CSSProperties;
  dataRowClass?: (data: T, index: number) => string;
  pagination?: {
    paginationProps: Omit<PaginationProps, "totalPages">;
    rowsPerPage: number;
  };
};

export type Column<T extends Record<string, unknown>> = {
  header: (() => ReactNode) | ReactNode;
  cell: (data: T, index: number) => ReactNode;
  staticColumn?: boolean;
} & (Size | ClassName);

type Size = {
  size: number;
  className?: never;
};

type ClassName = {
  size?: never;
  className: string;
};
