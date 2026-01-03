import { createClassName, hashString } from "@packages/dynatic-css-utils";
import { insertDescendantSelectorIfNeeded, insertStaticRuleIfNeeded } from "./insertStaticRuleIfNeeded";

type ParseLineArgs = {
  line: string;
  classNames: string[];
  pseudoClass?: string;
  mediaQuery?: string;
  descendantSelector?: string;
};

export const parseLine = ({
  line,
  classNames,
  pseudoClass,
  mediaQuery,
  descendantSelector,
}: ParseLineArgs) => {
  const trimmed = line.trim();
  if (!trimmed) {
    return;
  }

  if (descendantSelector) {
    return insertDescendantSelectorIfNeeded({ rule: line, descendantSelector });
  }

  const fullLine = createClassName({ value: line, pseudoClass, mediaQuery });
  const hash = hashString({ input: fullLine });
  const className = `css-${hash}`;
  const fullClassName = pseudoClass ? `${className}${pseudoClass}` : className;
  classNames.push(className);
  insertStaticRuleIfNeeded({ hash: fullClassName, rule: line, mediaQuery });
};
