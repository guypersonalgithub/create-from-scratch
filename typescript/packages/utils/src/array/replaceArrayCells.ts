export const replaceArrayCells = <T>(
  arr: T[],
  startIndex: number,
  endIndex: number,
  replacement: T,
) => {
  const deleteCount = endIndex - startIndex + 1;
  arr.splice(startIndex, deleteCount, replacement);
  return arr;
};
