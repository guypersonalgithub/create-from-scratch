import { type CSSProperties, type ReactElement, type ReactNode } from "react";

export type RouterPaths = {
  [key: `/${string}`]: ReactElement | RouterPaths | RouterPathGuard;
  "404"?: ReactElement | RouterPaths | RouterPathGuard;
};

export type RouterPathGuard = () => ReactElement | RouterPaths;

export type RouterProps = {
  paths: RouterPaths;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
};

export type RouterContentProps = {
  passedPath: string;
  paths: RouterPaths;
  route: ReactNode;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
};
