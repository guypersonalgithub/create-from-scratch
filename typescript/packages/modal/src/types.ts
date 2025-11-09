import { type CSSProperties, type ReactNode } from "react";

export type ModalDisplayProps = {
  id: string;
  content: ReactNode;
  className?: string;
  style?: CSSProperties;
};
