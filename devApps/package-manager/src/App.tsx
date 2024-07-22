import { Router } from "@packages/router";
import { TooltipManager } from "@packages/tooltip";
import { NotFound } from "./routes/NotFound";
import { MainRoute } from "./routes/MainRoute";

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
    </div>
  );
};

export default App;
