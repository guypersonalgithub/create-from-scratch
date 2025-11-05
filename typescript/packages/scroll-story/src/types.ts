import type { CSSProperties, ReactNode } from "react";

export type SectionData = {
  id: string;
  className?: string;
  style?: CSSProperties;
  content: ReactNode;
};
