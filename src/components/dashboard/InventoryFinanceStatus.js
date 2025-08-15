"use client";

import React from "react";
import styles from "./Dashboard.module.scss";

export default function InventoryFinanceStatus({ items }) {
  const rows =
    items && items.length
      ? items
      : [
          {
            name: "A캐피탈",
            limit: "500,000,000원",
            loan: "300,000,000원",
            usage: "76%",
          },
          {
            name: "B캐피탈",
            limit: "500,000,000원",
            loan: "300,000,000원",
            usage: "76%",
          },
        ];

  return (
    <section className={styles.container} aria-label="재고금융 이용 현황">
      <h3 className={styles.title}>재고금융 이용 현황</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>구분</th>
              <th>총 한도</th>
              <th>대출 금액</th>
              <th>사용률</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>{row.name}</td>
                <td>{row.limit}</td>
                <td>{row.loan}</td>
                <td className={styles.mutedText}>{row.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
