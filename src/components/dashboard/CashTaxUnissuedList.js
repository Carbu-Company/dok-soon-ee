"use client";

import React from "react";
import styles from "./Dashboard.module.scss";

export default function CashTaxUnissuedList({ items }) {
  const rows =
    items && items.length
      ? items
      : [
          {
            type: "현금",
            dealer: "홍길동",
            amount: "1,000,000원",
            customer: "홍길동",
            issued: false,
          },
          {
            type: "세금",
            dealer: "홍길동",
            amount: "1,000,000원",
            customer: "홍길동",
            issued: true,
          },
        ];

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
                      row.type === "세금" ? styles.badgePrimary : ""
                    }`}
                  >
                    {row.type}
                  </span>
                </td>
                <td>{row.dealer}</td>
                <td>{row.amount}</td>
                <td>{row.customer}</td>
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
