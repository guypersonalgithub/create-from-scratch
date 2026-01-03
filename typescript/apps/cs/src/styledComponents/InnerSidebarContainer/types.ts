import { type ReactNode } from "react";

export type InnerSidebarItem<T extends string> = {
  value: T;
  label: ReactNode;
};

export type InnerSidebarProps<T extends string> = {
  className?: string;
  items: InnerSidebarItem<T>[];
  current: T;
  onClick: (pick: T) => void;
};
