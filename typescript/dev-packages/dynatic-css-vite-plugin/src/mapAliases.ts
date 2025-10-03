import type { Alias, AliasOptions } from "vite";

type MapAliasesArgs = {
  alias: (AliasOptions | undefined) & Alias[];
};

export const mapAliases = ({ alias }: MapAliasesArgs) => {
  const mapped: Record<string, string> = {};

  alias.forEach((alias) => {
    const { find, replacement } = alias;

    if (typeof find === "string" && find.startsWith("@")) {
      mapped[find] = replacement;
    }
  });

  return mapped;
};
