type PseudoClassHelperArgs = {
  line: string;
  pseudoClass?: string;
};

export const pseudoClassHelper = ({ line, pseudoClass }: PseudoClassHelperArgs) => {
  const pseudoClassIndex = line.indexOf(":");
  const originalClass = line.slice(0, pseudoClassIndex);
  if (originalClass !== "&") {
    return pseudoClass;
  }

  return line.slice(pseudoClassIndex, line.length - 1).trim();
};
