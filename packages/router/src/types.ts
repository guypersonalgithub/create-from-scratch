import { ReactElement } from "react";

export type RouterPaths = {
  [key: `/${string}`]: ReactElement | RouterPaths | RouterPathGuard;
  "404"?: ReactElement | RouterPaths | RouterPathGuard;
};

export type RouterPathGuard = () => ReactElement | RouterPaths;
