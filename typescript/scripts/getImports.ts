import { parseImports } from "@packages/import-parser";

const input = `import { MinimizableSidebar } from "@packages/sidebar";
import {
  Calculator,
  Container,
  Home,
  Typescript as TypescriptIcon,
  CSS as CSSIcon,
  Linux as LinuxIcon,
  SecuredScreen,
  Binary as BinaryIcon,
} from "@packages/icons";
import { Router, usePath, usePathState } from "@packages/router";
import { EllipsisTooltip, TooltipManager } from "@packages/tooltip";
import { Math } from "./routes/math/Math";
import { AutoCompleteInput } from "@packages/auto-complete-input";
import { type ComponentProps, useLayoutEffect, useRef } from "react";
import * as Icons from "@packages/flag-icons";

console.log("This shouldn't be parsed as its beyond the last import at the top");`;

const { imports, currentIndex } = parseImports({ input });
console.dir(imports, { depth: null });
console.log(currentIndex);
console.log({ remaining: input.slice(currentIndex) });
