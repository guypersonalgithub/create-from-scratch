import { type ReactNode } from "react";

export type InnerSidebarContainerProps<T extends string> = InnerSidebarProps<T> & {
  className?: string;
  sidebarClassName?: string;
  content: ReactNode;
};

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
