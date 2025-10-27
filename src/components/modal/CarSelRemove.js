'use client';
import Image from 'next/image';
import React from 'react';

export default function InterestPayRemoveModal(props) {
  const { car : carData
        , open = true
        , onClose = () => {}
        , onConfirm = () => {}
        , session = null
      } = props;

  const handleConfirm = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteLoanIntrPay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanId: carData?.LOAN_ID,
          paySeq: carData?.PAY_SEQ,
          intrPayDt: carData?.INTR_PAY_DT,
          intrPayAmt: carData?.INTR_PAY_AMT,
          usrId: session?.usrId
        })
      });


      if (!response.ok) {
        const errorMessage = '이자납입 삭제에 실패했습니다.';
        alert(errorMessage);
        return;
      }

      const successMessage = '이자납입 삭제에 성공했습니다.';
      alert(successMessage);
      onConfirm();
      onClose();

      window.location.reload();

    } catch (error) {
        console.error('이자납입 삭제 오류:', error);
        throw error;
    }

  };

  
  return (
    <div className={`modal ${open ? "modal--open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="purchase-remove-modal-title">
      <div className="modal__container">
        <div className="modal__header">
          <h2 id="purchase-remove-modal-title" className="modal__title">
            이자납입 삭제처리
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
            <p className="notice__title">이자납입을 삭제하시겠습니까?</p>
            <ul className="notice__list">
              <li>이자납입 삭제 후 복구되지 않습니다.</li>
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
                  <th>이자납입금액</th>
                  <td>{carData?.INTR_PAY_AMT.toLocaleString() || '-'}</td>
                  <th>이자납입일</th>
                  <td>{carData?.INTR_PAY_DT || '-'}</td>
                  <th>총 이자납입 금액</th>
                  <td>{carData?.TOT_PAY_INTR_AMT.toLocaleString() || '-'}</td>
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