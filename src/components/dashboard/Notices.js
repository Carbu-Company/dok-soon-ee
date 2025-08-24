"use client";

import React from "react";
import styles from "./Dashboard.module.scss";

export default function Notices({ noticeStatus }) {
  const rows = noticeStatus || [];
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
                    {row.GUBUN}
                  </span>
                </td>
                <td>{row.NTC_TIT}</td>
                <td className={styles.mutedText}>{row.REG_DT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
