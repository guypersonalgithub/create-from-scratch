import { TokenTypeOptions } from "./constants";

export type BaseToken = {
  type: TokenTypeOptions;
  value: string;
};

export type OpenedContextsIdentation = {
  identiation: number;
  childrenIdentiation: number;
}