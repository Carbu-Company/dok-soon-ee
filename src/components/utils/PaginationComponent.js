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
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          goToPreviousPage();
        }}
        className="pagination__btn pagination__btn--prev"
        style={{ 
          pointerEvents: currentPage === 1 ? 'none' : 'auto',
          opacity: currentPage === 1 ? 0.5 : 1 
        }}
      >
        이전
      </a>
      
      {/* 첫 페이지 표시 (현재 범위에 포함되지 않은 경우) */}
      {pageNumbers[0] > 1 && (
        <>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(1);
            }}
            className={`pagination__btn ${currentPage === 1 ? 'on' : ''}`}
          >
            1
          </a>
          {pageNumbers[0] > 2 && (
            <a href="#" className="pagination__btn" onClick={(e) => e.preventDefault()}>
              ...
            </a>
          )}
        </>
      )}

      {/* 중간 페이지들 */}
      {pageNumbers.map((pageNumber) => (
        <a
          key={pageNumber}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageChange(pageNumber);
          }}
          className={`pagination__btn ${currentPage === pageNumber ? 'on' : ''}`}
        >
          {pageNumber}
        </a>
      ))}

      {/* 마지막 페이지 표시 (현재 범위에 포함되지 않은 경우) */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <a href="#" className="pagination__btn" onClick={(e) => e.preventDefault()}>
              ...
            </a>
          )}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(totalPages);
            }}
            className={`pagination__btn ${currentPage === totalPages ? 'on' : ''}`}
          >
            {totalPages}
          </a>
        </>
      )}

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          goToNextPage();
        }}
        className="pagination__btn pagination__btn--next"
        style={{ 
          pointerEvents: currentPage === totalPages ? 'none' : 'auto',
          opacity: currentPage === totalPages ? 0.5 : 1 
        }}
      >
        다음
      </a>
    </div>
  );
};

export default PaginationComponent; 