import { useEffect } from "react";
import { PaginationModel } from "../../../model/common/paginationmodel";

export const PaginationService = (
  page: number,
  totalPages: number,
  onPageChange: (page: number) => void
): PaginationModel.ServiceReturn => {
  useEffect(() => {
    if (totalPages === 0 && page !== 1) {
      onPageChange(1);
      return;
    }

    if (totalPages > 0 && page > totalPages) {
      onPageChange(totalPages);
    }
  }, [page, totalPages, onPageChange]);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return {
    page,
    totalPages,
    goToPage,
  };
};