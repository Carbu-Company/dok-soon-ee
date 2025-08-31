"use client";

import React from "react";
import styles from "./Dashboard.module.scss";

export default function SalesPurchaseSummary({ salesPurchaseSummary }) {
  const rows = salesPurchaseSummary || [];

  console.log(rows);

  return (
    <div className={styles.salesPurchaseContainer}>
      <div className={styles.salesPurchaseTitle}>매입/매출 현황</div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th rowSpan={2} className={styles.categoryHeader}>
                구분
              </th>
              <th rowSpan={2} className={styles.countHeader}>
                건수
              </th>
              <th colSpan={3} className={styles.purchasePriceHeader}>
                매입가
              </th>
              <th rowSpan={2} className={styles.financeHeader}>
                재고금융
              </th>
              <th rowSpan={2} className={styles.financeHeader}>
                성능비
              </th>
              <th rowSpan={2} className={styles.financeHeader}>
                취득세
              </th>
              <th rowSpan={2} className={styles.financeHeader}>
                매입비
              </th>
            </tr>
            <tr>
              <th className={styles.subHeader}>공급가</th>
              <th className={styles.subHeader}>부가세</th>
              <th className={styles.subHeader}>합계 금액</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className={row.kind === "합계" ? styles.totalRow : ""}
              >
                <td className={styles.categoryCell}>{row.GUBUN}</td>
                <td className={styles.countCell}>{row.CNT?.toLocaleString()}</td>
                <td className={styles.priceCell}>{row.SUP_AMT?.toLocaleString()}</td>
                <td className={styles.priceCell}>{row.VAT?.toLocaleString()}</td>
                <td className={styles.priceCell}>{row.AMT?.toLocaleString()}</td>
                <td
                  className={`${styles.financeCell} ${
                    row.kind === "매출" ? styles.negativeText : ""
                  }`}
                >
                  {row.CAR_LOAN_AMT?.toLocaleString()}
                </td>
                <td
                  className={`${styles.financeCell} ${
                    row.kind === "매출" ? styles.accentText : ""
                  }`}
                >
                  {row.TOT_CMRC_COST_FEE?.toLocaleString()}
                </td>
                <td
                  className={`${styles.financeCell} ${
                    row.kind === "매출" ? styles.accentText : ""
                  }`}
                >
                  {row.GAIN_TAX?.toLocaleString()}
                </td>
                <td
                  className={`${styles.financeCell} ${
                    row.kind === "매출" ? styles.accentText : ""
                  }`}
                >
                  {row.TOT_PAY_FEE?.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
