import { parseImports } from "@packages/import-parser";

const input = `import { type CSSProperties } from "react";
import "./styles.css";
import { type Animated, type GenericBaseToken, type TokenMaps } from "./types";
import { type SupportedLanguages } from "./languages";
import { AnimatedCode } from "./AnimatedCode";
import { ColorizedSyntaxHighlighter } from "./ColorizedSyntaxHighlighter";
import { type Variant } from "./ModernContentDesign";`;

const { imports, currentIndex } = parseImports({ input });
console.dir(imports, { depth: null });
console.log(currentIndex);
console.log({ remaining: input.slice(currentIndex) });
