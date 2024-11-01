import { MinimizableSidebar } from "@packages/sidebar";
import { Calculator, Home } from "@packages/icons";
import { Router, usePath, usePathState } from "@packages/router";
import { TooltipManager } from "@packages/tooltip";
import { Math } from "./routes/Math";

function App() {
  return (
    <>
      <div style={{ width: "100%", height: "100vh", display: "flex" }}>
        <SidebarWrapper />
        <Router
          paths={{
            "/": () => {
              return <></>;
            },
            "/math": <Math />,
          }}
        />
      </div>
      <TooltipManager />
    </>
  );
}

const SidebarWrapper = () => {
  const { moveTo } = usePath();
  const { path } = usePathState();

  return (
    <MinimizableSidebar
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

export default App;
