import { dynatic } from "@packages/dynatic-css";
import { Badge, type BadgeProps } from "./Badge";
import { combineStringsWithSpaces } from "@packages/string-utils";

type CounterBadgeProps = Omit<BadgeProps, "size"> & {
  size: number;
};

export const CounterBadge = ({ className, size, ...props }: CounterBadgeProps) => {
  return (
    <Badge
      {...props}
      className={combineStringsWithSpaces(
        dynatic`
          border-radius: 100%;
          width: ${size};
          height: ${size};
          padding: 0;
        `,
        className,
      )}
    />
  );
};
