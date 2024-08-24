import { ReactElement, useEffect, useRef, useState } from "react";
import { AnimationContainerWrapperProps } from "./types";
import { AnimationWrapper } from "./AnimationContainer";
import { getChildKeys } from "./utils";

type MultiChildrenContainerWrapper = AnimationContainerWrapperProps & {
  children: ReactElement[];
  isUnmounted: boolean;
  finishedAnimation?: () => void;
  changeMethod: "gradual" | "fullPhase";
};

export const MultiChildrenContainerWrapper = ({
  changeMethod,
  children,
  ...props
}: MultiChildrenContainerWrapper) => {
  if (changeMethod === "fullPhase") {
    return <FullPhase {...props}>{children}</FullPhase>;
  }

  return <Gradual {...props}>{children}</Gradual>;
};

const FullPhase = ({
  children,
  onMount,
  onUnmount,
  options,
  clearAnimationOnExit,
  style,
  isUnmounted,
  finishedAnimation,
}: Omit<MultiChildrenContainerWrapper, "changeMethod">) => {
  const [currentChildren, setCurrentChildren] = useState<ReactElement[]>(children);
  const [childrenKeys, setChildrenKeys] = useState(getChildKeys({ children }));
  const currentChildKeys = useRef<Set<string>>(getChildKeys({ children }));
  const latestChildrenRef = useRef<ReactElement[]>(children);

  useEffect(() => {
    latestChildrenRef.current = children;
    const updatedKeys = getChildKeys({ children });
    setChildrenKeys(updatedKeys);
    if (currentChildKeys.current.size > 0) {
      return;
    }

    currentChildKeys.current = updatedKeys;
    setCurrentChildren(children);
  }, [children]);

  return currentChildren.map((child, index) => {
    const keyAlreadyExists = childrenKeys.has(child.key!);

    return (
      <AnimationWrapper
        index={index}
        key={child.key}
        show={isUnmounted ? false : keyAlreadyExists}
        onMount={onMount}
        onUnmount={onUnmount}
        options={options}
        onAnimationEnd={() => {
          currentChildKeys.current.delete(child.key!);
          if (currentChildKeys.current.size > 0) {
            return;
          }

          if (isUnmounted) {
            finishedAnimation?.();
          } else {
            const updatedKeys = getChildKeys({
              children: latestChildrenRef.current,
            });
            currentChildKeys.current = updatedKeys;
            setCurrentChildren(latestChildrenRef.current);
          }
        }}
        clearAnimationOnExit={clearAnimationOnExit}
        style={style}
      >
        <div style={{ height: "inherit", width: "inherit" }}>{child}</div>
      </AnimationWrapper>
    );
  });
};

const Gradual = ({
  children,
  onMount,
  onUnmount,
  options,
  clearAnimationOnExit,
  style,
  isUnmounted,
  finishedAnimation,
}: Omit<MultiChildrenContainerWrapper, "changeMethod">) => {
  const [currentChildren, setCurrentChildren] = useState<ReactElement[]>(children);
  const [childrenKeys, setChildrenKeys] = useState(getChildKeys({ children }));

  useEffect(() => {
    const currentChildrenKeys = new Set<string>(children.map((child) => child.key ?? ""));
    const removedChildren: { element: ReactElement; index: number }[] = [];

    currentChildren.forEach((child, index) => {
      const stillExists = currentChildrenKeys.has(child.key ?? "");
      if (!stillExists) {
        removedChildren.push({ element: child, index });
      }
    });

    const updatedChildren = [...children];

    removedChildren.forEach((child) => {
      const { element, index } = child;
      updatedChildren.splice(index, 0, element);
    });

    setCurrentChildren(updatedChildren);
    setChildrenKeys(getChildKeys({ children }));
  }, [children]);

  const removeCurrentChild = (child: ReactElement) => {
    const key = child.key;
    setCurrentChildren((prev) => {
      return prev.filter((curr) => {
        const currKey = curr.key;

        return currKey !== key;
      });
    });
  };

  return currentChildren.map((child, index) => {
    const keyAlreadyExists = childrenKeys.has(child.key!);

    return (
      <AnimationWrapper
        index={index}
        key={child.key}
        show={isUnmounted ? false : keyAlreadyExists}
        onMount={onMount}
        onUnmount={onUnmount}
        options={options}
        onAnimationEnd={() => {
          removeCurrentChild(child);
          finishedAnimation?.();
        }}
        clearAnimationOnExit={clearAnimationOnExit}
        style={style}
      >
        <div style={{ height: "inherit", width: "inherit" }}>{child}</div>
      </AnimationWrapper>
    );
  });
};
