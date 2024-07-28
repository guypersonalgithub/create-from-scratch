export type ConfigProperties = {
  include?: string[];
  exclude?: string[];
  includeFilesPattern?: string;
  excludeFilesPattern?: string;
  noNesting?: boolean;
};

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
