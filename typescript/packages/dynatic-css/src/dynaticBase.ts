import { cssBase, type WithoutConfig } from "./cssBase";

export const dynatic = (strings: TemplateStringsArray, ...exprs: WithoutConfig["exprs"]) =>
  cssBase({ strings, exprs });
