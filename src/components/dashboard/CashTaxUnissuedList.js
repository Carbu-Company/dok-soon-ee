"use client";

import React from "react";
import styles from "./Dashboard.module.scss";

export default function CashTaxUnissuedList({ taxCashNoList }) {
  const rows = taxCashNoList || [];
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
                    <button type="button" className={styles.btn}>
                      발행하기
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
