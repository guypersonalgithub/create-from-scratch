import { StyledButton } from "../StyledButton";
import { useUITheme } from "../UIThemes";

export const Main = () => {
  const test = useUITheme();
  console.log({ test });

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h1>JS to YAML</h1>
        <h3>A beautiful and minimal component library for modern web applications</h3>
        <StyledButton style={{ margin: "0 auto" }}>testing</StyledButton>
      </div>
    </div>
  );
};
