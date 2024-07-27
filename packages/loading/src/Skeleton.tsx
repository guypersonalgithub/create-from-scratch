import "./styles.css";

type SkeletonProps = {
  height?: number;
  width?: number;
  borderRadius?: number;
  backgroundColor?: string;
};

export const Skeleton = ({ height, width, borderRadius, backgroundColor }: SkeletonProps) => {
  return (
    <div
      style={{
        height: `${height}px`,
        width: `${width}px`,
        borderRadius: `${borderRadius}px`,
        backgroundColor,
      }}
      className="skeleton"
    />
  );
};
