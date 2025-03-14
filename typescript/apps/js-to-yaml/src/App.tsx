import { Router } from "@packages/router";
import { UIThemeProvider } from "@packages/ui-theme";
import { customThemes } from "./UIThemes";
import { Main } from "./routes/Main";
import { Header } from "./Layout";

function App() {
  return (
    <UIThemeProvider themes={customThemes}>
      <div
        style={{
          height: "100vh",
          backgroundImage:
            "linear-gradient(135deg, hsl(201 100% 36% / 0.1), hsl(246 100% 77% / 0.1))",
        }}
      >
        <Header />
        <Router
          paths={{
            "/": <Main />,
          }}
        />
      </div>
    </UIThemeProvider>
  );
}

export default App;
