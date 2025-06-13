import { type Plugin } from "vite";

export const removeLibrariesVitePlugin = (libraries: string[]): Plugin => {
  return {
    name: "remove-libraries",

    async transform(code, id) {
      if (id.endsWith(".js") || id.endsWith(".ts") || id.endsWith(".tsx")) {
        const filteredCode = code
          .split("\n")
          .filter((line) => !libraries.some((lib) => line.includes(lib)))
          .join("\n");

        return {
          code: filteredCode,
        };
      }

      return code;
    },
  };
};
