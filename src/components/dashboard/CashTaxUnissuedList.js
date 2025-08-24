"use client";

import React, { useState } from "react";
import styles from "./Dashboard.module.scss";
import CashTaxModal from "../modal/CashTaxModal";
import Sample from "../modal/RegisterModal";

export default function CashTaxUnissuedList({ taxCashNoList }) {
  const rows = taxCashNoList || [];
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showSampleModal, setShowSampleModal] = useState(false);
  return (
    <>
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
                <th>인증하기</th>
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
                        onClick={() => {
                          setSelectedRow(row);
                          setShowModal(true);
                        }}
                      >
                        발행하기
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setShowSampleModal(true);
                      }}
                    >
                      인증하기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CashTaxModal
        open={showModal}
        onClose={() => setShowModal(false)}
        data={selectedRow}
      />
      <Sample
        open={showSampleModal}
        onClose={() => setShowSampleModal(false)}
      />
    </>
  );
}
