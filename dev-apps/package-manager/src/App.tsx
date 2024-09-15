import { Router } from "@packages/router";
import { TooltipManager } from "@packages/tooltip";
import { ModalManager } from "@packages/modal";
import { NotFound } from "./routes/NotFound";
import { MainRoute } from "./routes/MainRoute";
import { ToastManager } from "@packages/toast";
import { SpecificDependency } from "./routes/SpecificDependency";
import { Testing } from "./routes/Testing";

const App = () => {
  return (
    <div style={{ height: "100vh" }}>
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
      <TooltipManager />
      <ModalManager />
      <ToastManager />
    </div>
  );
};

export default App;
