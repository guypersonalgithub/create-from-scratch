export type DependenciesMap = Record<
  string,
  {
    data: Record<
      string,
      {
        version: string;
        belongsTo: string;
        dependencyType: string;
      }
    >;
    isLocal: boolean;
  }
>;

export type NPMRegistry = {
  author: {
    name: string;
  };
  bugs: {
    url: string;
  };
  description: string;
  "dist-tags": Record<string, string>;
  homepage: string;
  keywords: string[];
  license: string;
  maintainers: {
    name: string;
    email: string;
  }[];
  name: string;
  readme: string;
  readmeFilename: string;
  repository: {
    url: string;
    type: string;
    directory: string;
  };
  time: {
    [key: string]: string;
    created: string;
    modified: string;
  };
  users: Record<string, boolean>;
  versions: Record<string, NPMRegistryVersion>;
};

export type NPMRegistryVersion = {
  name: string;
  version: string;
  keywords: string[];
  author: { name: string };
  license: string;
  _id: string;
  homepage: string;
  bugs: { url: string };
  bin: { tsc: string; tsserver: string };
  dist: {
    shasum: string;
    tarball: string;
    fileCount: number;
    integrity: string;
    signatures: unknown[];
    unpackedSize: number;
  };
  main: string;
  _from: string;
  volta: { npm: string; node: string };
  browser: Record<string, boolean>;
  engines: { node: string };
  gitHead: string;
  scripts: Record<string, string>;
  typings: string;
  _npmUser: { name: string; email: string };
  _resolved: string;
  overrides: { "typescript@*": string };
  _integrity: string;
  repository: {
    url: string;
    type: string;
  };
  _npmVersion: string;
  description: string;
  directories: {};
  _nodeVersion: string;
  _hasShrinkwrap: boolean;
  packageManager: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  optionalDependencies: Record<string, string>;
  _npmOperationalInternal: {
    tmp: string;
    host: string;
  };
};

export type LatestVersion = {
  name: string;
  version: string;
  date: string;
}[];
