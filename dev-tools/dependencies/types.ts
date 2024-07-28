export type NPMRegistry = {
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
