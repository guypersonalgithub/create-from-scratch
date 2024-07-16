import { AnimationContainerWrapperProps } from "./types";
import { SingleChildContainerWrapper } from "./SingleChildContainerWrapper";
import { MultiChildrenContainerWrapper } from "./MultiChildrenContainerWrapper";

export const AnimationContainerWrapper = ({
  children,
  from,
  to,
  options,
}: AnimationContainerWrapperProps) => {
  if (!Array.isArray(children)) {
    return (
      <SingleChildContainerWrapper from={from} to={to} options={options}>
        {children}
      </SingleChildContainerWrapper>
    );
  }

  return (
    <MultiChildrenContainerWrapper from={from} to={to} options={options}>
      {children}
    </MultiChildrenContainerWrapper>
  );
};
