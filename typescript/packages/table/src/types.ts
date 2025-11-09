import { type PaginationProps } from "@packages/pagination";
import { type CSSProperties, type ReactNode } from "react";

export type TableProps<T extends Record<string, unknown>> = {
  data?: T[];
  requestData?: {
    isLoading: boolean;
    isError: boolean;
    amountOfRows?: number;
  };
  onRowClick?: (data: T) => void;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  columns: Column<T>[];
  rows?: {
    headerRow?: Size | ClassName;
    dataRow?: Size | ClassName;
  };
  columnGap?: number;
  headerContainerClassName?: string;
  headerContainerStyle?: CSSProperties;
  rowContainerClassName?: string;
  rowContainerStyle?: CSSProperties;
  columnClassName?: (index: number) => string | undefined;
  columnStyle?: (index: number) => CSSProperties | undefined;
  dataRowClassName?: (data: T, index: number) => string | undefined;
  dataRowStyle?: (data: T, index: number) => CSSProperties | undefined;
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
  className?: never;
  size: number;
};

type ClassName = {
  className: string;
  size?: never;
};
