import type { ReactNode } from "react";

export type Tab = {
  label?: ReactNode;
  value: string;
  onClick?: (value: string) => void;
};
