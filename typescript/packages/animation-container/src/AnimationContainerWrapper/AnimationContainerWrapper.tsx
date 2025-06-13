import { type AnimationContainerWrapperProps } from "./types";
import { SingleChildContainerWrapper } from "./SingleChildContainerWrapper";
import { MultiChildrenContainerWrapper } from "./MultiChildrenContainerWrapper";
import { type ReactElement, useContext, useEffect, useRef } from "react";
import { useIsDev } from "@packages/is-dev";
import { UnmountContext } from "./AnimationContainerUnmountWrapper/unmountContext";

type SetUpChildrenKeysArgs =
  | {
      areMultipleChildren: true;
      children: ReactElement[];
    }
  | {
      areMultipleChildren: false;
      children: ReactElement;
    };

const setupChildrenKeys = ({ areMultipleChildren, children }: SetUpChildrenKeysArgs) => {
  if (areMultipleChildren) {
    return children.reduce((str, current) => {
      return str + current.key;
    }, "");
  }

  return children.key;
};

export const AnimationContainerWrapper = ({
  children,
  changeMethod = "fullPhase",
  disableMountAnimationOnInit = true,
  ...rest
}: Omit<
  AnimationContainerWrapperProps,
  "clearLifeCycleAnimationOnExitRef" | "clearAnimationOnExitRef" | "disabledMountAnimationOnInit"
>) => {
  const wrapper = useContext(UnmountContext);
  const clearLifeCycleAnimationOnExitRef = useRef<(() => void)[]>([]);
  const { isDev } = useIsDev();
  const disabledMountAnimationOnInit = useRef(disableMountAnimationOnInit);
  const areMultipleChildren = Array.isArray(children);
  const initialChildrenIdentifier = useRef<string | null>(
    areMultipleChildren
      ? setupChildrenKeys({
          areMultipleChildren: true,
          children: children as ReactElement[],
        })
      : setupChildrenKeys({
          areMultipleChildren: false,
          children: children as ReactElement,
        }),
  );

  useEffect(() => {
    return () => {
      if (isDev) {
        return;
      }

      clearLifeCycleAnimationOnExitRef.current?.forEach((clearCallback) => {
        clearCallback();
      });
    };
  }, [isDev]);

  if (disabledMountAnimationOnInit.current) {
    const newChildrenKeys = areMultipleChildren
      ? setupChildrenKeys({
          areMultipleChildren: true,
          children: children as ReactElement[],
        })
      : setupChildrenKeys({
          areMultipleChildren: false,
          children: children as ReactElement,
        });

    if (newChildrenKeys !== initialChildrenIdentifier.current) {
      disabledMountAnimationOnInit.current = false;
    }
  }

  if (!children) {
    return null;
  }

  if (!areMultipleChildren) {
    return (
      <SingleChildContainerWrapper
        clearLifeCycleAnimationOnExitRef={clearLifeCycleAnimationOnExitRef}
        isUnmounted={!!wrapper?.isUnmounted}
        finishedAnimation={wrapper?.finishedAnimation}
        changeMethod={changeMethod}
        disabledMountAnimationOnInit={disabledMountAnimationOnInit.current}
        {...rest}
      >
        {children}
      </SingleChildContainerWrapper>
    );
  }

  return (
    <MultiChildrenContainerWrapper
      clearLifeCycleAnimationOnExitRef={clearLifeCycleAnimationOnExitRef}
      isUnmounted={!!wrapper?.isUnmounted}
      finishedAnimation={wrapper?.finishedAnimation}
      changeMethod={changeMethod}
      disabledMountAnimationOnInit={disabledMountAnimationOnInit.current}
      {...rest}
    >
      {children}
    </MultiChildrenContainerWrapper>
  );
};

// This is required for the identification of the component under AnimationContainerUnmountWrapper - in production using naming by detection is inconsistent due to optimizers that shorten variable names.
// Its also possible to use AnimationContainerWrapper.displayName = "AnimationContainerWrapper" instead of the current approach if desired to do so.

export const IS_ANIMATION_CONTAINER_WRAPPER = Symbol("isAnimationContainerWrapper");

AnimationContainerWrapper[IS_ANIMATION_CONTAINER_WRAPPER] = true;
