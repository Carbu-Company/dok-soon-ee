"use client";

import React, { useState } from "react";
import styles from "./Dashboard.module.scss";

export default function CashTaxUnissuedList({ taxCashNoList }) {
  const rows = Array.isArray(taxCashNoList) ? taxCashNoList : [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      className={styles.container}
      aria-label="현금/세금계산서 미발행 리스트"
    >
      <h3 className={styles.title}>현금/세금계산서 미발행 리스트</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>구분</th>
              <th>담당 딜러</th>
              <th>판매 금액</th>
              <th>고객명</th>
              <th>발행</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <span
                    className={`${styles.badge} ${
                      row.CD_NM?.[1] === "전자세금계산서"
                        ? styles.badgePrimary
                        : ""
                    }`}
                  >
                    {row.CD_NM?.[1] || row.CD_NM?.[0]}
                  </span>
                </td>
                <td>{row.USR_NM}</td>
                <td>{row.PUR_AMT?.toLocaleString()}</td>
                <td>{row.OWNR_NM}</td>
                <td>
                  {row.issued ? (
                    <button type="button" className={styles.btn}>
                      발행취소
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.btn}
                      onClick={() => setIsModalOpen(true)}
                    >
                      발행하기
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 모달을 테이블 외부로 이동 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                똑순이 사용등록 요청
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p>사용등록 요청 기능이 준비 중입니다.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
