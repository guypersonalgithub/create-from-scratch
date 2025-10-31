import { detectArrayEnd } from "@packages/dynatic-css-typescript-parser";
import { replaceSubstring } from "@packages/string-utils";

type UpdateClassesArgs = {
  fileText: string;
  staticClasses: string[];
};

export const updateClasses = ({ fileText, staticClasses }: UpdateClassesArgs) => {
  const classesIdentifier = "const classes: string[] = [";
  const startIndex = fileText.indexOf(classesIdentifier);

  if (startIndex !== -1) {
    const updatedStart = startIndex + classesIdentifier.length - 1;

    const { endIndex } = detectArrayEnd({
      input: fileText,
      startIndex: updatedStart + 1,
    });

    const updatedFileText = replaceSubstring({
      str: fileText,
      from: updatedStart,
      to: endIndex + 1,
      newStr: `[${staticClasses.map((className) => `"${className}"`).join(", ")}]`,
    });

    return updatedFileText;
  }

  return fileText;
};
