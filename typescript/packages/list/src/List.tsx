import { type ReactNode, type CSSProperties } from "react";
import { type SupportedTags } from "./type";

type ListProps<T extends SupportedTags> = {
  items: ReactNode[];
  as?: T;
  style?: CSSProperties;
};

export const List = <T extends SupportedTags>({ items, as, style }: ListProps<T>) => {
  const Tag = as || "ul";

  return (
    <Tag style={style}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </Tag>
  );
};
