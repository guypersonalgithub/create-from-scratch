type SplitCircularDependencyPathArgs = {
  problematicPath: string;
};

export const getCurrentCircularDependencyPackageName = ({
  problematicPath,
}: SplitCircularDependencyPathArgs) => {
  const splitProblematicPath = problematicPath.split("->");
  const packageName = splitProblematicPath[splitProblematicPath.length - 1].trim();

  return {
    packageName,
    splitProblematicPath,
  };
};
