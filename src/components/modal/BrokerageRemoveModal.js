'use client';
import Image from 'next/image';
import React from 'react';

export default function BrokerageRemoveModal(props) {
  const { brokerage : brokerageData, flagType, open = true, onClose = () => {}, onConfirm = () => {} } = props;

  const handleConfirm = async () => {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteCarBrkTrade?brkTradeSeq=${brokerageData.BRK_TRADE_SEQ}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
        const errorMessage = '알선 삭제에 실패했습니다.';
        alert(errorMessage);
        return;
      }

      const successMessage = '알선 삭제에 성공했습니다.';
      alert(successMessage);
      onConfirm();
      onClose();

      window.location.reload();

    } catch (error) {
        console.error('알선 삭제 오류:', error);
        throw error;
    }

  };

  
  return (
    <div className={`modal ${open ? "modal--open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="purchase-remove-modal-title">
      <div className="modal__container">
        <div className="modal__header">
          <h2 id="purchase-remove-modal-title" className="modal__title">
            알선 삭제처리
          </h2>
          <div className="modal__utils">
            <button className="modal__btn close" type="button" onClick={onClose} aria-label="닫기">
              <Image src="/images/ico-modal-close.svg" alt="닫기" width={32} height={32} />
            </button>
          </div>
        </div>
        
        {/* modal content :: s */}
        <div className="modal__content">

          <div className="notice">
          <p className="notice__title">타상사 알선 정보를 삭제하시겠습니까?</p>
          <ul className="notice__list">
            <li>매입 삭제 후 복구되지 않습니다.</li>
          </ul>
          </div>

          <div className="modal__table">
            <p className="modal__section-title">기본정보</p>
            <table className="md-table">
              <colgroup>
                <col style={{ width: '120px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <th>판매딜러</th>
                  <td>{brokerageData?.SALE_DLR_NM || '-'}</td>
                  <th>거래항목</th>
                  <td>{brokerageData?.TRADE_ITEM_NM || '-'}</td>
                  <th>알선판매일</th>
                  <td>{brokerageData?.BRK_SALE_DT || '-'}</td>
                </tr>
                <tr>
                  <th>알선 금액</th>
                  <td>{brokerageData?.TRADE_AMT.toLocaleString() || '-'}</td>
                  <th>공제비용</th>
                  <td>{brokerageData?.DEDT_AMT.toLocaleString() || '-'}</td>
                  <th>딜러지급액</th>
                  <td>{brokerageData?.DLR_PAY_AMT.toLocaleString() || '-'}</td>
                </tr>
                <tr>
                  <th>매출증빙</th>
                  <td>{brokerageData?.SALE_EVDC_NM || '-'}</td>
                  <th>차량번호</th>
                  <td>{brokerageData?.CAR_NO || '-'}</td>
                  <th>차량명</th>
                  <td>{brokerageData?.CAR_NM || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="modal__btns">
            <button className="btn btn--light close" type="button" onClick={onClose}>
              취소
            </button>
            <button className="btn btn--primary" type="button" onClick={handleConfirm}>
              확인
            </button>
          </div>
        </div>
        {/* modal content :: e */}
      </div>
    </div>
  );
}