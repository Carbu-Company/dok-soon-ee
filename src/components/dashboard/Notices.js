"use client";

import React from "react";
import styles from "./Dashboard.module.scss";

export default function Notices({ notices }) {
  const rows =
    notices && notices.length
      ? notices
      : [
          { type: "개별", title: "공지입니다.", date: "2025-07-04" },
          { type: "전체", title: "공지입니다.", date: "2025-07-04" },
        ];

  return (
    <section className={styles.container} aria-label="공지사항">
      <h3 className={styles.title}>공지사항</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>구분</th>
              <th>총 한도</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <span
                    className={`${styles.badge} ${
                      row.type === "전체" ? styles.badgePrimary : ""
                    }`}
                  >
                    {row.type}
                  </span>
                </td>
                <td>{row.title}</td>
                <td className={styles.mutedText}>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
