import { MinimizableSidebar } from "@packages/sidebar";
import { Calculator, Home } from "@packages/icons";
import { Router, usePath, usePathState } from "@packages/router";
import { TooltipManager } from "@packages/tooltip";
import { Math } from "./routes/math/Math";
import { AutoCompleteInput } from "@packages/auto-complete-input";
import { ComponentProps } from "react";
import { Calculus } from "./routes/math/calculus/Calculus";
import { Limit } from "./routes/math/calculus/limit/Limit";

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
    label: "Limit",
    value: "/math/calculus/limit",
  },
] satisfies ReturnType<ComponentProps<typeof AutoCompleteInput>["autocompleteOptionsCallback"]>;

const App = () => {
  return (
    <>
      <div style={{ width: "100%", height: "100vh", display: "flex" }}>
        <SidebarWrapper />
        <div style={{ width: "100%", marginLeft: "20px", marginRight: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginTop: "10px",
            }}
          >
            <AutoComplete />
          </div>
          <Router
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
                  },
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
