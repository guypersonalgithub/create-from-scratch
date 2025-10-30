type SplitCombinedTemplateArgs = {
  combinedTemplate: string;
};

export const splitCombinedTemplate = ({ combinedTemplate }: SplitCombinedTemplateArgs) => {
  const cssLines: string[] = [];
  let startIndex = 0;

  for (let i = 0; i < combinedTemplate.length; i++) {
    const current = combinedTemplate[i];
    if (current === ";") {
      cssLines.push(combinedTemplate.slice(startIndex, i));
      startIndex = i + 1;
    } else if (current === "{" || current === "}") {
      cssLines.push(combinedTemplate.slice(startIndex, i + 1));
      startIndex = i + 1;
    }
  }

  cssLines.push(combinedTemplate.slice(startIndex));

  return cssLines;
};
