import { type CSSProperties, type ReactElement, type ReactNode } from "react";

export type RouterPaths = {
  [key: `/${string}`]: ReactElement | RouterPaths | RouterPathGuard;
  "404"?: ReactElement | RouterPaths | RouterPathGuard;
};

export type RouterPathGuard = () => ReactElement | RouterPaths;

export type RouterProps = {
  paths: RouterPaths;
  wrapperStyle?: CSSProperties;
};

export type RouterContentProps = {
  passedPath: string;
  paths: RouterPaths;
  route: ReactNode;
  wrapperStyle?: CSSProperties;
};
