"use client";

import React from 'react';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 10, 
  onPageChange,
  showPrevNext = true,
  showEllipsis = true,
  maxVisiblePages = 5 
}) => {
  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 maxVisiblePages보다 적으면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지를 중심으로 페이지 번호 생성
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      // 끝에서 시작점 조정
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      // 시작 페이지가 1이 아니면 1과 ... 추가
      if (start > 1) {
        pages.push(1);
        if (start > 2 && showEllipsis) {
          pages.push('...');
        }
      }
      
      // 중간 페이지들 추가
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // 끝 페이지가 totalPages가 아니면 ...과 마지막 페이지 추가
      if (end < totalPages) {
        if (end < totalPages - 1 && showEllipsis) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageClick = (page) => {
    if (typeof page === 'number' && page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  };

  const handlePrevClick = () => {
    if (onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      {showPrevNext && (
        <a 
          href="#" 
          className="pagination__btn pagination__btn--prev"
          onClick={(e) => {
            e.preventDefault();
            handlePrevClick();
          }}
        >
          이전
        </a>
      )}
      
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <a key={`ellipsis-${index}`} href="#" className="pagination__btn">
              ...
            </a>
          );
        }
        
        return (
          <a
            key={page}
            href="#"
            className={`pagination__btn ${page === currentPage ? 'on' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(page);
            }}
          >
            {page}
          </a>
        );
      })}
      
      {showPrevNext && (
        <a 
          href="#" 
          className="pagination__btn pagination__btn--next"
          onClick={(e) => {
            e.preventDefault();
            handleNextClick();
          }}
        >
          다음
        </a>
      )}
    </div>
  );
};

export default Pagination;