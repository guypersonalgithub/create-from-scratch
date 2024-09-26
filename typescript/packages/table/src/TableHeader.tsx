import { ReactNode } from "react";

type TableHeaderProps = {
  children: ReactNode;
  staticColumn?: boolean;
} & (Size | ClassName);

type Size = {
  size: number;
  className?: never;
};

type ClassName = {
  size?: never;
  className: string;
};

export const TableHeader = ({
  children,
  staticColumn = true,
  size,
  className,
}: TableHeaderProps) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        height: "fit-content",
        textAlign: "left",
        flexGrow: staticColumn ? 0 : 1,
        whiteSpace: "nowrap",
        ...(size ? { width: `${size}px` } : {}),
      }}
    >
      {children}
    </div>
  );
};
