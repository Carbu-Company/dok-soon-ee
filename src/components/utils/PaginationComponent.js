const MAX_VISIBLE_PAGES = 10; // 한 번에 보여질 최대 페이지 수

/**
 * 페이지네이션 컴포넌트
 */
const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
  show = true
}) => {
  if (!show) return null;

  /**
   * 이전 페이지로 이동
   */
  const goToPreviousPage = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  /**
   * 다음 페이지로 이동
   */
  const goToNextPage = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  /**
   * 보여질 페이지 번호들 계산
   */
  const getVisiblePageNumbers = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      // 전체 페이지가 최대 표시 개수보다 적으면 모든 페이지 표시
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(MAX_VISIBLE_PAGES / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

    // 끝 페이지가 조정되면 시작 페이지도 다시 계산
    if (endPage - startPage < MAX_VISIBLE_PAGES - 1) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pageNumbers = getVisiblePageNumbers();

  return (
    <div className="pagination">
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className="pagination__btn pagination__btn--prev"
      >
        이전
      </button>
      
      {/* 첫 페이지 표시 (현재 범위에 포함되지 않은 경우) */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`pagination__btn ${currentPage === 1 ? 'pagination__btn--active' : ''}`}
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="pagination__ellipsis">...</span>
          )}
        </>
      )}

      {/* 중간 페이지들 */}
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`pagination__btn ${currentPage === pageNumber ? 'pagination__btn--active' : ''}`}
        >
          {pageNumber}
        </button>
      ))}

      {/* 마지막 페이지 표시 (현재 범위에 포함되지 않은 경우) */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="pagination__ellipsis">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`pagination__btn ${currentPage === totalPages ? 'pagination__btn--active' : ''}`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="pagination__btn pagination__btn--next"
      >
        다음
      </button>
    </div>
  );
};

export default PaginationComponent; 