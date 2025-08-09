import { hashString } from "@packages/dynatic-css-hash";
import { insertStaticRuleIfNeeded } from "./insertStaticRuleIfNeeded";

type ParseLineArgs = {
  line: string;
  classNames: string[];
};

export const parseLine = ({ line, classNames }: ParseLineArgs) => {
  const trimmed = line.trim();
  if (!trimmed) {
    return;
  }

  parse({ line: trimmed, classNames });
};

type ParseArgs = {
  line: string;
  classNames: string[];
};

export const parse = ({ line, classNames }: ParseArgs) => {
  const hash = hashString({ input: line });
  const fullClassName = `css-${hash}`;
  classNames.push(fullClassName);
  insertStaticRuleIfNeeded({ hash: fullClassName, rule: line });
};
