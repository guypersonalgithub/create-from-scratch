type DescendantSelectorHelperArgs = {
  line: string;
  descendantSelector?: string;
};

export const descendantSelectorHelper = ({
  line,
  descendantSelector,
}: DescendantSelectorHelperArgs) => {
  if (!line.startsWith(".")) {
    return descendantSelector;
  }

  return line.slice(0, line.length - 1).trim();
};
