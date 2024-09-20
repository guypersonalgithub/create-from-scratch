import "./styles.css";

type SkeletonProps = {
  height?: number | `${number}%`;
  width?: number | `${number}%`;
  borderRadius?: number;
  backgroundColor?: string;
};

export const Skeleton = ({
  height = 0,
  width = 0,
  borderRadius = 4,
  backgroundColor = "#e0e0e0",
}: SkeletonProps) => {
  return (
    <div
      style={{
        height: typeof height === "string" && height.includes("%") ? height : `${height}px`,
        width: typeof width === "string" && width.includes("%") ? width : `${width}px`,
        borderRadius: `${borderRadius}px`,
        backgroundColor,
      }}
      className="skeleton"
    />
  );
};
