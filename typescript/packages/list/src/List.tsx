import { type ReactNode, type CSSProperties } from "react";
import { type SupportedTags } from "./type";

type ListProps<T extends SupportedTags> = {
  items: ReactNode[];
  as?: T;
  className?: string;
  style?: CSSProperties;
};

export const List = <T extends SupportedTags>({ items, as, className, style }: ListProps<T>) => {
  const Tag = as || "ul";

  return (
    <Tag className={className} style={style}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </Tag>
  );
};
