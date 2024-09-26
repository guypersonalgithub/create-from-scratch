import { CSSProperties } from "react";
import { Button, ButtonProps } from "@packages/button";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxPagesToShow: number;
  pageButtonStyle?: CSSProperties;
  navigationButtonStyle?: CSSProperties;
};

const commonStyle: CSSProperties = {
  cursor: "pointer",
  border: "none",
  background: "none",
  width: "50px",
  height: "50px",
  borderRadius: "10px",
  fontSize: "18px",
  color: "white",
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPagesToShow,
  pageButtonStyle,
  navigationButtonStyle = {},
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
        <BaseButton key={1} onClick={() => handleClick({ page: 1 })} style={pageButtonStyle}>
          1
        </BaseButton>,
      );

      if (startPage > 2) {
        pageNumbers.push(
          <span
            key="start-ellipsis"
            style={{
              height: "50px",
              display: "flex",
              alignItems: "center",
            }}
          >
            ...
          </span>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <BaseButton
          key={i}
          onClick={() => handleClick({ page: i })}
          style={
            currentPage === i
              ? {
                  background: "default",
                  backgroundColor: "black",
                  color: "white",
                }
              : undefined
          }
        >
          {i}
        </BaseButton>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span
            key="end-ellipsis"
            style={{
              height: "50px",
              display: "flex",
              alignItems: "center",
              fontSize: "20px",
            }}
          >
            ...
          </span>,
        );
      }
      
      pageNumbers.push(
        <BaseButton key={totalPages} onClick={() => handleClick({ page: totalPages })}>
          {totalPages}
        </BaseButton>,
      );
    }

    return pageNumbers;
  };

  return (
    <div style={{ display: "flex", listStyle: "none", padding: 0 }}>
      <BaseButton
        onClick={() => handleClick({ page: currentPage - 1 })}
        disabled={currentPage === 1 || totalPages === 0}
        style={{ fontSize: "22px", ...navigationButtonStyle }}
        disabledCSS={{ cursor: "not-allowed", opacity: 0.5 }}
      >
        {"<"}
      </BaseButton>
      {renderPageNumbers()}
      <BaseButton
        onClick={() => handleClick({ page: currentPage + 1 })}
        disabled={currentPage === totalPages || totalPages === 0}
        style={{ fontSize: "22px", ...navigationButtonStyle }}
        disabledCSS={{ cursor: "not-allowed", opacity: 0.5 }}
      >
        {">"}
      </BaseButton>
    </div>
  );
};

const BaseButton = ({ children, style = {}, ...rest }: ButtonProps) => {
  return (
    <Button style={{ ...commonStyle, ...style }} {...rest}>
      {children}
    </Button>
  );
};
