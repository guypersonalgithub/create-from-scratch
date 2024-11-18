import { CSSProperties, ReactNode } from "react";

type TableHeaderProps = {
  children: ReactNode;
  staticColumn?: boolean;
  columnStyle?: (index: number) => CSSProperties | undefined;
  index: number;
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
  columnStyle,
  index,
  size,
  className,
}: TableHeaderProps) => {
  const style = columnStyle?.(index) ?? {};

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
        ...style,
      }}
    >
      {children}
    </div>
  );
};
