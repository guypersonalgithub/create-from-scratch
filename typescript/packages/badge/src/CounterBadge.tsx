import { Badge, type BadgeProps } from "./Badge";

type CounterBadgeProps = Omit<BadgeProps, "size"> & {
  size: number;
};

export const CounterBadge = ({ size, ...props }: CounterBadgeProps) => {
  return (
    <Badge {...props} style={{ borderRadius: "100%", width: size, height: size, padding: 0 }} />
  );
};
