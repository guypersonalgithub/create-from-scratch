import { createClassName, hashString } from "@packages/dynatic-css-utils";
import { insertStaticRuleIfNeeded } from "./insertStaticRuleIfNeeded";

type ParseLineArgs = {
  line: string;
  classNames: string[];
  pseudoClass?: string;
  mediaQuery?: string;
};

export const parseLine = ({ line, classNames, pseudoClass, mediaQuery }: ParseLineArgs) => {
  const trimmed = line.trim();
  if (!trimmed) {
    return;
  }

  const fullLine = createClassName({ value: line, pseudoClass, mediaQuery });
  const hash = hashString({ input: fullLine });
  const className = `css-${hash}`;
  const fullClassName = pseudoClass ? `${className}${pseudoClass}` : className;
  classNames.push(className);
  insertStaticRuleIfNeeded({ hash: fullClassName, rule: line, mediaQuery });
};
