type ArePackageJsonDependenciesEqualArgs = {
  packageJson1: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };
  packageJson2: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };
};

export const arePackageJsonDependenciesEqual = ({
  packageJson1,
  packageJson2,
}: ArePackageJsonDependenciesEqualArgs) => {
  const {
    dependencies = {},
    devDependencies = {},
    optionalDependencies = {},
    peerDependencies = {},
  } = packageJson1;

  const {
    dependencies: dependencies2 = {},
    devDependencies: devDependencies2 = {},
    optionalDependencies: optionalDependencies2 = {},
    peerDependencies: peerDependencies2 = {},
  } = packageJson2;

  const equalDependencies = areEqualDependencies({ dependencies1: dependencies, dependencies2 });
  if (!equalDependencies) {
    return false;
  }

  const equalDevDependencies = areEqualDependencies({
    dependencies1: devDependencies,
    dependencies2: devDependencies2,
  });
  if (!equalDevDependencies) {
    return false;
  }

  const equalOptionalDependencies = areEqualDependencies({
    dependencies1: optionalDependencies,
    dependencies2: optionalDependencies2,
  });
  if (!equalOptionalDependencies) {
    return false;
  }

  const equalPeerDependencies = areEqualDependencies({
    dependencies1: peerDependencies,
    dependencies2: peerDependencies2,
  });
  if (!equalPeerDependencies) {
    return false;
  }

  return true;
};

type AreEqualDependenciesArgs = {
  dependencies1: Record<string, string>;
  dependencies2: Record<string, string>;
};

const areEqualDependencies = ({ dependencies1, dependencies2 }: AreEqualDependenciesArgs) => {
  const differentAmountOfDependencies =
    Object.keys(dependencies1).length !== Object.keys(dependencies2).length;
  if (differentAmountOfDependencies) {
    return false;
  }

  for (const property in dependencies1) {
    const dependencies1Version = dependencies1[property];
    const dependencies2Version = dependencies2[property];
    if (dependencies1Version !== dependencies2Version) {
      return false;
    }
  }

  return true;
};
