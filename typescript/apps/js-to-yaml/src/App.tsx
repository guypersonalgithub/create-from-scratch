import { Router } from "@packages/router";
import { UIThemeProvider } from "@packages/ui-theme";
import { customThemes } from "./UIThemes";
import { Main } from "./routes/Main";
import { Header, Layout } from "./Layout";
import { TooltipManager } from "@packages/tooltip";
import { NotFound } from "./routes/NotFound";
import { Examples } from "./routes/Examples";
import { Playground } from "./routes/playground/Playground";
import { Documentation } from "./routes/documentation/Documentation";

function App() {
  return (
    <UIThemeProvider
      themes={customThemes}
      style={{ transition: "color 0.5s ease, background-color 0.5s ease, border 0.5s ease" }}
    >
      <Layout>
        <Header />
        <Router
          paths={{
            "/": <Main />,
            "/documentation!": <Documentation />,
            "/examples": <Examples />,
            "/playground!": <Playground />,
            "404": <NotFound />,
          }}
        />
      </Layout>
      <TooltipManager />
    </UIThemeProvider>
  );
}

export default App;
