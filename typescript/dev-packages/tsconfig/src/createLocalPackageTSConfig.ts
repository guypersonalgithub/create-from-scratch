import { createTSConfig } from "./createTSConfig";
import { type TSConfig } from "./types";

type CreateLocalPackageTSConfigArgs = {
  path: string;
} & Partial<Pick<TSConfig, "compilerOptions">>;

export const createLocalPackageTSConfig = async ({
  path,
  compilerOptions = {},
}: CreateLocalPackageTSConfigArgs) => {
  await createTSConfig({
    path,
    compilerOptions: {
      composite: true,
      declaration: true,
      declarationMap: true,
      emitDeclarationOnly: true,
      ...compilerOptions,
    },
    extends: "../../tsconfig.json",
  });
};
