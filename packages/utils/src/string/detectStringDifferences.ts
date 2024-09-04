type DetectStringDifferencesArgs = {
  oldStr: string;
  newStr: string;
};

export const detectStringDifferences = ({ oldStr, newStr }: DetectStringDifferencesArgs) => {
  const oldLines = oldStr.split("\n");
  const newLines = newStr.split("\n");

  let oldIndex = 0;
  let newIndex = 0;

  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    const oldLine = oldLines[oldIndex] || "";
    const newLine = newLines[newIndex] || "";

    if (oldLine === newLine) {
      oldIndex++;
      newIndex++;
    } else {
      let linesChanged = false;

      if (
        oldIndex < oldLines.length &&
        (newIndex >= newLines.length || oldLines[oldIndex] !== newLines[newIndex])
      ) {
        console.log(`Line ${oldIndex + 1} (Removed): ${oldLines[oldIndex]}`);
        oldIndex++;
        linesChanged = true;
      }

      if (
        newIndex < newLines.length &&
        (oldIndex >= oldLines.length || oldLines[oldIndex] !== newLines[newIndex])
      ) {
        console.log(`Line ${newIndex + 1} (Added): ${newLines[newIndex]}`);
        newIndex++;
        linesChanged = true;
      }

      if (linesChanged) {
        continue;
      }
    }
  }
};
