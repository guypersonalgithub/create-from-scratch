import { MinimizableSidebar } from "@packages/sidebar";
import { Calculator, Home } from "@packages/icons";
import { Router, usePath, usePathState } from "@packages/router";
import { TooltipManager } from "@packages/tooltip";
import { Math } from "./routes/math/Math";
import { AutoCompleteInput } from "@packages/auto-complete-input";
import { ComponentProps } from "react";
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
] satisfies ReturnType<ComponentProps<typeof AutoCompleteInput>["autocompleteOptionsCallback"]>;

const App = () => {
  return (
    <>
      <div style={{ width: "100%", height: "100vh", display: "flex", overflow: "hidden" }}>
        <SidebarWrapper />
        <div style={{ width: "100%", overflow: "auto" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "end",
              marginRight: "20px",
              marginTop: "10px",
            }}
          >
            <div style={{ position: "fixed", top: "10px" }}>
              <AutoComplete />
            </div>
          </div>
          <Router
            wrapperStyle={{ margin: "20px" }}
            paths={{
              "/": () => {
                return (
                  <div>
                    <h3>
                      Navigate to your desirable interests through the sidebar or the auto complete
                      search
                    </h3>
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
                  },
                },
                "/floor-function": <FloorFunction />,
                "/composition-of-functions": <CompositionOfFunctions />,
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
      ]}
      onLinkClick={({ pathname, queryParams }) => moveTo({ pathname, queryParams })}
      openedWidth={200}
      closedWidth={50}
      iconSize={20}
      selected={path}
      selectedStyle={{ backgroundColor: "#160e0e" }}
    />
  );
};

const AutoComplete = () => {
  const { moveTo } = usePath();

  return (
    <div style={{ maxWidth: "300px" }}>
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
      />
    </div>
  );
};

export default App;
