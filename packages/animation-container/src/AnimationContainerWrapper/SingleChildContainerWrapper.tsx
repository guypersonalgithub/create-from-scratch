import { isValidElement, ReactNode, useRef, useState, useEffect } from "react";
import { AnimationContainerWrapperProps } from "./types";
import { AnimationWrapper } from "./AnimationContainer";

type DoesKeyAlreadyExistArgs = {
  currentChildKey: string | null;
  key: string | null;
};

const doesKeyAlreadyExist = ({ currentChildKey, key }: DoesKeyAlreadyExistArgs) => {
  return currentChildKey === key;
};

export const SingleChildContainerWrapper = ({
  children,
  from,
  to,
  options,
}: AnimationContainerWrapperProps & { children: ReactNode }) => {
  const [currentChild, setCurrentChild] = useState<ReactNode>(children);
  const isValid = isValidElement(children);
  const key = isValid ? children.key : null;
  const currentChildKey = useRef<string | null>(key);
  const keyAlreadyExists = doesKeyAlreadyExist({
    currentChildKey: currentChildKey.current,
    key,
  });

  return (
    <AnimationWrapper
      show={keyAlreadyExists}
      from={from}
      to={to}
      options={options}
      onAnimationEnd={() => {
        setCurrentChild(children);
        currentChildKey.current = key;
      }}
    >
      <div style={{ height: "inherit", width: "inherit" }}>{currentChild}</div>
    </AnimationWrapper>
  );
};
