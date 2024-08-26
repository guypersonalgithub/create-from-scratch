import { ReactElement, useEffect, useRef, useState } from "react";
import { AnimationContainerWrapperProps } from "./types";
import { AnimationWrapper } from "./AnimationContainer";
import { getChildKeys } from "./utils";

type SingleChildContainerWrapperProps = AnimationContainerWrapperProps & {
  children: ReactElement;
  isUnmounted: boolean;
  finishedAnimation?: () => void;
  changeMethod: "gradual" | "fullPhase";
};

export const SingleChildContainerWrapper = ({
  changeMethod,
  children,
  ...props
}: SingleChildContainerWrapperProps) => {
  if (changeMethod === "fullPhase") {
    return <FullPhase {...props}>{children}</FullPhase>;
  }

  return <Gradual {...props}>{children}</Gradual>;
};

const FullPhase = ({
  children,
  onUnmountAnimationEnd,
  isUnmounted,
  finishedAnimation,
  ...rest
}: Omit<SingleChildContainerWrapperProps, "changeMethod">) => {
  const [currentChild, setCurrentChild] = useState<ReactElement>(children);
  const currentChildKey = useRef<string | null>(children.key);
  const keyAlreadyExists = currentChildKey.current === children.key;

  useEffect(() => {
    if (!rest.onMount && !rest.onUnmount) {
      setCurrentChild(children);
    }
  }, [children]);

  return (
    <AnimationWrapper
      index={0}
      show={isUnmounted ? false : keyAlreadyExists}
      onUnmountAnimationEnd={() => {
        setCurrentChild(children);
        currentChildKey.current = children.key;
        finishedAnimation?.();
        onUnmountAnimationEnd?.();
      }}
      {...rest}
    >
      <div style={{ height: "inherit", width: "inherit" }}>{currentChild}</div>
    </AnimationWrapper>
  );
};

const Gradual = ({
  children,
  onUnmountAnimationEnd,
  isUnmounted,
  finishedAnimation,
  ...rest
}: Omit<SingleChildContainerWrapperProps, "changeMethod">) => {
  const [currentChildren, setCurrentChildren] = useState<ReactElement[]>([children]);
  const [childrenKeys, setChildrenKeys] = useState(getChildKeys({ children: [children] }));

  useEffect(() => {
    const currentChildrenKeys = new Set<string>([children.key ?? ""]);
    const removedChildren: { element: ReactElement; index: number }[] = [];

    currentChildren.forEach((child, index) => {
      const stillExists = currentChildrenKeys.has(child.key ?? "");
      if (!stillExists) {
        removedChildren.push({ element: child, index });
      }
    });

    const updatedChildren = [children];

    removedChildren.forEach((child) => {
      const { element, index } = child;
      updatedChildren.splice(index, 0, element);
    });

    setCurrentChildren(updatedChildren);
    setChildrenKeys(getChildKeys({ children: [children] }));
  }, [children]);

  const removeCurrentChild = ({ child }: { child: ReactElement }) => {
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
        key={child.key}
        index={index}
        show={isUnmounted ? false : keyAlreadyExists}
        onUnmountAnimationEnd={() => {
          removeCurrentChild({ child });
          finishedAnimation?.();
          onUnmountAnimationEnd?.();
        }}
        {...rest}
      >
        <div style={{ height: "inherit", width: "inherit" }}>{child}</div>
      </AnimationWrapper>
    );
  });
};
