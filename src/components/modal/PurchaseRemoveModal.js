'use client';
import Image from 'next/image';
import React from 'react';

export default function PurchaseRemoveModal(props) {
  const { car : carData, flagType, open = true, onClose = () => {}, onConfirm = () => {} } = props;

  const handleConfirm = async () => {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteSuggest?car_regid=${carData.CAR_REG_ID}&flag_type=${flagType}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
        const errorMessage = flagType === 'cancel' ? '매입취소에 실패했습니다.' : '매입차량 삭제에 실패했습니다.';
        alert(errorMessage);
        return;
      }

      const successMessage = flagType === 'cancel' ? '매입취소에 성공했습니다.' : '매입차량 삭제에 성공했습니다.';
      alert(successMessage);
      onConfirm();
      onClose();

      window.location.reload();

    } catch (error) {
        console.error('매입차량 삭제/취소 오류:', error);
        throw error;
    }

  };

  
  return (
    <div className={`modal ${open ? "modal--open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="purchase-remove-modal-title">
      <div className="modal__container">
        <div className="modal__header">
          <h2 id="purchase-remove-modal-title" className="modal__title">
            {flagType === 'cancel' ? '제시(매입)차량 취소처리' : '제시(매입)차량 삭제처리'}
          </h2>
          <div className="modal__utils">
            <button className="modal__btn close" type="button" onClick={onClose} aria-label="닫기">
              <Image src="/images/ico-modal-close.svg" alt="닫기" width={32} height={32} />
            </button>
          </div>
        </div>
        
        {/* modal content :: s */}
        <div className="modal__content">

          {flagType === 'cancel' && (
          <div className="notice">
            <p className="notice__title">제시(매입)을 취소하시겠습니까?</p>
            <ul className="notice__list">
              <li>
                매입 취소 후 매입 취소차량으로 분류됩니다. 취소 후 정상 매입상태로 변경
                가능합니다.
              </li>
            </ul>
          </div>
          )}
          {flagType === 'delete' && (
          <div className="notice">
            <p className="notice__title">제시(매입)을 삭제하시겠습니까?</p>
            <ul className="notice__list">
              <li>매입 삭제 후 복구되지 않습니다.</li>
            </ul>
          </div>
          )}

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
                  <td>{carData?.PRSN_SCT_CD === '0' ? '상사매입' : '고객위탁'}</td>
                  <th>차량명</th>
                  <td>{carData?.CAR_NM || '-'}</td>
                  <th>차량번호(매입후)</th>
                  <td>{carData?.CAR_NO || '-'}</td>
                </tr>
                <tr>
                  <th>매입딜러</th>
                  <td>{carData?.DLR_NM || '-'}</td>
                  <th>매입일</th>
                  <td>{carData?.CAR_PUR_DT || '-'}</td>
                  <th>차량번호(매입전)</th>
                  <td>{carData?.PUR_BEF_CAR_NO || '-'}</td>
                </tr>
                <tr>
                  <th>매입금액</th>
                  <td>{carData?.PUR_AMT.toLocaleString() || '-'}</td>
                  <th>상사매입비</th>
                  <td>{carData?.AGENT_PUR_CST.toLocaleString() || '-'}</td>
                  <th>취득세</th>
                  <td>{carData?.GAIN_TAX.toLocaleString() || '-'}</td>
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