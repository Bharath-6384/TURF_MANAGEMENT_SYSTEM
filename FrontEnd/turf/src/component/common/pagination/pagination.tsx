import { useState }                         from "react";
import { FontAwesomeIcon }                  from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight }    from "@fortawesome/free-solid-svg-icons";
import { PaginationModel }                  from "../../../model/common/paginationmodel";
import { PaginationService }                from "../../../services/service/common/paginationservice";
import "./pagination.css";

const Pagination = ({ page, totalPages, onPageChange }: PaginationModel.Props) => {
  const { goToPage } = PaginationService(page, totalPages, onPageChange);

  const [goToPageInput, setGoToPageInput] = useState("");

  const handleGoToPage = () => {
    const pageNumber = Number(goToPageInput);

    if (pageNumber && pageNumber >= 1 && pageNumber <= totalPages) {
      goToPage(pageNumber);
      setGoToPageInput("");
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 4) {
        pages.push("...");
      }

      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (page < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-left">
        <span className="pagination-label">Previous</span>

        <button
          className="pagination-btn pagination-arrow"
          disabled={page === 1 || totalPages === 0}
          onClick={() => goToPage(page - 1)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div className="pagination-pages">
          {getPageNumbers().map((item, index) =>
            item === "..." ? (
              <span key={`dots-${index}`} className="pagination-dots">...</span>
            ) : (
              <button
                key={item}
                className={`pagination-page ${page === item ? "active" : ""}`}
                onClick={() => goToPage(item as number)}
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          className="pagination-btn pagination-arrow"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => goToPage(page + 1)}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      <div className="pagination-right">
        <span className="go-to-label">Go to Page</span>

        <input
          type="number"
          min="1"
          max={totalPages}
          value={goToPageInput}
          onChange={(e) => setGoToPageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGoToPage();
            }
          }}
        />

        <button className="go-to-button" onClick={handleGoToPage} disabled={totalPages === 0}>
          Go
        </button>
      </div>
    </div>
  );
};

export default Pagination;