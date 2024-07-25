import { Router } from "@packages/router";
import { TooltipManager } from "@packages/tooltip";
import { ModalManager } from "@packages/modal";
import { NotFound } from "./routes/NotFound";
import { MainRoute } from "./routes/MainRoute";
import { ToastManager } from "@packages/toast";

const App = () => {
  return (
    <div style={{ height: "100vh" }}>
      <Router
        paths={{
          "/": <MainRoute />,
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
