import { ESLint } from "eslint";

type FormatCodeWithESLintArgs = {
  code: string;
  listErrors?: boolean;
};

export const formatCodeWithESLint = async ({ code, listErrors }: FormatCodeWithESLintArgs) => {
  const eslint = new ESLint({ fix: true });
  const results = await eslint.lintText(code);
  const output = results[0].output ?? code;

  if (listErrors) {
    const formatter = await eslint.loadFormatter("stylish");
    const errors = formatter.format(results);

    return {
      output,
      errors,
    };
  }

  return { output };
};
