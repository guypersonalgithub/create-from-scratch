import { ReactNode } from "react";
import { useGetBreakpoint } from "../breakpoints";
import { useUITheme } from "../UIThemes";

type StyledListProps = {
  list: {
    icon: ReactNode;
    title: ReactNode;
    subTitle: ReactNode;
    example?: ReactNode;
  }[];
};

export const StyledList = ({ list }: StyledListProps) => {
  const { breakpoint } = useGetBreakpoint();
  const isDesktop = breakpoint === "desktop";
  const { currentTheme } = useUITheme();
  const isLight = currentTheme === "light";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
      {list.map((row, index) => {
        return (
          <div key={index}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: isDesktop ? "center" : "start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#334155",
                  borderRadius: "10px",
                  height: "40px",
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "var(--theme-transition)",
                  color: isLight ? "var(--theme-background)" : "var(--theme-thirdColor)"
                }}
              >
                {row.icon}
              </div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "18px" }}>{row.title}</div>
                <div style={{ fontSize: "14px", color: "#94A3B8" }}>{row.subTitle}</div>
              </div>
            </div>
            {row.example}
          </div>
        );
      })}
    </div>
  );
};
