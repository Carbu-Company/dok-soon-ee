"use client";
import Image from "next/image";
import React, { useState } from "react";
import { getCarPurInfo, getCDList } from "@/app/(main)/api/carApi";

export default function InterestPaymentModal({ 
  open = false, 
  onClose = () => {}, 
  car = null 
}) {
  const [intrPayAmt, setIntrPayAmt] = useState('');
  const [intrPayDt, setIntrPayDt] = useState(new Date().toISOString().split('T')[0]);
  const [regDtime, setRegDtime] = useState(new Date().toISOString().split('T')[0]);
  
  const [loanId, setLoanId] = useState(car?.LOAN_ID || '');

  const inputRef = React.useRef(intrPayAmt);

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);
  // 차량정보 조회
  //const carPurInfo = await getCarPurInfo(car?.CAR_REG_ID || ''); 

  // 선택된 차량의 최근 이자납일이 있으면 초기값으로 설정할 수 있음
  // 예: useEffect로 car 변경 감지 후 setPaymentDate(car?.RCNT_PAY_DTIME || '')

  return (
    <div className={`modal ${open ? "modal--open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="interest-payment-modal-title">
      <div className="modal__container">
        <div className="modal__header">
          <h2 id="interest-payment-modal-title" className="modal__title">등록 - 재고금융 이자 납입건</h2>
          <div className="modal__utils">
            {/*
            <button className="modal__btn print" type="button">
              <Image src="/images/ico-print.svg" alt="프린트" width={32} height={32} />
            </button>
            */}
            <button className="modal__btn close" type="button" onClick={onClose} aria-label="닫기">
              <Image src="/images/ico-modal-close.svg" alt="닫기" width={32} height={32} />
            </button>
          </div>
        </div>

        {/* modal content :: s */}
        <div className="modal__content">
          <div className="guidebox">
            <p className="guidebox__title">월납, 일시납 무관하게 등록 가능합니다.</p>
            {/* <p className="guidebox__desc">이용안내</p> */}
          </div>
  
          <div className="modal__table">
            <p className="modal__section-title">기준차량</p>
            <table className="md-table">
              <colgroup>
                <col style={{ width: "120px" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "auto" }} />
              </colgroup>
              <tbody>
                <tr>
                  <th>제시구분</th>
                  <td>
                    {car?.PRSN_SCT_NM || '-'}
                  </td>
                  <th>차량명</th>
                  <td>{car?.CAR_NM || '-'}</td>
                  <th>차량번호(매입후)</th>
                  <td>{car?.CAR_NO || '-'}</td>
                </tr>
                <tr>
                  <th>매입딜러</th>
                  <td>{car?.DLR_NM || '-'}</td>
                  <th>매입일</th>
                  <td>{car?.CAR_PUR_DT || '-'}</td>
                  <th>차량번호(매입전)</th>
                  <td>{car?.PUR_BEF_CAR_NO || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div className="modal__table">
            <p className="modal__section-title">재고금융 등록정보</p>
            <table className="md-table">
              <colgroup>
                <col style={{ width: "120px" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "auto" }} />
              </colgroup>
              <tbody>
                <tr>
                  <th>캐피탈사</th>
                  <td>{car?.LOAN_CORP_NM || '-'}</td>
                  <th>대출금액</th>
                  <td>{car?.LOAN_AMT.toLocaleString() || '-'}</td>
                  <th>실행일</th>
                  <td>{car?.LOAN_DT || '-'}</td>
                </tr>
                <tr>
                  <th>대출기간</th>
                  <td>{car?.LOAN_CORP_NM || '-'}개월</td>
                  <th>딜러이율</th>
                  <td>{car?.DLR_INTR_RT || '-'}%</td>
                  <th>월 이자</th>
                  <td>{car?.DLR_MM_INTR_AMT || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div className="modal__table">
            <p className="modal__section-title">이자납입 등록</p>
            <table className="table table--lg">
              <colgroup>
                <col style={{ width: "120px" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "auto" }} />
              </colgroup>
              <tbody>
                <tr>
                  <th>납입이자</th>
                  <td>
                    <div className="input">
                      <input 
                        type="text" 
                        className="input__field" 
                        placeholder="금액"
                        autoFocus
                        value={intrPayAmt}
                        onChange={(e) => setIntrPayAmt(e.target.value)}
                      />
                      <div className="input__utils">
                        <button
                          type="button"
                          className="jsInputClear input__clear ico ico--input-delete"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </td>
                  <th>이자납일</th>
                  <td>
                    <div className="input">
                      <input
                        type="date"
                        className="input__field"
                        placeholder="납입일"
                        autoComplete="off"
                        value={intrPayDt}
                        onChange={(e) => setIntrPayDt(e.target.value)}
                      />
                    </div>
                  </td>
                  <th>등록일</th>
                  <td>{regDtime}</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div className="guidebox">
            <div className="form-option-wrap">
              <div className="form-option">
                <label className="form-option__label">
                  <input type="checkbox" />
                  <span className="form-option__title">
                    이자완납(상환완료)으로 종료 처리합니다.
                  </span>
                </label>
              </div>
            </div>
          </div>
  
          <div className="modal__btns">
            <button className="btn btn--light close" type="button" onClick={onClose}>취소</button>
            <button className="btn btn--primary" type="button">확인</button>
          </div>
        </div>
        {/* modal content :: e */}
      </div>
    </div>
  );
}
  