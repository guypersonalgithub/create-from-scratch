import { MinimizableSidebar } from "@packages/sidebar";
import { Calculator, Home } from "@packages/icons";
import { Router, usePath, usePathState } from "@packages/router";
import { EllipsisTooltip, TooltipManager } from "@packages/tooltip";
import { Math } from "./routes/math/Math";
import { AutoCompleteInput } from "@packages/auto-complete-input";
import { ComponentProps, useLayoutEffect, useRef } from "react";
import { Calculus } from "./routes/math/calculus/Calculus";
import { Limit } from "./routes/math/calculus/limit/Limit";
import { FloorFunction } from "./routes/math/FloorFunction";
import { LimitLaws } from "./routes/math/calculus/limit/LimitLaws";
import { Continuity } from "./routes/math/calculus/continuity/Continuity";
import { CompositionOfFunctions } from "./routes/math/CompositionOfFunctions";
import { IntermediateValueTheorem } from "./routes/math/calculus/continuity/IntermediateValueTheorem";
import { LimitsOfQuotients } from "./routes/math/calculus/limit/LimitsOfQuotients";
import { LimitsThatAreInfinite } from "./routes/math/calculus/limit/LimitsThatAreInfinite";
import { Derivative } from "./routes/math/calculus/derivative/Derivative";
import { GeometricDerivativeInterpretation } from "./routes/math/calculus/derivative/GeometricDerivativeInterpretation";
import { TangentLine } from "./routes/math/TangentLine";
import { SecantLine } from "./routes/math/SecantLine";
import { DerivativeAsAFunction } from "./routes/math/calculus/derivative/DerivativeAsAFunction";
import { StyledMainTitle } from "./styledComponents/StyledMainTitle";
import { CalculatingDerivatives } from "./routes/math/calculus/derivative/calculatingDerivatives/CalculatingDerivatives";
import { Typescript } from "./routes/typescript/Typescript";
import { Generics } from "./routes/typescript/Generics/Generics";
import { Typescript as TypescriptIcon } from "@packages/icons";
import { TypeArguments } from "./routes/typescript/Generics/TypeArguments";
import { GenericsAtDifferentLevels } from "./routes/typescript/Generics/GenericsAtDifferentLevels";
import { AdvancedGenerics } from "./routes/typescript/Generics/AdvancedGenerics";
import { FunctionOverloads } from "./routes/typescript/Generics/FunctionOverloads";

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
] satisfies ReturnType<ComponentProps<typeof AutoCompleteInput>["autocompleteOptionsCallback"]>;

const App = () => {
  return (
    <>
      <div style={{ width: "100%", height: "100vh", display: "flex", overflow: "hidden" }}>
        <SidebarWrapper />
        <div style={{ width: "100%", overflow: "auto" }}>
          <AutoComplete />
          <Router
            wrapperStyle={{ margin: "20px" }}
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
              "/math": {
                "/": <Math />,
                "/calculus": {
                  "/": <Calculus />,
                  "/limit": {
                    "/": <Limit />,
                    "/laws": <LimitLaws />,
                    "/limits-of-quotients": <LimitsOfQuotients />,
                    "/limits-that-are-infinite": <LimitsThatAreInfinite />,
                  },
                  "/continuity": {
                    "/": <Continuity />,
                    "/intermediate-value-theorem": <IntermediateValueTheorem />,
                  },
                  "/derivative": {
                    "/": <Derivative />,
                    "/geometric-derivative-interpretation": <GeometricDerivativeInterpretation />,
                    "/derivative-as-a-function": <DerivativeAsAFunction />,
                    "/calculating-derivatives": {
                      "/": <CalculatingDerivatives />,
                    },
                  },
                },
                "/floor-function": <FloorFunction />,
                "/composition-of-functions": <CompositionOfFunctions />,
                "/tangent-line": <TangentLine />,
                "/secant-line": <SecantLine />,
              },
              "/typescript": {
                "/": <Typescript />,
                "/generics": {
                  "/": <Generics />,
                  "/type-arguments": <TypeArguments />,
                  "/generics-at-different-levels": <GenericsAtDifferentLevels />,
                  "/advanced-generics": <AdvancedGenerics />,
                  "/function-overloads": <FunctionOverloads />,
                },
              },
            }}
          />
        </div>
      </div>
      <TooltipManager />
    </>
  );
};

const SidebarWrapper = () => {
  const { moveTo } = usePath();
  const { path } = usePathState();

  return (
    <MinimizableSidebar
      title={<span style={{ width: "fit-content", fontSize: "26px", fontWeight: "bold" }}>CS</span>}
      links={[
        { icon: <Home />, label: "Home", pathname: "/" },
        { icon: <Calculator />, label: "Math", pathname: "/math" },
        { icon: <TypescriptIcon />, label: "Typescript", pathname: "/typescript" },
      ]}
      onLinkClick={({ pathname, queryParams }) => moveTo({ pathname, queryParams })}
      openedWidth={200}
      closedWidth={50}
      iconSize={20}
      selected={path}
      selectedStyle={{ backgroundColor: "#160e0e" }}
      containerStyle={{ borderTopRightRadius: "0px" }}
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

      for (let entry of entries) {
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
      style={{
        position: "relative",
        paddingRight: "0px",
        overflow: "hidden",
        height: "30px",
        paddingBottom: "10px",
      }}
    >
      <div
        ref={childRef}
        style={{
          position: "fixed",
          zIndex: "3",
          display: "flex",
          justifyContent: "end",
          paddingTop: "10px",
          paddingBottom: "10px",
          backgroundColor: "#1f1616",
        }}
      >
        <div style={{ width: "200px", paddingRight: "10px" }}>
          <AutoCompleteInput
            debounceDelay={300}
            autocompleteOptionsCallback={(text) => {
              const lowercaseText = text.toLowerCase();
              return searchableRoutes.filter((searchable) =>
                searchable.label.toLowerCase().includes(lowercaseText),
              );
            }}
            callback={(option) => moveTo({ pathname: option.value })}
            inputWrapperStyle={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "0px",
              height: "30px",
              alignItems: "center",
            }}
            inputPlaceholder="Search"
            optionContent={({ result }) => {
              return (
                <EllipsisTooltip content={result.label} style={{ width: "170px" }}>
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
