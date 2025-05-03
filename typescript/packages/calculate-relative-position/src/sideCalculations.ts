import { RefObject } from "react";

type CalculateLeftArgs = {
  ref: RefObject<HTMLDivElement | null>;
  edgeLeft: number;
  width: number;
};

export const calculateLeft = ({ ref, edgeLeft, width }: CalculateLeftArgs) => {
  ref.current!.style.left = `${edgeLeft - width}px`;
};

type CalculateRightArgs = {
  ref: RefObject<HTMLDivElement | null>;
  edgeRight: number;
};

export const calculateRight = ({ ref, edgeRight }: CalculateRightArgs) => {
  ref.current!.style.left = `${edgeRight}px`;
};

type CalculateMiddleArgs = {
  ref: RefObject<HTMLDivElement | null>;
  edgeLeft: number;
  edgeWidth: number;
  width: number;
};

export const calculateMiddle = ({ ref, edgeLeft, edgeWidth, width }: CalculateMiddleArgs) => {
  const centerPoint = edgeLeft + edgeWidth / 2;
  const leftPosition = centerPoint - width / 2;
  ref.current!.style.left = `${leftPosition}px`;
};

type CalculateBottomArgs = {
  ref: RefObject<HTMLDivElement | null>;
  edgeBottom: number;
};

export const calculateBottom = ({ ref, edgeBottom }: CalculateBottomArgs) => {
  ref.current!.style.top = `${edgeBottom}px`;
};

type CalculateTopArgs = {
  ref: RefObject<HTMLDivElement | null>;
  edgeTop: number;
  height: number;
};

export const calculateTop = ({ ref, edgeTop, height }: CalculateTopArgs) => {
  ref.current!.style.top = `${edgeTop - height}px`;
};
