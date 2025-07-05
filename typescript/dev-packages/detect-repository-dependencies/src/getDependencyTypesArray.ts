import { getPackageJson, type DependencyType } from "@packages/package-json";

type GetDependencyTypesArrayArgs = {
  path: string;
};

export const getDependencyTypesArray = ({ path }: GetDependencyTypesArrayArgs) => {
  if (!path.endsWith("/package.json")) {
    return {};
  }

  const {
    name,
    dependencies = {},
    devDependencies = {},
    optionalDependencies = {},
    peerDependencies = {},
  } = getPackageJson({ folderPath: path.replace("/package.json", "") }) ?? {};

  if (!name) {
    return {};
  }

  const dependencyTypesArray: {
    dependencyType: DependencyType;
    data: Record<string, string>;
  }[] = [
    { dependencyType: "dependencies", data: dependencies },
    { dependencyType: "devDependencies", data: devDependencies },
    { dependencyType: "optionalDependencies", data: optionalDependencies },
    { dependencyType: "peerDependencies", data: peerDependencies },
  ];

  return { name, dependencyTypesArray };
};
