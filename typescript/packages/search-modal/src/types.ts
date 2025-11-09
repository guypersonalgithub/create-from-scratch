import type { CSSProperties } from "react";

export type SearchModalProps = {
  buttonClassName?: string;
  buttonStyle?: CSSProperties;
  badgeClassName?: string;
  badgeStyle?: CSSProperties;
  modalClassName?: string;
  modalStyle?: CSSProperties;
  optionClassName?: string;
  optionStyle?: CSSProperties;
  highlightedOptionClassName?: string;
  highlightedOptionStyle?: CSSProperties;
  footerClassName?: string;
  footerStyle?: CSSProperties;
  isMinimized?: boolean;
  minimizedClassName?: string;
  minimizedStyle?: CSSProperties;
  options: SearchModalOption[];
  onPickCallback: (arg: { value: string }) => void;
};

export type SearchModalOption = {
  value: string;
  label: string;
  description?: string;
};

export type PickOptionArgs = {
  value: string;
};
