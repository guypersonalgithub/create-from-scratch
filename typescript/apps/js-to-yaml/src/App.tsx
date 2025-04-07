import { Router } from "@packages/router";
import { UIThemeProvider } from "@packages/ui-theme";
import { customThemes } from "./UIThemes";
import { Main } from "./routes/Main";
import { Header, Layout } from "./Layout";
import { TooltipManager } from "@packages/tooltip";

function App() {
  return (
    <UIThemeProvider
      themes={customThemes}
      style={{ transition: "color 0.5s ease, background-color 0.5s ease" }}
    >
      <Layout>
        <Header />
        <Router
          paths={{
            "/": <Main />,
          }}
        />
      </Layout>
      <TooltipManager />
    </UIThemeProvider>
  );
}

export default App;
