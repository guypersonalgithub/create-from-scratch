type CalculateCurrentDisplayedRowIndexesArgs = {
  rowsPerPage?: number;
  currentPage?: number;
  amountOfRows: number;
};

export const calculateCurrentDisplayedRowIndexes = ({
  rowsPerPage,
  currentPage,
  amountOfRows,
}: CalculateCurrentDisplayedRowIndexesArgs) => {
  if (!rowsPerPage || !currentPage) {
    return {
      startingIndex: 0,
      endingIndex: amountOfRows,
    };
  }

  const startingIndex = (currentPage - 1) * rowsPerPage;
  const endingIndex = startingIndex + rowsPerPage;

  return {
    startingIndex,
    endingIndex,
  };
};

type GetDisplayedRowsArgs<T> = CalculateCurrentDisplayedRowIndexesArgs & {
  data: T[]
}

export const getDisplayedRows = <T>({ rowsPerPage, currentPage, amountOfRows, data }: GetDisplayedRowsArgs<T>) => {
  const { startingIndex, endingIndex } = calculateCurrentDisplayedRowIndexes({
    rowsPerPage,
    currentPage,
    amountOfRows,
  });
  const displayedDataRows = data.slice(startingIndex, endingIndex);
  return displayedDataRows;
}
