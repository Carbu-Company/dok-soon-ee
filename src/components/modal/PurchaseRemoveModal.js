'use client';
import Image from 'next/image';
import React from 'react';

export default function PurchaseRemoveModal({ open = true, onClose = () => {}, onConfirm = () => {} }) {
  return (
    <div className={`modal ${open ? "modal--open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="purchase-remove-modal-title">
      <div className="modal__container">
        <div className="modal__header">
          <h2 id="purchase-remove-modal-title" className="modal__title">제시(매입)차량 취소/삭제처리</h2>
          <div className="modal__utils">
            <button className="modal__btn close" type="button" onClick={onClose} aria-label="닫기">
              <Image src="/images/ico-modal-close.svg" alt="닫기" width={32} height={32} />
            </button>
          </div>
        </div>
        
        {/* modal content :: s */}
        <div className="modal__content">
          <div className="notice">
            <p className="notice__title">제시(매입)을 취소하시겠습니까?</p>
            <ul className="notice__list">
              <li>
                매입 취소 후 매입 취소차량으로 분류됩니다. 취소 후 정상 매입상태로 변경
                가능합니다.
              </li>
            </ul>
          </div>
          
          <div className="notice">
            <p className="notice__title">제시(매입)을 삭제하시겠습니까?</p>
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
                  <th>제시구분</th>
                  <td>상사매입</td>
                  <th>차량명</th>
                  <td>그랜저</td>
                  <th>차량번호(매입후)</th>
                  <td>123가1234</td>
                </tr>
                <tr>
                  <th>매입딜러</th>
                  <td>홍길동</td>
                  <th>매입일</th>
                  <td>2025-08-01</td>
                  <th>차량번호(매입전)</th>
                  <td>123허1234</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="modal__btns">
            <button className="btn btn--light close" type="button" onClick={onClose}>
              취소
            </button>
            <button className="btn btn--primary" type="button" onClick={onConfirm}>
              확인
            </button>
          </div>
        </div>
        {/* modal content :: e */}
      </div>
    </div>
  );
}