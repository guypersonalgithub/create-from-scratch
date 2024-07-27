type CalculateCurrentDisplayedRowIndexesArgs = {
  rowsPerPage: number;
  currentPage: number;
};

export const calculateCurrentDisplayedRowIndexes = ({
  rowsPerPage,
  currentPage,
}: CalculateCurrentDisplayedRowIndexesArgs) => {
  const startingIndex = (currentPage - 1) * rowsPerPage;
  const endingIndex = startingIndex + rowsPerPage;

  return {
    startingIndex,
    endingIndex,
  };
};
