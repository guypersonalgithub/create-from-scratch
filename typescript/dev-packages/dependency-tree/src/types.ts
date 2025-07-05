export type DependencyTree = {
  [key: string]: DependencyTree | undefined;
};

export type DependenciesProperties = Record<
  string,
  Record<string, { belongsTo: string[]; dependencies: Record<string, string> }>
>;
