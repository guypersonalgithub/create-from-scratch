const inserted = new Set<string>();
const preexisting = new Set<string>();

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
};

export const insertStaticRuleIfNeeded = ({ hash, rule }: InsertStaticRuleIfNeededArgs) => {
  if (inserted.has(hash) || preexisting.has(hash)) {
    return;
  }

  inserted.add(hash);
  styleTag.textContent += `.${hash} { ${rule} }\n`;
};
