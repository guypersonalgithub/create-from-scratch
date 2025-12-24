import { Router } from "@packages/router";
import { Main } from "./routes/main/Main";
import { Layout } from "./components/Layout";
import { TooltipManager } from "@packages/tooltip";
import { NotFound } from "./routes/NotFound";
import { Examples } from "./routes/Examples";
import { Playground } from "./routes/playground/Playground";
import { Documentation } from "./routes/documentation/Documentation";
import { ModalManager } from "@packages/modal";
import { MobileFooter } from "./components/HeaderLinks";
import { Header } from "./components/Header";
import { PopoverManager } from "@packages/popover";
import { BreakpointsProvider } from "@packages/breakpoints";
import { breakpoints } from "./breakpoints";

const App = () => {
  return (
    <BreakpointsProvider breakpoints={breakpoints}>
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
    </BreakpointsProvider>
  );
};

export default App;
