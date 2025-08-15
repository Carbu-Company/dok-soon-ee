"use client";

import React from "react";
import styles from "./Dashboard.module.scss";

export default function OneToOneInquiry({ inquiries }) {
  const rows =
    inquiries && inquiries.length
      ? inquiries
      : [
          { content: "문의입니다.", date: "2025-07-04" },
          { content: "확인바랍니다. [2]", date: "2025-07-04" },
        ];

  return (
    <section className={styles.container} aria-label="1대1 문의">
      <h3 className={styles.title}>1:1 문의</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>문의 내용</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>{row.content}</td>
                <td className={styles.mutedText}>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
