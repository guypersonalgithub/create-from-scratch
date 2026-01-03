const inserted = new Set<string>();
const preexisting = new Set<string>();
const dynamicMediaQueries = new Map<string, string>();
let mediaQuerylessTextContent = "";

let styleTag: HTMLStyleElement;

try {
  if (document) {
    styleTag = document.createElement("style");
    document.head.appendChild(styleTag);
  }
} catch (error) {}

type InitializePreexistingClassesArgs = {
  classes?: string[];
};

export const initializePreexistingClasses = ({ classes }: InitializePreexistingClassesArgs) => {
  if (!classes) {
    return;
  }

  classes.forEach((hash) => preexisting.add(hash));
};

type InsertStaticRuleIfNeededArgs = {
  hash: string;
  rule: string;
  mediaQuery?: string;
};

export const insertStaticRuleIfNeeded = ({
  hash,
  rule,
  mediaQuery,
}: InsertStaticRuleIfNeededArgs) => {
  if (inserted.has(hash) || preexisting.has(hash)) {
    return;
  }

  inserted.add(hash);
  const value = `.${hash} { ${rule} }\n`;

  if (!mediaQuery) {
    mediaQuerylessTextContent += value;
  } else if (mediaQuery) {
    const current = dynamicMediaQueries.get(mediaQuery) ?? "";
    dynamicMediaQueries.set(mediaQuery, `${current}${value}`);
  }

  styleTag.textContent = mediaQuerylessTextContent;

  for (const [key, value] of dynamicMediaQueries.entries()) {
    styleTag.textContent += `${key} { ${value} }\n`;
  }
};

type InsertDescendantSelectorIfNeededArgs = {
  rule: string;
  descendantSelector: string;
};

export const insertDescendantSelectorIfNeeded = ({
  rule,
  descendantSelector,
}: InsertDescendantSelectorIfNeededArgs) => {
  if (inserted.has(rule) || preexisting.has(rule)) {
    return;
  }

  inserted.add(rule);

  const value = `${descendantSelector} { ${rule} }\n`;
  mediaQuerylessTextContent += value;
  styleTag.textContent = mediaQuerylessTextContent;
};
