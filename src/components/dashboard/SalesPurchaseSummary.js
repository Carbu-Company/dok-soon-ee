"use client";

import React from "react";
import styles from "./Dashboard.module.scss";

export default function SalesPurchaseSummary({ rows }) {
  const defaultRows =
    rows && rows.length
      ? rows
      : [
          {
            kind: "매출",
            count: "100건",
            supply: "1,000,000원",
            tax: "100,000원",
            total: "1,100,000원",
            inventoryFinance: "500,000원",
            performanceFee: "50,000원",
            acquisitionTax: "150,000원",
            purchaseFee: "165,000원",
          },
          {
            kind: "매입",
            count: "100건",
            supply: "1,000,000원",
            tax: "100,000원",
            total: "1,100,000원",
            inventoryFinance: "500,000원",
            performanceFee: "50,000원",
            acquisitionTax: "150,000원",
            purchaseFee: "165,000원",
          },
          {
            kind: "합계",
            count: "100건",
            supply: "1,000,000원",
            tax: "100,000원",
            total: "1,100,000원",
            inventoryFinance: "500,000원",
            performanceFee: "50,000원",
            acquisitionTax: "150,000원",
            purchaseFee: "165,000원",
          },
        ];

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
            {defaultRows.map((row, index) => (
              <tr
                key={index}
                className={row.kind === "합계" ? styles.totalRow : ""}
              >
                <td className={styles.categoryCell}>{row.kind}</td>
                <td className={styles.countCell}>{row.count}</td>
                <td className={styles.priceCell}>{row.supply}</td>
                <td className={styles.priceCell}>{row.tax}</td>
                <td className={styles.priceCell}>{row.total}</td>
                <td
                  className={`${styles.financeCell} ${
                    row.kind === "매출" ? styles.negativeText : ""
                  }`}
                >
                  {row.inventoryFinance}
                </td>
                <td
                  className={`${styles.financeCell} ${
                    row.kind === "매출" ? styles.accentText : ""
                  }`}
                >
                  {row.performanceFee}
                </td>
                <td
                  className={`${styles.financeCell} ${
                    row.kind === "매출" ? styles.accentText : ""
                  }`}
                >
                  {row.acquisitionTax}
                </td>
                <td
                  className={`${styles.financeCell} ${
                    row.kind === "매출" ? styles.accentText : ""
                  }`}
                >
                  {row.purchaseFee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
