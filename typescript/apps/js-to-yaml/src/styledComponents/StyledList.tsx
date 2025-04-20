import { ReactNode } from "react";
import { useGetBreakpoint } from "../breakpoints";

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
      {list.map((row, index) => {
        return (
          <div key={index}>
            <div
              style={{ display: "flex", gap: "10px", alignItems: isDesktop ? "center" : "start" }}
            >
              <div
                style={{
                  backgroundColor: "rgba(0, 119, 184, 0.976)",
                  borderRadius: "10px",
                  height: "40px",
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {row.icon}
              </div>
              <div style={{ fontSize: "14px" }}>
                <div style={{ fontWeight: "bold" }}>{row.title}</div>
                <div>{row.subTitle}</div>
              </div>
            </div>
            {row.example}
          </div>
        );
      })}
    </div>
  );
};
