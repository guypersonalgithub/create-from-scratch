import { TokenTypeOptions } from "./constants";
import { findNextBreakpoint } from "./utils";

export type BaseToken = {
  type: TokenTypeOptions;
  value: string;
};

type ContextValue = { variables: Set<string>; functions: Set<string> };
export type Context = Record<string, ContextValue> & { global: ContextValue };
export type CurrentLayeredContexts = ("definition" | "string")[];

export type BreakpointReturnType = ReturnType<typeof findNextBreakpoint>;
export type FlowReturnType = {
  newInput: string;
  updatedIndex: number;
  stop: boolean;
};

export type FlowCallback = () =>
  | {
      updatedIndex: number;
      stop: boolean;
    }
  | undefined;

export type OpenedContext = {
  name: string;
  type: "function" | "class" | "if";
};
