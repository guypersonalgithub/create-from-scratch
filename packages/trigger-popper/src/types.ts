import { AnimationContainerWrapperProps } from "@packages/animation-container";
import { CSSProperties, ReactNode } from "react";

export type TriggerPopperDisplayProps = {
  id: string;
  content: ReactNode;
  style?: CSSProperties;
} & Partial<
  Pick<AnimationContainerWrapperProps, "onMount" | "onUnmount" | "mountOptions" | "unmountOptions">
>;
