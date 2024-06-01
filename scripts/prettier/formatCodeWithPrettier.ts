import prettier from "prettier";
import { getPrettierConfig } from "./getPrettierConfig";

type FormatCodeWithPrettierArgs = {
  code: string;
};

export const formatCodeWithPrettier = async ({ code }: FormatCodeWithPrettierArgs) => {
  const prettierConfig = getPrettierConfig();
  const formattedCode = await prettier.format(code, {
    ...prettierConfig,
    parser: "typescript",
  });

  return formattedCode;
};
