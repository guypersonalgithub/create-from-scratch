export const baseTrace = [
  { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, step: 0 },
  { from: { x: 1, y: 0 }, to: { x: 2, y: 0 }, step: 1 },
  { from: { x: 2, y: 0 }, to: { x: 3, y: 0 }, step: 2 },
  { from: { x: 0, y: 0 }, to: { x: 0, y: 1 }, step: 0 },
  { from: { x: 0, y: 1 }, to: { x: 0, y: 2 }, step: 1 },
  { from: { x: 0, y: 2 }, to: { x: 0, y: 3 }, step: 2 },
];

const additionalTrace = [
  { from: { x: 1, y: 0 }, to: { x: 1, y: 1 }, step: 1 },
  { from: { x: 1, y: 1 }, to: { x: 2, y: 1 }, step: 2 },
  { from: { x: 1, y: 1 }, to: { x: 1, y: 2 }, step: 2 },
  { from: { x: 0, y: 1 }, to: { x: 1, y: 1 }, step: 1 },
  { from: { x: 2, y: 0 }, to: { x: 2, y: 1 }, step: 2 },
  { from: { x: 0, y: 2 }, to: { x: 1, y: 2 }, step: 2 },
];

export const combinedTrace = [
  ...additionalTrace,
  ...baseTrace.map((trace) => ({ ...trace, color: "green" })),
];
