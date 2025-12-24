import { MinimizableSidebar } from "@packages/sidebar";
import {
  Calculator,
  Container,
  Home,
  Typescript as TypescriptIcon,
  CSS as CSSIcon,
  Linux as LinuxIcon,
  SecuredScreen,
  Binary as BinaryIcon,
  Paragraph as ParagraphIcon,
} from "@packages/icons";
import { Router, usePath, usePathState } from "@packages/router";
import { EllipsisTooltip, TooltipManager } from "@packages/tooltip";
import { Math } from "./routes/math/Math";
import { AutoCompleteInput } from "@packages/auto-complete-input";
import { type ComponentProps, useLayoutEffect, useRef } from "react";
import { StyledMainTitle } from "./styledComponents/StyledMainTitle";
import { Typescript } from "./routes/typescript/Typescript";
import { UIThemeProvider } from "@packages/ui-theme";
import { customThemes } from "./UIThemes";
import { Test } from "./Test";
import { Containers } from "./routes/containers/Containers";
import { CSS } from "./routes/css/CSS";
import { Linux } from "./routes/linux/Linux";
import { Security } from "./routes/security/Security";
import { Binary } from "./routes/binary/Binary";
import { dynatic } from "./dynatic-css.config";
import { Algorithms } from "./routes/algorithms/Algorithms";

const searchableRoutes = [
  {
    label: "Home",
    value: "/",
  },
  {
    label: "Math",
    value: "/math",
  },
  {
    label: "Calculus",
    value: "/math/calculus",
  },
  {
    label: "Floor function",
    value: "/math/floor-function",
  },
  {
    label: "Limit",
    value: "/math/calculus/limit",
  },
  {
    label: "Limit laws",
    value: "/math/calculus/limit/laws",
  },
  {
    label: "Continuity",
    value: "/math/calculus/continuity",
  },
  {
    label: "Composition",
    value: "/math/composition-of-functions",
  },
  {
    label: "Intermediate value theorem",
    value: "/math/calculus/continuity/intermediate-value-theorem",
  },
  {
    label: "Limits of quotients",
    value: "/math/calculus/limit/limits-of-quotients",
  },
  {
    label: "Limits that are infinite",
    value: "/math/calculus/limit/limits-that-are-infinite",
  },
  {
    label: "Derivative",
    value: "/math/calculus/derivative",
  },
  {
    label: "Geometric derivative interpretation",
    value: "/math/calculus/derivative/geometric-derivative-interpretation",
  },
  {
    label: "Tangent line",
    value: "/math/tangent-line",
  },
  {
    label: "Secant line",
    value: "/math/secant-line",
  },
  {
    label: "Derivative as a function",
    value: "/math/calculus/derivative/derivative-as-a-function",
  },
  {
    label: "Calculating derivatives",
    value: "/math/calculus/derivative/calculating-derivatives",
  },
  {
    label: "Typescript",
    value: "/typescript",
  },
  {
    label: "Generics",
    value: "/typescript/generics",
  },
  {
    label: "Type arguments",
    value: "/typescript/generics/type-arguments",
  },
  {
    label: "Generics at different levels",
    value: "/typescript/generics/generics-at-different-levels",
  },
  {
    label: "Advanced generics",
    value: "/typescript/generics/advanced-generics",
  },
  {
    label: "Function overloads",
    value: "/typescript/generics/function-overloads",
  },
  {
    label: "Containers",
    value: "/containers",
  },
] satisfies ReturnType<ComponentProps<typeof AutoCompleteInput>["autocompleteOptionsCallback"]>;

const App = () => {
  return (
    <UIThemeProvider themes={customThemes}>
      <div
        className={dynatic`
          width: 100%;
          height: 100vh;
          display: flex;
          overflow: hidden;
        `}
      >
        <SidebarWrapper />
        <div
          className={dynatic`
            width: 100%;
            overflow: auto;
          `}
        >
          <AutoComplete />
          <Router
            wrapperClassName={dynatic`
              margin: 20px;
            `}
            paths={{
              "/": () => {
                return (
                  <div>
                    <StyledMainTitle>
                      Navigate to your desirable interests through the sidebar or the auto complete
                      search
                    </StyledMainTitle>
                  </div>
                );
              },
              "/math!": <Math />,
              "/typescript!": <Typescript />,
              "/containers!": <Containers />,
              "/css!": <CSS />,
              "/linux!": <Linux />,
              "/security!": <Security />,
              "/binary!": <Binary />,
              "/algorithms!": <Algorithms />,
              "/test": <Test />,
            }}
          />
        </div>
      </div>
      <TooltipManager />
    </UIThemeProvider>
  );
};

const SidebarWrapper = () => {
  const { moveTo } = usePath();
  const { path } = usePathState();

  return (
    <MinimizableSidebar
      title={
        <span
          className={dynatic`
            width: fit-content;
            font-size: 26px;
            font-weight: bold;
          `}
        >
          CS
        </span>
      }
      links={[
        { icon: <Home />, label: "Home", pathname: "/" },
        { icon: <Calculator />, label: "Math", pathname: "/math" },
        { icon: <TypescriptIcon />, label: "Typescript", pathname: "/typescript" },
        { icon: <Container />, label: "Containers", pathname: "/containers" },
        { icon: <CSSIcon />, label: "CSS", pathname: "/css" },
        { icon: <LinuxIcon />, label: "Linux", pathname: "/linux" },
        { icon: <SecuredScreen />, label: "Security", pathname: "/security" },
        { icon: <BinaryIcon />, label: "Binary", pathname: "/binary" },
        { icon: <ParagraphIcon />, label: "Algorithms", pathname: "/algorithms" },
      ]}
      onLinkClick={({ pathname, queryParams }) => moveTo({ pathname, queryParams })}
      openedWidth={200}
      closedWidth={50}
      iconSize={20}
      selected={path}
      selectedClassName={dynatic`
        background-color: #160e0e;
      `}
      containerClassName={dynatic`
        border-top-right-radius: 0;
      `}
    />
  );
};

const AutoComplete = () => {
  const { moveTo } = usePath();
  const ref = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const minWidth = 200;

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      if (!childRef.current) {
        return;
      }

      for (const entry of entries) {
        if (entry.target === ref.current) {
          const { left, width } = ref.current.getBoundingClientRect();
          const displayedWidth = width < minWidth ? minWidth : width;
          childRef.current.style.left = `${left}px`;
          childRef.current.style.width = `${displayedWidth}px`;
          break;
        }
      }
    });

    observer.observe(ref.current);

    return () => {
      if (!ref.current) {
        return;
      }

      observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={dynatic`
          position: relative;
          padding-right: 0;
          overflow: hidden;
          height: 30px;
          padding-bottom: 10px;
        `}
    >
      <div
        ref={childRef}
        className={dynatic`
            position: fixed;
            z-index: 3;
            display: flex;
            justify-content: end;
            padding-top: 10px;
            padding-bottom: 10px;
            background-color: #1f1616;
          `}
      >
        <div
          className={dynatic`
            width: 200px;
            padding-right: 10px;
          `}
        >
          <AutoCompleteInput
            debounceDelay={300}
            autocompleteOptionsCallback={(text) => {
              const lowercaseText = text.toLowerCase();

              return searchableRoutes.filter((searchable) =>
                searchable.label.toLowerCase().includes(lowercaseText),
              );
            }}
            callback={(option) => moveTo({ pathname: option.value })}
            inputWrapperClassName={dynatic`
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                height: 30px;
                align-items: center;
              `}
            inputPlaceholder="Search"
            optionContent={({ result }) => {
              return (
                <EllipsisTooltip
                  content={result.label}
                  className={dynatic`
                    width: 170px;
                  `}
                >
                  {result.label}
                </EllipsisTooltip>
              );
            }}
            clearInputOnPick
          />
        </div>
      </div>
    </div>
  );
};

export default App;
