import { readFileSync } from "fs";
import { readFileAtRevision } from "./readFileAtRevision";

type CompareChangesInJsonsBetweenVersionsArgs = {
  filePath: string;
  objectProperties: string[];
};

export const compareChangesInJsonsBetweenVersions = async ({
  filePath,
  objectProperties,
}: CompareChangesInJsonsBetweenVersionsArgs) => {
  const previousVersion = await readFileAtRevision({ filePath, revision: "HEAD~1" });
  const currentVersion = JSON.parse(readFileSync(filePath, { encoding: "utf-8" }));

  for (let i = 0; i < objectProperties.length; i++) {
    const property = objectProperties[i];
    const previousProperty = previousVersion[property] ?? {};
    const currentProperty = currentVersion[property] ?? {};

    const previousAmount = Object.keys(previousProperty);
    const currentAmount = Object.keys(currentProperty);
    if (previousAmount !== currentAmount) {
      return true;
    }

    for (const prevPropety in previousProperty) {
      const prevValue = previousProperty[prevPropety];
      const currentValue = currentProperty[prevPropety];

      if (prevValue !== currentValue) {
        return true;
      }
    }
  }

  return false;
};
