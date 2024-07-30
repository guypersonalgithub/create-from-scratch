export type DependenciesMap = Record<
  string,
  Record<
    string,
    {
      version: string;
      belongsTo: string;
      dependencyType: string;
    }
  >
>;
