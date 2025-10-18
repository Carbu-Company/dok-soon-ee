"use client";

import React, { useState } from "react";
import styles from "./modal.module.scss";
import { getCashBillAmount } from "@/app/(main)/api/carApi";

export default function CashTaxModal({ open, onClose, data, session }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cashBillAmount, setCashBillAmount] = useState(null);

  if (!open) return null;

  // 현금영수증 금액 조회
  const fetchCashBillAmount = async () => {
    if (!data?.COST_SEQ && !data?.CAR_REG_ID) return;

    try {
      const result = await getCashBillAmount(data.COST_SEQ || data.CAR_REG_ID);
      if (result.success) {
        setCashBillAmount(result.data);
      }
    } catch (error) {
      console.error('현금영수증 금액 조회 오류:', error);
    }
  };

  // 모달이 열릴 때 금액 조회
  React.useEffect(() => {
    if (open && data) {
      fetchCashBillAmount();
    }
  }, [open, data]);

  // 현금영수증 발행 처리
  const handleIssueCashReceipt = async () => {
    try {
      setLoading(true);
      setError(null);

      const issueData = {
        agentId: session?.agentId,
        costSeq: data?.COST_SEQ || data?.CAR_REG_ID,
        tradeAmt: data?.PUR_AMT || data?.TRADE_AMT,
        custNm: data?.OWNR_NM || data?.CUST_NM,
        rcgnNo: data?.RCGN_NO,
        carNo: data?.CAR_NO,
        dlrNm: data?.USR_NM,
        usrId: session?.usrId,
        transactionType: '01', // 소득공제용
        issuanceType: '01', // 자진발급
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cashReceiptIssuance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('현금영수증이 성공적으로 발행되었습니다.');
        onClose();
      } else {
        throw new Error(result.error || '현금영수증 발행에 실패했습니다');
      }
    } catch (error) {
      setError(error.message);
      alert('현금영수증 발행 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
          {cashBillAmount && (
            <>
              <p>
                <strong>현금영수증 금액:</strong> {cashBillAmount.amount?.toLocaleString() || "-"}
              </p>
              <p>
                <strong>공급가액:</strong> {cashBillAmount.supplyPrice?.toLocaleString() || "-"}
              </p>
              <p>
                <strong>부가세:</strong> {cashBillAmount.vat?.toLocaleString() || "-"}
              </p>
            </>
          )}
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>
            오류: {error}
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={onClose} style={{ marginRight: 8 }} disabled={loading}>
            취소
          </button>
          <button
            onClick={handleIssueCashReceipt}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? '발행 중...' : '발행'}
          </button>
        </div>
      </div>
    </div>
  );
}
