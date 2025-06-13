import { type AnimationContainerWrapperProps } from "@packages/animation-container";
import { type CSSProperties, type ReactNode } from "react";

export type TriggerPopperDisplayProps = {
  id: string;
  content: ReactNode;
  style?: CSSProperties;
} & Partial<
  Pick<AnimationContainerWrapperProps, "onMount" | "onUnmount" | "mountOptions" | "unmountOptions">
>;
