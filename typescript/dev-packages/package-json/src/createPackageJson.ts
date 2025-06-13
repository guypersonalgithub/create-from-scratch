import { type PackageJson } from "./types";
import { writeFileSync } from "fs";

type CreatePackageJsonArgs = Omit<PackageJson, "version" | "private"> & {
  path: string;
  version?: string;
  privatePackage?: boolean;
};

export const createPackageJson = async ({
  path,
  name,
  version = "1.0.0",
  description,
  type = "module",
  privatePackage,
  workspaces = ["packages/*", "dev-packages/*"],
  scripts,
  author,
  license,
  main,
  module,
  types,
  exports,
  files,
  dependencies,
  devDependencies,
  peerDependencies,
  optionalDependencies,
}: CreatePackageJsonArgs) => {
  if (!path) {
    throw new Error("Missing package json path");
  }

  if (!name) {
    throw new Error("Missing package json name");
  }

  const packageJson: PackageJson = {
    name,
    version,
    description,
    type,
    private: privatePackage,
    workspaces,
    scripts,
    author,
    license,
    main,
    module,
    types,
    exports,
    files,
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies,
  };

  writeFileSync(path, JSON.stringify(packageJson, null, 2));
};
