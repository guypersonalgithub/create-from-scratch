import "./styles.css";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxPagesToShow: number;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPagesToShow,
}: PaginationProps) => {
  const handleClick = ({ page }: { page: number }) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(currentPage - halfPagesToShow, 1);
    let endPage = Math.min(currentPage + halfPagesToShow, totalPages);

    if (currentPage - halfPagesToShow < 1) {
      endPage = Math.min(endPage + (halfPagesToShow - currentPage + 1), totalPages);
    }

    if (currentPage + halfPagesToShow > totalPages) {
      startPage = Math.max(startPage - (currentPage + halfPagesToShow - totalPages), 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button key={1} onClick={() => handleClick({ page: 1 })} className="page-number">
          1
        </button>,
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="start-ellipsis" className="ellipsis">
            ...
          </span>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handleClick({ page: i })}
          className={`page-number ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" className="ellipsis">
            ...
          </span>,
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handleClick({ page: totalPages })}
          className="page-number"
        >
          {totalPages}
        </button>,
      );
    }

    return pageNumbers;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handleClick({ page: currentPage - 1 })}
        disabled={currentPage === 1 || totalPages === 0}
      >
        Previous
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => handleClick({ page: currentPage + 1 })}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        Next
      </button>
    </div>
  );
};
