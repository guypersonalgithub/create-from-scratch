import type { CSSProperties } from "react";

export type RadioOptionProps = {
  label: string;
  value: string;
  selected: boolean;
  onChange: (value: string) => void;
  labelClassName?: string;
  labelStyle?: CSSProperties;
};
