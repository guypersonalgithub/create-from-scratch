import { Router } from "@packages/router";
import { UIThemeProvider } from "@packages/ui-theme";
import { customThemes } from "./UIThemes";
import { Main } from "./routes/main/Main";
import { Layout } from "./components/Layout";
import { TooltipManager } from "@packages/tooltip";
import { NotFound } from "./routes/NotFound";
import { Examples } from "./routes/Examples";
import { Playground } from "./routes/playground/Playground";
import { Documentation } from "./routes/documentation/Documentation";
import { ModalManager } from "@packages/modal";
import { useInitializeBreakpoints } from "./breakpoints";
import { MobileFooter } from "./components/HeaderLinks";
import { Header } from "./components/Header";
import { PopoverManager } from "@packages/popover";

function App() {
  useInitializeBreakpoints();

  return (
    <UIThemeProvider
      themes={customThemes}
      style={{
        transition:
          "color 0.5s ease, background-color 0.5s ease, border 0.5s ease, opacity 0.5s ease",
      }}
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
        <MobileFooter />
      </Layout>
      <TooltipManager />
      <ModalManager />
      <PopoverManager />
    </UIThemeProvider>
  );
}

export default App;
