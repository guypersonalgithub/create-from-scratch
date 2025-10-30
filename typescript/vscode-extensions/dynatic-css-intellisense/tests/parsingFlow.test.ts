import { test, expect } from "@packages/test";
import { trackDynaticFunctionsNames } from "../src/trackDynaticFunctionsNames";
import { getDynaticCSSTextToParse } from "../src/getDynaticCSSTextToParse";
import { createParsedFile } from "../src/createParsedFile";

const documentText =
  'import { MinimizableSidebar } from "@packages/sidebar";\n' +
  "import {\n" +
  "  Calculator,\n" +
  "  Container,\n" +
  "  Home,\n" +
  "  Typescript as TypescriptIcon,\n" +
  "  CSS as CSSIcon,\n" +
  "  Linux as LinuxIcon,\n" +
  "  SecuredScreen,\n" +
  "  Binary as BinaryIcon,\n" +
  '} from "@packages/icons";\n' +
  'import { Router, usePath, usePathState } from "@packages/router";\n' +
  'import { EllipsisTooltip, TooltipManager } from "@packages/tooltip";\n' +
  'import { Math } from "./routes/math/Math";\n' +
  'import { AutoCompleteInput } from "@packages/auto-complete-input";\n' +
  'import { type ComponentProps, useLayoutEffect, useRef } from "react";\n' +
  'import { StyledMainTitle } from "./styledComponents/StyledMainTitle";\n' +
  'import { Typescript } from "./routes/typescript/Typescript";\n' +
  'import { UIThemeProvider } from "@packages/ui-theme";\n' +
  'import { customThemes } from "./UIThemes";\n' +
  'import { Test } from "./Test";\n' +
  'import { Containers } from "./routes/containers/Containers";\n' +
  'import { CSS } from "./routes/css/CSS";\n' +
  'import { Linux } from "./routes/linux/Linux";\n' +
  'import { Test2 } from "./Test2";\n' +
  'import { Security } from "./routes/security/Security";\n' +
  'import { Binary } from "./routes/binary/Binary";\n' +
  'import { dynatic } from "./dynatic-css.config";\n' +
  "\n" +
  'const testing3 = () => "purple";\n' +
  "\n" +
  "const test = dynatic`\n" +
  "  color: red;\n" +
  "  ${(config) => `background-color: ${config.colors.blue}`};\n" +
  "\n" +
  "  &:hover {\n" +
  "    color: ${testing3()};\n" +
  "  }\n" +
  "\n" +
  "  @media (min-width: 30em) and (max-width: 50em) {\n" +
  "    color: black;\n" +
  "    background-color: ${testing3()};\n" +
  "\n" +
  "    &:hover {\n" +
  "      color: ${testing3()};\n" +
  "    }\n" +
  "\n" +
  "    border: 1px solid blue;\n" +
  "  }\n" +
  "`;\n" +
  "\n" +
  "console.log(test);\n" +
  "\n" +
  "const searchableRoutes = [\n" +
  "  {\n" +
  '    label: "Home",\n' +
  '    value: "/",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Math",\n' +
  '    value: "/math",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Calculus",\n' +
  '    value: "/math/calculus",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Floor function",\n' +
  '    value: "/math/floor-function",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Limit",\n' +
  '    value: "/math/calculus/limit",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Limit laws",\n' +
  '    value: "/math/calculus/limit/laws",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Continuity",\n' +
  '    value: "/math/calculus/continuity",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Composition",\n' +
  '    value: "/math/composition-of-functions",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Intermediate value theorem",\n' +
  '    value: "/math/calculus/continuity/intermediate-value-theorem",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Limits of quotients",\n' +
  '    value: "/math/calculus/limit/limits-of-quotients",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Limits that are infinite",\n' +
  '    value: "/math/calculus/limit/limits-that-are-infinite",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Derivative",\n' +
  '    value: "/math/calculus/derivative",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Geometric derivative interpretation",\n' +
  '    value: "/math/calculus/derivative/geometric-derivative-interpretation",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Tangent line",\n' +
  '    value: "/math/tangent-line",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Secant line",\n' +
  '    value: "/math/secant-line",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Derivative as a function",\n' +
  '    value: "/math/calculus/derivative/derivative-as-a-function",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Calculating derivatives",\n' +
  '    value: "/math/calculus/derivative/calculating-derivatives",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Typescript",\n' +
  '    value: "/typescript",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Generics",\n' +
  '    value: "/typescript/generics",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Type arguments",\n' +
  '    value: "/typescript/generics/type-arguments",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Generics at different levels",\n' +
  '    value: "/typescript/generics/generics-at-different-levels",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Advanced generics",\n' +
  '    value: "/typescript/generics/advanced-generics",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Function overloads",\n' +
  '    value: "/typescript/generics/function-overloads",\n' +
  "  },\n" +
  "  {\n" +
  '    label: "Containers",\n' +
  '    value: "/containers",\n' +
  "  },\n" +
  '] satisfies ReturnType<ComponentProps<typeof AutoCompleteInput>["autocompleteOptionsCallback"]>;\n' +
  "\n" +
  "const App = () => {\n" +
  "  return (\n" +
  "    <UIThemeProvider themes={customThemes}>\n" +
  "      <div className={test}>a</div>\n" +
  '      <div style={{ width: "100%", height: "100vh", display: "flex", overflow: "hidden" }}>\n' +
  "        <SidebarWrapper />\n" +
  '        <div style={{ width: "100%", overflow: "auto" }}>\n' +
  "          <AutoComplete />\n" +
  "          <Router\n" +
  '            wrapperStyle={{ margin: "20px" }}\n' +
  "            paths={{\n" +
  '              "/": () => {\n' +
  "                return (\n" +
  "                  <div>\n" +
  "                    <StyledMainTitle>\n" +
  "                      Navigate to your desirable interests through the sidebar or the auto complete\n" +
  "                      search\n" +
  "                    </StyledMainTitle>\n" +
  "                  </div>\n" +
  "                );\n" +
  "              },\n" +
  '              "/math!": <Math />,\n' +
  '              "/typescript!": <Typescript />,\n' +
  '              "/containers!": <Containers />,\n' +
  '              "/css!": <CSS />,\n' +
  '              "/linux!": <Linux />,\n' +
  '              "/security!": <Security />,\n' +
  '              "/binary!": <Binary />,\n' +
  '              "/test": <Test />,\n' +
  '              "/test2": <Test2 />,\n' +
  "            }}\n" +
  "          />\n" +
  "        </div>\n" +
  "      </div>\n" +
  "      <TooltipManager />\n" +
  "    </UIThemeProvider>\n" +
  "  );\n" +
  "};\n" +
  "\n" +
  "const SidebarWrapper = () => {\n" +
  "  const { moveTo } = usePath();\n" +
  "  const { path } = usePathState();\n" +
  "\n" +
  "  return (\n" +
  "    <MinimizableSidebar\n" +
  '      title={<span style={{ width: "fit-content", fontSize: "26px", fontWeight: "bold" }}>CS</span>}\n' +
  "      links={[\n" +
  '        { icon: <Home />, label: "Home", pathname: "/" },\n' +
  '        { icon: <Calculator />, label: "Math", pathname: "/math" },\n' +
  '        { icon: <TypescriptIcon />, label: "Typescript", pathname: "/typescript" },\n' +
  '        { icon: <Container />, label: "Containers", pathname: "/containers" },\n' +
  '        { icon: <CSSIcon />, label: "CSS", pathname: "/css" },\n' +
  '        { icon: <LinuxIcon />, label: "Linux", pathname: "/linux" },\n' +
  '        { icon: <SecuredScreen />, label: "Security", pathname: "/security" },\n' +
  '        { icon: <BinaryIcon />, label: "Binary", pathname: "/binary" },\n' +
  "      ]}\n" +
  "      onLinkClick={({ pathname, queryParams }) => moveTo({ pathname, queryParams })}\n" +
  "      openedWidth={200}\n" +
  "      closedWidth={50}\n" +
  "      iconSize={20}\n" +
  "      selected={path}\n" +
  '      selectedStyle={{ backgroundColor: "#160e0e" }}\n' +
  '      containerStyle={{ borderTopRightRadius: "0px" }}\n' +
  "    />\n" +
  "  );\n" +
  "};\n" +
  "\n" +
  "const AutoComplete = () => {\n" +
  "  const { moveTo } = usePath();\n" +
  "  const ref = useRef<HTMLDivElement>(null);\n" +
  "  const childRef = useRef<HTMLDivElement>(null);\n" +
  "  const minWidth = 200;\n" +
  "\n" +
  "  useLayoutEffect(() => {\n" +
  "    if (!ref.current) {\n" +
  "      return;\n" +
  "    }\n" +
  "\n" +
  "    const observer = new ResizeObserver((entries) => {\n" +
  "      if (!childRef.current) {\n" +
  "        return;\n" +
  "      }\n" +
  "\n" +
  "      for (const entry of entries) {\n" +
  "        if (entry.target === ref.current) {\n" +
  "          const { left, width } = ref.current.getBoundingClientRect();\n" +
  "          const displayedWidth = width < minWidth ? minWidth : width;\n" +
  "          childRef.current.style.left = `${left}px`;\n" +
  "          childRef.current.style.width = `${displayedWidth}px`;\n" +
  "          break;\n" +
  "        }\n" +
  "      }\n" +
  "    });\n" +
  "\n" +
  "    observer.observe(ref.current);\n" +
  "\n" +
  "    return () => {\n" +
  "      if (!ref.current) {\n" +
  "        return;\n" +
  "      }\n" +
  "\n" +
  "      observer.unobserve(ref.current);\n" +
  "    };\n" +
  "  }, []);\n" +
  "\n" +
  "  return (\n" +
  "    <div\n" +
  "      ref={ref}\n" +
  "      style={{\n" +
  '        position: "relative",\n' +
  '        paddingRight: "0px",\n' +
  '        overflow: "hidden",\n' +
  '        height: "30px",\n' +
  '        paddingBottom: "10px",\n' +
  "      }}\n" +
  "    >\n" +
  "      <div\n" +
  "        ref={childRef}\n" +
  "        style={{\n" +
  '          position: "fixed",\n' +
  '          zIndex: "3",\n' +
  '          display: "flex",\n' +
  '          justifyContent: "end",\n' +
  '          paddingTop: "10px",\n' +
  '          paddingBottom: "10px",\n' +
  '          backgroundColor: "#1f1616",\n' +
  "        }}\n" +
  "      >\n" +
  '        <div style={{ width: "200px", paddingRight: "10px" }}>\n' +
  "          <AutoCompleteInput\n" +
  "            debounceDelay={300}\n" +
  "            autocompleteOptionsCallback={(text) => {\n" +
  "              const lowercaseText = text.toLowerCase();\n" +
  "\n" +
  "              return searchableRoutes.filter((searchable) =>\n" +
  "                searchable.label.toLowerCase().includes(lowercaseText),\n" +
  "              );\n" +
  "            }}\n" +
  "            callback={(option) => moveTo({ pathname: option.value })}\n" +
  "            inputWrapperStyle={{\n" +
  '              borderTopLeftRadius: "10px",\n' +
  '              borderTopRightRadius: "10px",\n' +
  '              borderBottomLeftRadius: "0px",\n' +
  '              borderBottomRightRadius: "0px",\n' +
  '              height: "30px",\n' +
  '              alignItems: "center",\n' +
  "            }}\n" +
  '            inputPlaceholder="Search"\n' +
  "            optionContent={({ result }) => {\n" +
  "              return (\n" +
  '                <EllipsisTooltip content={result.label} style={{ width: "170px" }}>\n' +
  "                  {result.label}\n" +
  "                </EllipsisTooltip>\n" +
  "              );\n" +
  "            }}\n" +
  "            clearInputOnPick\n" +
  "          />\n" +
  "        </div>\n" +
  "      </div>\n" +
  "    </div>\n" +
  "  );\n" +
  "};\n" +
  "\n" +
  "export default App;\n";

const parsedImports = ["dynatic"];
const fileStartOffset = 1140;

test({
  name: "test track dynatic functions names",
  fn: () => {
    const { relevantImports, currentIndex: fileStartOffset } = trackDynaticFunctionsNames({
      document: documentText,
    });

    expect({ value: relevantImports }).toEqual({ expected: parsedImports });
    expect({ value: fileStartOffset }).toBe({ expected: fileStartOffset });
  },
});

const remainingText = documentText.slice(fileStartOffset);
const parsedSections = [{ start: 53, end: 360 }];

test({
  name: "test sections parser",
  fn: () => {
    const sections = getDynaticCSSTextToParse({
      text: remainingText,
      identifiers: parsedImports,
    });

    expect({ value: sections }).toEqual({ expected: parsedSections });
  },
});

test({
  name: "test parsed file creation",
  fn: () => {
    const parsedFile = createParsedFile({
      remainingText,
      fileStartOffset,
      sections: parsedSections,
    });

    const expected = [
      {
        tokens: [
          {
            type: "property",
            value: "color",
            startIndex: 1196,
            endIndex: 1201,
          },
          { type: "colon", value: ":", startIndex: 1201, endIndex: 1202 },
          { type: "color", value: "red", startIndex: 1203, endIndex: 1206 },
          {
            type: "end-of-line",
            value: ";",
            startIndex: 1206,
            endIndex: 1207,
          },
          { type: "unknown", value: ";", startIndex: 1266, endIndex: 1267 },
          {
            type: "classname",
            value: "&:hover ",
            startIndex: 1272,
            endIndex: 1279,
          },
          {
            type: "open-curly-bracket",
            value: "{",
            startIndex: 1279,
            endIndex: 1280,
          },
          {
            type: "property",
            value: "color",
            startIndex: 1285,
            endIndex: 1290,
          },
          { type: "colon", value: ":", startIndex: 1290, endIndex: 1291 },
          {
            type: "end-of-line",
            value: ";",
            startIndex: 1305,
            endIndex: 1306,
          },
          {
            type: "close-curly-bracket",
            value: "}",
            startIndex: 1309,
            endIndex: 1310,
          },
          {
            type: "at-keyword",
            value: "@media",
            startIndex: 1314,
            endIndex: 1320,
          },
          {
            type: "at-open-parenthesis",
            value: "(",
            startIndex: 1321,
            endIndex: 1322,
          },
          {
            type: "property",
            value: "min-width",
            startIndex: 1322,
            endIndex: 1331,
          },
          { type: "colon", value: ":", startIndex: 1325, endIndex: 1332 },
          {
            type: "numeric",
            value: "30em",
            startIndex: 1333,
            endIndex: 1337,
          },
          {
            type: "at-close-parenthesis",
            value: ")",
            startIndex: 1337,
            endIndex: 1338,
          },
          {
            type: "at-word",
            value: "and",
            startIndex: 1339,
            endIndex: 1342,
          },
          {
            type: "at-open-parenthesis",
            value: "(",
            startIndex: 1343,
            endIndex: 1344,
          },
          {
            type: "property",
            value: "max-width",
            startIndex: 1344,
            endIndex: 1353,
          },
          { type: "colon", value: ":", startIndex: 1347, endIndex: 1354 },
          {
            type: "numeric",
            value: "50em",
            startIndex: 1355,
            endIndex: 1359,
          },
          {
            type: "at-close-parenthesis",
            value: ")",
            startIndex: 1359,
            endIndex: 1360,
          },
          {
            type: "open-curly-bracket",
            value: "{",
            startIndex: 1361,
            endIndex: 1362,
          },
          {
            type: "property",
            value: "color",
            startIndex: 1367,
            endIndex: 1372,
          },
          { type: "colon", value: ":", startIndex: 1372, endIndex: 1373 },
          {
            type: "color",
            value: "black",
            startIndex: 1374,
            endIndex: 1379,
          },
          {
            type: "end-of-line",
            value: ";",
            startIndex: 1379,
            endIndex: 1380,
          },
          {
            type: "property",
            value: "background-color",
            startIndex: 1385,
            endIndex: 1401,
          },
          { type: "colon", value: ":", startIndex: 1395, endIndex: 1402 },
          {
            type: "end-of-line",
            value: ";",
            startIndex: 1416,
            endIndex: 1417,
          },
          {
            type: "classname",
            value: "&:hover ",
            startIndex: 1424,
            endIndex: 1431,
          },
          {
            type: "open-curly-bracket",
            value: "{",
            startIndex: 1431,
            endIndex: 1432,
          },
          {
            type: "property",
            value: "color",
            startIndex: 1439,
            endIndex: 1444,
          },
          { type: "colon", value: ":", startIndex: 1444, endIndex: 1445 },
          {
            type: "end-of-line",
            value: ";",
            startIndex: 1459,
            endIndex: 1460,
          },
          {
            type: "close-curly-bracket",
            value: "}",
            startIndex: 1465,
            endIndex: 1466,
          },
          {
            type: "property",
            value: "border",
            startIndex: 1472,
            endIndex: 1478,
          },
          { type: "colon", value: ":", startIndex: 1478, endIndex: 1479 },
          {
            type: "numeric",
            value: "1px",
            startIndex: 1480,
            endIndex: 1483,
          },
          {
            type: "string",
            value: "solid",
            startIndex: 1484,
            endIndex: 1489,
          },
          {
            type: "color",
            value: "blue",
            startIndex: 1490,
            endIndex: 1494,
          },
          {
            type: "end-of-line",
            value: ";",
            startIndex: 1494,
            endIndex: 1495,
          },
          {
            type: "close-curly-bracket",
            value: "}",
            startIndex: 1498,
            endIndex: 1499,
          },
        ],
        startOffset: 1193,
        endOffset: 1500,
      },
    ];

    expect({ value: parsedFile }).toEqual({ expected });
  },
});
