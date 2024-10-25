import { ReactNode, useState } from "react";
import {
  AnimationContainerUnmountWrapper,
  AnimationContainerWrapper,
} from "@packages/animation-container";

type CollapsibleProps = {
  title: string;
  isOpenInitially?: boolean;
  maximumContentHeight: number;
  children: ReactNode;
};

export const Collapsible = ({ title, isOpenInitially, maximumContentHeight, children }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  return (
    <div>
      <div
        style={{
          cursor: "pointer",
          width: "fit-content",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
          }}
        >
          {title}
          <div
            style={{
              width: "0px",
              height: "0px",
              borderBottom: "6px solid transparent",
              borderTop: "6px solid transparent",
              borderLeft: "6px solid black",
              transition: "transform 0.3s ease",
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>
      <AnimationContainerUnmountWrapper changeMethod="gradual">
        {isOpen ? (
          <AnimationContainerWrapper
            key="test"
            changeMethod="fullPhase"
            onMount={[{ height: "0px" }, { height: `${maximumContentHeight}px` }]}
          >
            <>{children}</>
          </AnimationContainerWrapper>
        ) : (
          <></>
        )}
      </AnimationContainerUnmountWrapper>
    </div>
  );
};
