import { Breakpoint } from "../types";

type MinWidthMedia = `(min-width: ${number}px)`;
type MaxWidthMedia = `(max-width: ${number}px)`;

export type ConstructedBreakpoint =
  | MinWidthMedia
  | MaxWidthMedia
  | `${MinWidthMedia} and ${MaxWidthMedia}`;

export type constructuedMediaBreakpoints<T extends Record<string, Breakpoint>> = Record<
  keyof T,
  ConstructedBreakpoint
>;
