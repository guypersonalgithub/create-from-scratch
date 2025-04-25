import { CSSProperties, ReactNode } from "react";

type SpreaderTitleProps = {
  style?: CSSProperties;
  children: ReactNode;
};

export const SpreaderTitle = ({ style, children }: SpreaderTitleProps) => {
  return (
    <div style={{ fontSize: "30px", fontWeight: "bold", ...style }}>
      {children}
      <hr />
    </div>
  );
};
