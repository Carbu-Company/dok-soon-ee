"use client";

import React from "react";
import styles from "./modal.module.scss";

export default function CashTaxModal({ open, onClose, data }) {
  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="닫기"
        >
          ×
        </button>
        <h2 style={{ marginTop: 0 }}>현금/세금계산서 발행</h2>

        <div>
          <p>
            <strong>담당 딜러:</strong> {data?.USR_NM || "-"}
          </p>
          <p>
            <strong>판매 금액:</strong> {data?.PUR_AMT?.toLocaleString() || "-"}
          </p>
          <p>
            <strong>고객명:</strong> {data?.OWNR_NM || "-"}
          </p>
          <p>
            <strong>구분:</strong> {data?.CD_NM?.[1] || data?.CD_NM?.[0] || "-"}
          </p>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} style={{ marginRight: 8 }}>
            취소
          </button>
          <button
            onClick={() => {
              // TODO: 실제 발행 API 호출을 여기에서 수행하세요.
              onClose();
            }}
          >
            발행
          </button>
        </div>
      </div>
    </div>
  );
}
