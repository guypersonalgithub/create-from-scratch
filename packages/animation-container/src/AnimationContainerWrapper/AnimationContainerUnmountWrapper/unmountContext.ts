import { createContext } from "react";

export const UnmountContext = createContext<{
  isUnmounted: boolean;
  finishedAnimation: () => void;
} | null>(null);
