import type { Diff } from "./types";

type DiffArgs<T extends boolean | undefined = undefined> = {
  from: string | string[];
  to: string | string[];
  includeFlags?: boolean;
};

type Return = {
  result: Diff[];
  hasAdditions?: boolean;
  hasDeletions?: boolean;
};

type ResultOnly = Pick<Return, "result">;

export function diff(args: DiffArgs<true>): Return;
export function diff(args: DiffArgs): ResultOnly;
export function diff({ from, to, includeFlags }: DiffArgs): ResultOnly | Return {
  const fromLength = from.length;
  const toLength = to.length;
  const maximumAmountOfActions = fromLength + toLength; // Where from and to have no shared characters at all.
  // const offset = maximumAmountOfActions;
  // const xValues: number[] = Array.from({ length: maximumAmountOfActions * 2 + 1 }); // Maximum k for both positie and negative k's, alongside 0 as the divider.
  const offset = toLength;
  const xValues: number[] = Array.from({ length: maximumAmountOfActions + 1 }); // Maximum k for both positie and negative k's, alongside 0 as the divider.
  // xValues.fill(0);
  const trace: number[][] = [];

  const callback = !includeFlags ? backtrack : backtrackWithFlag;

  for (let d = 0; d < maximumAmountOfActions; d++) {
    for (let k = -d; k <= d; k += 2) {
      const kWithOffset = offset + k;

      const moveRight = xValues[kWithOffset - 1] ?? 0;
      const moveDown = xValues[kWithOffset + 1] ?? 0;

      let x;
      if (k === -d || (k !== d && moveRight < moveDown)) {
        // If moveDown's k is above moveRight, that means that by moving down we'll get to a flow with a higher x than the one when moving right.
        x = moveDown;
      } else {
        x = moveRight + 1;
      }

      let y = x - k;

      // Checkes for diagonals.
      while (x < fromLength && y < toLength && from[x] === to[y]) {
        x++;
        y++;
      }

      xValues[kWithOffset] = x;

      if (x >= fromLength && y >= toLength) {
        trace.push([...xValues]);
        return callback({ from, to, trace, offset });
      }
    }

    trace.push([...xValues]);
  }

  return { result: [] };
}

type BacktrackArgs = DiffArgs & {
  trace: number[][];
  offset: number;
};

const backtrack = ({ from, to, trace, offset }: BacktrackArgs) => {
  let x = from.length;
  let y = to.length;
  const result: Diff[] = [];

  for (let d = trace.length - 1; d >= 0; d--) {
    const values = trace[d];
    const k = x - y;
    let prevK;
    const moveRight = values[offset + k - 1] ?? 0;
    const moveDown = values[offset + k + 1] ?? 0;

    if (k === -d || (k !== d && moveRight < moveDown)) {
      // If moveDown's k is above moveRight, that means that by moving down we'll get to a flow with a higher x than the one when moving right.
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    const prevX = values[offset + prevK] ?? 0;
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      result.push({ type: "UNCHANGED", value: from[x - 1] });
      x--;
      y--;
    }

    if (x === prevX && y > 0) {
      result.push({ type: "ADDED", value: to[y - 1] });
      y--;
    } else if (x > 0 && y === prevY) {
      result.push({ type: "DELETED", value: from[x - 1] });
      x--;
    }
  }

  return { result: result.reverse() };
};

const backtrackWithFlag = ({ from, to, trace, offset }: BacktrackArgs) => {
  let x = from.length;
  let y = to.length;
  const result: Diff[] = [];
  let hasAdditions = false,
    hasDeletions = false;

  for (let d = trace.length - 1; d >= 0; d--) {
    const values = trace[d];
    const k = x - y;
    let prevK;
    const moveRight = values[offset + k - 1] ?? 0;
    const moveDown = values[offset + k + 1] ?? 0;

    if (k === -d || (k !== d && moveRight < moveDown)) {
      // If moveDown's k is above moveRight, that means that by moving down we'll get to a flow with a higher x than the one when moving right.
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    const prevX = values[offset + prevK] ?? 0;
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      result.push({ type: "UNCHANGED", value: from[x - 1] });
      x--;
      y--;
    }

    if (x === prevX && y > 0) {
      result.push({ type: "ADDED", value: to[y - 1] });
      y--;

      hasAdditions = true;
    } else if (x > 0 && y === prevY) {
      result.push({ type: "DELETED", value: from[x - 1] });
      x--;

      hasDeletions = true;
    }
  }

  return { result: result.reverse(), hasAdditions, hasDeletions };
};
