import { formatCodeWithPrettier } from "@packages/prettier";

type FormatPrettierArgs = {
  code: string;
};

export const formatPrettier = async ({ code }: FormatPrettierArgs) => {
  const output = await formatCodeWithPrettier({ code });
  console.log(output);
};

formatPrettier({
  code: ``,
});
