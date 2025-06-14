import { type TokenTypeOptions } from "./constants";
import { type findNextBreakpoint } from "./utils";

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
      hasArrow?: boolean;
      hasFunction?: boolean;
    }
  | undefined;

export type TypeFlowCallback = () =>
  | {
      updatedIndex: number;
      stop: boolean;
      missingTypeInObject?: boolean;
    }
  | undefined;

export type OpenedContext = {
  name: string;
  type: "function" | "class" | "if";
};
