import { createTSConfig } from "./createTSConfig";
import { TSConfig } from "./types";

type CreateRootTSConfigArgs = {
  path: string;
  jsxPackage?: boolean;
} & Partial<Pick<TSConfig, "compilerOptions" | "include" | "references">>;

export const createRootTSConfig = async ({
  path,
  jsxPackage,
  compilerOptions = {},
  include = [],
  references,
}: CreateRootTSConfigArgs) => {
  await createTSConfig({
    path,
    compilerOptions: {
      target: "ES2022",
      module: "ES2022",
      moduleResolution: "node",
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
      declaration: true,
      jsx: jsxPackage ? "react-jsx" : undefined,
      ...compilerOptions,
    },
    include: ["./src", "./packages/*", "./dev-packages/*", ...include],
    references,
  });
};
