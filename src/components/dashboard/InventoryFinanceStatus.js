"use client";

import React from "react";
import styles from "./Dashboard.module.scss";

export default function InventoryFinanceStatus({ inventoryFinanceStatus }) {
  const rows = inventoryFinanceStatus || [];
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
                <td>{row.LOAN_CORP_NM}</td>
                <td>{row.TOT_LMT_AMT}</td>
                <td>{row.TOT_LOAN_AMT}</td>
                <td className={styles.mutedText}>{row.RT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
