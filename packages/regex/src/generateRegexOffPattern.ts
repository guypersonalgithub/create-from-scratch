type GenerateRegexOffPatternArgs = {
  pattern?: string;
  divider: string;
};

export const generateRegexOffPattern = ({ pattern, divider }: GenerateRegexOffPatternArgs) => {
  if (!pattern) {
    return;
  }

  let regexStr = "^"; // Start of string anchor

  for (let i = 0; i < pattern.length; i++) {
    if (pattern.slice(i, i + 2) === "**") {
      let nextIndex = i + 2;
      let nextChar = "";
      while (nextIndex < pattern.length && pattern[nextIndex] !== divider) {
        nextChar += pattern[nextIndex];
        nextIndex++;
      }
      const escapedDivider = new RegExp(`\\${divider}`, "g");
      regexStr += `.*${nextChar ? nextChar.replace(escapedDivider, `\\${divider}`) : ""}`;
      i = nextIndex - 1;
    } else if (pattern[i] === "*") {
      // Match any character except divider
      regexStr += `[^${divider}]*`;
    } else {
      regexStr += pattern[i].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special regex characters
    }
  }

  regexStr += "$"; // End of string anchor
  return new RegExp(regexStr);
};
