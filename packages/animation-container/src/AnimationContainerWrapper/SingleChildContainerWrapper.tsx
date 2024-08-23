import { isValidElement, ReactElement, useRef, useState } from "react";
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
  onMount,
  onUnmount,
  options,
  clearAnimationOnExit,
  style,
  isUnmounted,
  finishedAnimation,
}: AnimationContainerWrapperProps & {
  children: ReactElement;
  isUnmounted: boolean;
  finishedAnimation?: () => void;
}) => {
  const [currentChild, setCurrentChild] = useState<ReactElement>(children);
  const isValid = isValidElement(children);
  const key = isValid ? children.key : null;
  const currentChildKey = useRef<string | null>(key);
  const keyAlreadyExists = doesKeyAlreadyExist({
    currentChildKey: currentChildKey.current,
    key,
  });

  return (
    <AnimationWrapper
      index={0}
      show={isUnmounted ? false : keyAlreadyExists}
      onMount={onMount}
      onUnmount={onUnmount}
      options={options}
      onAnimationEnd={() => {
        setCurrentChild(children);
        currentChildKey.current = key;
        finishedAnimation?.();
      }}
      clearAnimationOnExit={clearAnimationOnExit}
      style={style}
    >
      <div style={{ height: "inherit", width: "inherit" }}>{currentChild}</div>
    </AnimationWrapper>
  );
};
