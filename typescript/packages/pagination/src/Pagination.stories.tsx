import type { Meta } from "@storybook/react";
import { Pagination } from "./Pagination";
import { useState } from "react";

const meta = {
  title: "Pagination",
  component: Pagination,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Pagination>;

export default meta;

export const Primary = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={(page) => setCurrentPage(page)}
        maxPagesToShow={5}
      />
    );
  },
};
