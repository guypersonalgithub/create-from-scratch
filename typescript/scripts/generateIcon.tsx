import { getProjectAbsolutePath } from "@packages/paths";
import { writeFileSync, readFileSync } from "fs";

type GenerateIconArgs = {
  name: string;
  pack: "icons" | "flag-icons";
  svg: string;
  replace?: string;
};

export const generateIcon = ({ name, pack, svg, replace }: GenerateIconArgs) => {
  const formattedName = name.split(" ").join("");
  const absolutePath = getProjectAbsolutePath();
  const icon = `/packages/${pack}/src`;
  const path = `${absolutePath}${icon}`;
  const index = `${path}/index.ts`;

  const firstLineBreak = svg.indexOf(">");
  const firstLine = svg.slice(0, firstLineBreak + 1);

  const base = `import { type SVGIconProps } from "./types";

export const ${formattedName} = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
${replace ? svg.replace(firstLine, replace) : svg}
  );
};
`;

  writeFileSync(`${path}/${formattedName}.tsx`, base);

  let indexFile = readFileSync(index, { encoding: "utf-8" });
  indexFile += `export * from "./${formattedName}";\n`;

  writeFileSync(index, indexFile);

  console.log(`Created ${formattedName}`);
};

generateIcon({ name: "", pack: "flag-icons", svg: `` });
