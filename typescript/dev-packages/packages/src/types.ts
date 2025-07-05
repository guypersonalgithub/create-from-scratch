export type LocalPackageMetadata = {
  path: string;
  name: string;
};

export type PackageLockPackages = Record<
  string,
  {
    resolved: string;
    link: boolean;
  }
>;

