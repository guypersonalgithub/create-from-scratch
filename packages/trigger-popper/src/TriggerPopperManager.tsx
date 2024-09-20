import { useState, useEffect, useRef } from "react";
import { TriggerPopperDisplayProps } from "./types";
import {
  AnimationContainerUnmountWrapper,
  AnimationContainerWrapper,
} from "@packages/animation-container";

export const TriggerPopperManager = () => {
  const [triggerPoppers, setTriggerPoppers] = useState<TriggerPopperDisplayProps[]>([]);
  const triggerPopperIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const showTriggerPopper = (event: CustomEvent<TriggerPopperDisplayProps>) => {
      const { id, content, style, onMount, onUnmount, mountOptions, unmountOptions } = event.detail;
      if (triggerPopperIds.current.has(id)) {
        return;
      }

      setTriggerPoppers((prev) => [
        ...prev,
        { id, content, style, onMount, onUnmount, mountOptions, unmountOptions },
      ]);
      triggerPopperIds.current.add(id);
    };

    const hideTriggerPopper = (event: CustomEvent<TriggerPopperDisplayProps>) => {
      const { id } = event.detail;

      if (!triggerPopperIds.current.has(id)) {
        return;
      }

      triggerPopperIds.current.delete(id);
      setTriggerPoppers((prev) => {
        const remainingTriggerPoppers = prev.filter((triggerPopper) => triggerPopper.id !== id);
        triggerPopperIds.current = new Set();

        remainingTriggerPoppers.forEach((triggerPopper) => {
          triggerPopperIds.current.add(triggerPopper.id);
        });
        return remainingTriggerPoppers;
      });
    };

    window.addEventListener("showTriggerPopper", showTriggerPopper as EventListener);
    window.addEventListener("hideTriggerPopper", hideTriggerPopper as EventListener);

    return () => {
      window.removeEventListener("showTriggerPopper", showTriggerPopper as EventListener);
      window.removeEventListener("hideTriggerPopper", hideTriggerPopper as EventListener);
    };
  }, []);

  return (
    <AnimationContainerUnmountWrapper changeMethod="gradual">
      {triggerPoppers.map(
        ({ id, content, style, onMount, onUnmount, mountOptions, unmountOptions }) => {
          return (
            <AnimationContainerWrapper
              key={id}
              style={style}
              onMount={onMount}
              onUnmount={onUnmount}
              mountOptions={mountOptions}
              unmountOptions={unmountOptions}
              changeMethod="fullPhase"
            >
              <div key={id}>{content}</div>
            </AnimationContainerWrapper>
          );
        },
      )}
    </AnimationContainerUnmountWrapper>
  );
};
