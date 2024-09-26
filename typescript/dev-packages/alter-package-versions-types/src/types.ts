export type DependenciesToChange = Record<
  string,
  {
    dependencyType:
      | "dependencies"
      | "devDependencies"
      | "optionalDependencies"
      | "peerDependencies"; // TODO: Turn into a dedicated type and use throughout the repository if needed.
    dependency: string;
    newVersion: string;
  }[]
>;
