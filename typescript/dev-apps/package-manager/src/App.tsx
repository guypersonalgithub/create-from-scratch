import { Router } from "@packages/router";
import { TooltipManager } from "@packages/tooltip";
import { ModalManager } from "@packages/modal";
import { NotFound } from "./routes/NotFound";
import { MainRoute } from "./routes/MainRoute";
import { ToastManager } from "@packages/toast";
import { SpecificDependency } from "./routes/SpecificDependency";
import { Testing } from "./routes/Testing";
import { TriggerPopperManager } from "@packages/trigger-popper";
import { MinimizableSidebar } from "@packages/sidebar";

const App = () => {
  return (
    <>
      <div style={{ height: "100vh", display: "flex", gap: "30px" }}>
        <MinimizableSidebar
          title={
            <span style={{ width: "fit-content", fontSize: "26px", fontWeight: "bold" }}>
              Dependensee
            </span>
          }
          links={[]}
          onLinkClick={() => console.log("?")}
          openedWidth={200}
          closedWidth={50}
        />
        <div style={{ width: "100%", paddingRight: "30px", overflow: "hidden" }}>
          <Router
            paths={{
              "/": <MainRoute />,
              "/dependency": {
                "/:dependency": <SpecificDependency />,
              },
              "/testing": <Testing />,
              "404": <NotFound />,
            }}
          />
        </div>
      </div>
      <TooltipManager />
      <ModalManager />
      <ToastManager />
      <TriggerPopperManager />
    </>
  );
};

export default App;
