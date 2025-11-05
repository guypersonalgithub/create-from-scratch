type WidthMediaQueryArgs =
  | {
      from: string;
      to?: string;
    }
  | {
      from?: string;
      to: string;
    };

export const widthMediaQuery = ({ from, to }: WidthMediaQueryArgs) => {
  const min = from ? `(min-width: ${from})` : "";
  const max = to ? `(max-width: ${to})` : "";
  const combined = [min, max].filter(Boolean).join(" and ");
  
  return `@media ${combined}`;
};
