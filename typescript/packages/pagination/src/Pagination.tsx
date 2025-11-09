import { type CSSProperties } from "react";
import { Button, type ButtonProps } from "@packages/button";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxPagesToShow: number;
  pageButtonClassName?: string;
  pageButtonStyle?: CSSProperties;
  navigationButtonClassName?: string;
  navigationButtonStyle?: CSSProperties;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPagesToShow,
  pageButtonClassName,
  pageButtonStyle,
  navigationButtonClassName,
  navigationButtonStyle,
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
        <BaseButton
          key={1}
          onClick={() => handleClick({ page: 1 })}
          className={pageButtonClassName}
          style={pageButtonStyle}
        >
          1
        </BaseButton>,
      );

      if (startPage > 2) {
        pageNumbers.push(
          <span
            key="start-ellipsis"
            className={dynatic`
              height: 50px;
              display: flex;
              align-items: center;  
            `}
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
          className={
            currentPage === i
              ? dynatic`
                  background: default;
                  background-color: black;
                  color: white;
                `
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
            className={dynatic`
              height: 50px;
              display: flex;
              align-items: center;
              font-size: 20px;  
            `}
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

  const baseButtonClassNames = combineStringsWithSpaces(
    dynatic`
      font-size: 22px;

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    `,
    dynatic`
      cursor: pointer;
      border: none;
      background: none;
      width: 50px;
      height: 50px;
      border-radius: 10px;
      font-size: 18px;
      color: white;
    `,
    navigationButtonClassName,
  );

  return (
    <div
      className={dynatic`
        display: flex;
        list-style: none;
        padding: 0;
      `}
    >
      <BaseButton
        onClick={() => handleClick({ page: currentPage - 1 })}
        disabled={currentPage === 1 || totalPages === 0}
        className={baseButtonClassNames}
        style={navigationButtonStyle}
      >
        {"<"}
      </BaseButton>
      {renderPageNumbers()}
      <BaseButton
        onClick={() => handleClick({ page: currentPage + 1 })}
        disabled={currentPage === totalPages || totalPages === 0}
        className={baseButtonClassNames}
        style={navigationButtonStyle}
      >
        {">"}
      </BaseButton>
    </div>
  );
};

const BaseButton = ({ children, ...rest }: ButtonProps) => {
  return <Button {...rest}>{children}</Button>;
};
