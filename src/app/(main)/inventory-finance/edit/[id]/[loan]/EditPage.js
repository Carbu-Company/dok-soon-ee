"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarSearchModal from "@/components/modal/CarSearchModal";

export default function InventoryFinanceEditPage({ 
  session = null, 
  carPurInfo = [], 
  dealerList = [], 
  companyLoanLimit = [], 
  loanDetail = {}, 
  updateCarLoan = async (data)=>{}
 }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [companyLoanLimit, setCompanyLoanLimit] = useState([]);

  const formatNum = (v) => {
    if (v == null || v === '') return '-';
    const n = Number(v);
    if (Number.isNaN(n)) return v;
    return n.toLocaleString();
  };

  // 대출회사 선택 상태 관리 (콤보 박스)
  const [isLoanCompSelectOpen, setIsLoanCompSelectOpen] = useState(false);
  const [loanCompCd, setLoanCompCd] = useState(loanDetail.LOAN_CORP_CD || '');

  // 선택된 대출회사 정보(실제 데이터 필드명 기준)
  const selectedLoanComp = loanCompList.find(c => c.LOAN_CORP_CD === loanCompCd) || null;

  // 대출금액 선택 상태 관리
  const [loanAmt, setLoanAmt] = useState(loanDetail.LOAN_AMT || 0);
  const [loanDt, setLoanDt] = useState(loanDetail.LOAN_DT || '');

  // 개월수 콤보 선택
  const [isLoanMmCntSelectOpen, setIsLoanMmCntSelectOpen] = useState(false);
  const [loanMmCnt, setLoanMmCnt] = useState(loanDetail.LOAN_MM_CNT || '');

  // 캐피탈이율 
  const [loanCorpIntrRt, setLoanCorpIntrRt] = useState(loanDetail.LOAN_MM_CNT || '');

  // 딜러이율 
  const [dlrAplyIntrRt, setDlrAplyIntrRt] = useState(loanDetail.DLR_APLY_INTR_RT || '');

  // 대출유형 선택 상태 관리
  const [loanSctCd, setLoanSctCd] = useState(loanDetail.LOAN_SCT_CD || '');

  // 특이사항 선택 상태 관리
  const [loanMemo, setLoanMemo] = useState(loanDetail.LOAN_MEMO || '');

  // 제시구분 코드를 텍스트로 변환하는 함수
  const getCarStatusText = (statusCode) => {
    const statusMap = {
      '001': '상사매입',
      '002': '일반판매',
      '003': '알선판매'
    };
    return statusMap[statusCode] || statusCode || '';
  };


  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">재고금융 등록</h2>

        <div className="guidebox">
          <p className="guidebox__title">
            차 정보를 가지고 인입 시 차량 선택 모달 창 불필요.(차량 검색은 필요. 변경가능)
          </p>
          <p className="guidebox__title">
            네이버 이자계산기 참고(만기일시상환), 월이자/총이자 저장해야 함
          </p>
          <p className="guidebox__title">환경설정 연동되어야 함. 한도 등</p>
          <p className="guidebox__title">캐피탈 선택 시 한도,이용금액, 잔여금액 안내</p>
          <p className="guidebox__title">
            하나의 재고금융 등록시 자동으로 이자테이블 1row 추가(최소 1row~N)
          </p>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">기준차량</h2>
          <button
            className="btn btn--dark btn--padding--r20"
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="ico ico--add"></span>차량검색
          </button>
        </div>
        <table className="table">
          <colgroup>
            <col style={{ width: "100px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            <tr>
              <th>제시구분</th>
              <td>{getCarStatusText(selectedCar?.CAR_STAT_CD || (carPurDetail && carPurDetail.CAR_STAT_CD))}</td>
              <th>차량번호</th>
              <td>{selectedCar?.CAR_NO || (carPurDetail && carPurDetail.CAR_NO) || ""}</td>
              <th>매입딜러</th>
              <td>{selectedCar?.DLR_NM || (carPurDetail && carPurDetail.DLR_NM) || ""}</td>
              <th>차량명</th>
              <td>{selectedCar?.CAR_NM || (carPurDetail && carPurDetail.CAR_NM) || ""}</td>
              <th>매입일</th>
              <td>{selectedCar?.CAR_PUR_DT || (carPurDetail && carPurDetail.CAR_PUR_DT) || ""}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="table-wrap">
        {/* <h2 className="table-wrap__title">필수 입력 정보</h2> */}
        <table className="table table--lg">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            <tr>
              <th>
                캐피탈사 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                  <div className="select">
                    <input
                      className="select__input"
                      type="hidden"
                      name="loanCompCd"
                      value={loanCompCd || ''}
                    />
                    <button className="select__toggle" type="button" onClick={() => setIsLoanCompSelectOpen(!isLoanCompSelectOpen)}>
                      <span className="select__text">
                        {loanCompCd ? (selectedLoanComp?.LOAN_CORP_NM || '선택') : '선택'}
                      </span>
                      <Image
                        className="select__arrow"
                        src="/images/ico-dropdown.svg"
                        alt=""
                        width={10}
                        height={10}
                      />
                    </button>

                    <ul className={`select__menu ${isLoanCompSelectOpen ? 'active' : ''}`}>
                      <li className={`select__option ${!loanCompCd ? 'select__option--selected' : ''}`} data-value="" onClick={() => {
                        setLoanCompCd('');
                        setIsLoanCompSelectOpen(false);
                      }}>
                        선택
                      </li>
                      {loanCompList.map((comp) => (
                        <li key={comp.LOAN_CORP_CD} className={`select__option ${loanCompCd === comp.LOAN_CORP_CD ? 'select__option--selected' : ''}`} data-value={comp.LOAN_CORP_CD} onClick={() => {
                          setLoanCompCd(comp.LOAN_CORP_CD);
                          setIsLoanCompSelectOpen(false);
                        }}>
                          {comp.LOAN_CORP_NM}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </td>
              <th>총한도</th>
              <td>{selectedLoanComp ? formatNum(selectedLoanComp.TOT_LMT_AMT) : '-'}</td>
              <th>잔여한도</th>
              <td>{selectedLoanComp ? `${formatNum(selectedLoanComp.TOT_LMT_AMT - (selectedLoanComp.TOT_LOAN_AMT || 0))} (${selectedLoanComp.TOT_LOAN_AMT ? Math.round(((selectedLoanComp.TOT_LMT_AMT - (selectedLoanComp.TOT_LOAN_AMT || 0)) / selectedLoanComp.TOT_LMT_AMT) * 100) : 0}%)` : '-'}</td>
            </tr>
            <tr>
              <th>
                대출금액 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="금액" 
                    value={loanAmt || ''}
                    onChange={(e) => setLoanAmt(e.target.value)}
                  />
                  <div className="input__utils">
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => setLoanAmt('')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </td>
              <th>
                대출실행일 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input-group">
                  <div className="input w200">
                    <input 
                      type="date" 
                      className="input__field" 
                      placeholder="날짜" 
                      autoComplete="off"
                      onChange={(e) => setLoanDt(e.target.value)}
                      value={loanDt || ''} 
                    />
                  </div>
                  <span className="input-help">대출 실행일</span>
                </div>
              </td>
              <th>
                대출기간 <span className="text-red">*</span>
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>이자 납입 총 개월수</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input-group">
                  <div className="select w200">
                    <input
                      className="select__input"
                      type="hidden"
                      name="loanMmCnt"
                      defaultValue=""
                    />
                    <button className="select__toggle" type="button">
                      <span className="select__text">{loanMmCnt || '선택'}</span>
                      <Image
                        className="select__arrow"
                        src="/images/ico-dropdown.svg"
                        width={10}
                        height={10}
                        alt=""
                      />
                    </button>
                    <ul className="select__menu">
                      <li className="select__option" data-value="1">1</li>
                      <li className="select__option" data-value="2">2</li>
                      <li className="select__option" data-value="3">3</li>
                      <li className="select__option" data-value="4">4</li>
                      <li className="select__option" data-value="5">5</li>
                      <li className="select__option" data-value="6">6</li>
                      <li className="select__option" data-value="7">7</li>
                      <li className="select__option" data-value="8">8</li>
                      <li className="select__option" data-value="9">9</li>
                      <li className="select__option" data-value="10">10</li>
                      <li className="select__option" data-value="11">11</li>
                      <li className="select__option" data-value="12">12</li>
                      <li className="select__option" data-value="24">24</li>
                      <li className="select__option" data-value="36">36</li>
                    </ul>
                  </div>
                  <span className="input-help">개월</span>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                캐피탈이율
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>캐피탈사에 적용 이율입니다.</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w200">
                    <input
                      type="text"
                      className="input__field center"
                      placeholder="이율"
                      value={loanCorpIntrRt}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setLoanCorpIntrRt(value);
                        }
                      }}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => setLoanCorpIntrRt('')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <span className="input-help">%</span>
                </div>
              </td>
              <th>월 이자</th>
              <td>83,333</td>
              <th>총 이자</th>
              <td>500,000</td>
            </tr>
            <tr>
              <th>
                딜러이율 <span className="text-red">*</span>
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>실제 딜러에게 적용되는 이율입니다.</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w200">
                    <input
                      type="text"
                      className="input__field center"
                      placeholder="이율"
                      value={dlrAplyIntrRt}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setDlrAplyIntrRt(value);
                        }
                      }}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => setDlrAplyIntrRt('')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <span className="input-help">%</span>
                </div>
              </td>
              <th>월 이자</th>
              <td>83,333</td>
              <th>총 이자</th>
              <td>500,000</td>
            </tr>

            <tr>
              <th>대출유형</th>
              <td>
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="loanSctCd" 
                        value="1"
                        checked
                        onChange={(e) => setLoanSctCd(e.target.value)}
                      />
                      <span className="form-option__title">신규</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="loanSctCd" 
                        value="2"
                        checked={loanSctCd === '2'}
                        onChange={(e) => setLoanSctCd(e.target.value)}
                      />
                      <span className="form-option__title">추가</span>
                    </label>
                  </div>
                </div>
              </td>
              <th>특이사항</th>
              <td colSpan="3">
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="" 
                    value={loanMemo}
                    onChange={(e) => setLoanMemo(e.target.value)}
                  />
                  <div className="input__utils">
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => setLoanMemo('')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="container__btns">
        <button
          className="btn btn--light"
          type="button"
          onClick={() => {
            window.location.href = "m3.jsp";
          }}
        >
          취소
        </button>
        <button className="btn btn--primary" type="button" disabled>
          확인
        </button>
        <button 
          className="btn btn--primary" 
          type="button" 
          onClick={insertInventoryFinance}
          disabled={loading}
        >
          {loading ? '등록 중...' : '확인'}
        </button>
      </div>

      {/*
        <div className="container__btns">
          <button className="btn btn--light" type="button">취소</button>
          <button className="btn btn--primary" type="button" disabled>확인</button>
          <button className="btn btn--primary" type="button">확인</button>
        </div>
        */}

      {/* 차량 선택 모달 */}
      <CarSearchModal
        open={isModalOpen}
        onClose={handleModalClose}
        onCarSelect={handleCarSelect}
        agentId={session}
      />
    </main>
  );
}
