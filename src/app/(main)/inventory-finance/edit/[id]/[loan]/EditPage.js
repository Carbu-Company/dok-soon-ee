"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarSearchModal from "@/components/modal/CarSearchModal";

export default function EditPage({ 
  session = null, 
  carPurDetail = [], 
  dealerList = [], 
  loanCompList = [], 
  loanDetail = {}
 }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatNum = (v) => {
    if (v == null || v === '') return '-';
    const n = Number(v);
    if (Number.isNaN(n)) return v;
    return n.toLocaleString();
  };

  const [loanId, setLoanId] = useState(loanDetail.LOAN_ID || '');

  // 대출회사 선택 상태 관리 (콤보 박스)
  const [isLoanCompSelectOpen, setIsLoanCompSelectOpen] = useState(false);
  const [loanCorpCd, setLoanCorpCd] = useState(loanDetail.LOAN_CORP_CD || '');


  console.log('loanDetail?.LOAN_CORP_CD', loanDetail?.LOAN_CORP_CD);
  
   
  // 선택된 대출회사 정보(실제 데이터 필드명 기준)
  const selectedLoanComp = loanCompList.find(c => c.LOAN_CORP_CD === loanCorpCd) || null;

  // 대출금액 선택 상태 관리
  const [loanAmt, setLoanAmt] = useState(loanDetail.LOAN_AMT || 0);
  const [loanDt, setLoanDt] = useState(loanDetail.LOAN_DT || '');

  // 개월수 콤보 선택
  const [isLoanMmCntSelectOpen, setIsLoanMmCntSelectOpen] = useState(false);
  const [loanMmCnt, setLoanMmCnt] = useState(loanDetail.LOAN_MM_CNT || '');

  // 캐피탈이율 선택 상태 관리
  const [corpIntrRt, setCorpIntrRt] = useState(loanDetail.CORP_INTR_RT || '');

  // 딜러이율 선택 상태 관리
  const [dlrIntrRt, setDlrIntrRt] = useState(loanDetail.DLR_INTR_RT || '');

  // 월 이자 계산
  const [corpMmIntrAmt, setcorpMmIntrAmt] = useState(loanDetail.MM_CORP_INTR_AMT || 0);
  const [dlrMmIntrAmt, setdlrMmIntrAmt] = useState(loanDetail.MM_DLR_INTR_AMT || 0);

  // 총 이자 계산
  const [corpTotPayIntrAmt, setcorpTotPayIntrAmt] = useState(loanDetail.TOT_CORP_PAY_INTR_AMT || 0);
  const [dlrTotayIntrAmt, setdlrTotayIntrAmt] = useState(loanDetail.TOT_DLR_PAY_INTR_AMT || 0);

  useEffect(() => {
    console.log('loanAmt', loanAmt);
    console.log('corpIntrRt', corpIntrRt);
    console.log('loanMmCnt', loanMmCnt);
    console.log('dlrIntrRt', dlrIntrRt);
    console.log('corpMmIntrAmt', corpMmIntrAmt);    // 캐피탈 월 이자액
    console.log('corpTotPayIntrAmt', corpTotPayIntrAmt);    // 캐피탈 총 납입 이자액
    console.log('dlrMmIntrAmt', dlrMmIntrAmt);    // 딜러 월 이자액
    console.log('dlrTotayIntrAmt', dlrTotayIntrAmt);    // 딜러 총 납입 이자액

    if (loanAmt && corpIntrRt && loanMmCnt) {
      setcorpMmIntrAmt(Number((Number(loanAmt) * Number(corpIntrRt) / 100 / 12).toFixed(0)));
      setcorpTotPayIntrAmt(Number((Number(loanAmt) * Number(corpIntrRt) / 100 * Number(loanMmCnt) / 12).toFixed(0)));
    }

    if (loanAmt && dlrIntrRt && loanMmCnt) {
      setdlrMmIntrAmt(Number((Number(loanAmt) * Number(dlrIntrRt) / 100 / 12).toFixed(0)));
      setdlrTotayIntrAmt(Number((Number(loanAmt) * Number(dlrIntrRt) / 100 * Number(loanMmCnt) / 12).toFixed(0)));
    }

  }, [loanAmt, loanMmCnt, corpIntrRt, dlrIntrRt]);

  // 대출유형 선택 상태 관리
  const [loanSctCd, setLoanSctCd] = useState(loanDetail.LOAN_SCT_CD || '');

  // 특이사항 선택 상태 관리
  const [loanMemo, setLoanMemo] = useState(loanDetail.LOAN_MEMO || '');

  // 재고금융 등록 API 호출
  const updateInventoryFinance = async () => {
    const carRegId = selectedCar?.CAR_REG_ID || (carPurDetail && carPurDetail.CAR_REG_ID);
    if (!carRegId) {
      alert('차량 정보가 없습니다. 차량을 먼저 선택해주세요.');
      setIsModalOpen(true); // 모달을 다시 열기
      return;
    }

    // 캐피탈사
    if(!loanCorpCd) {
      alert('캐피탈사를 선택해주세요.');
      return;
    }

    // 대출금액
    if(!loanAmt) {
      alert('대출금액을 입력해주세요.');
      return;
    }

    // 대출실행일
    if(!loanDt) {
      alert('대출실행일을 선택해주세요.');
      return;
    }

    // 대출기간
    if(!loanMmCnt) {
      alert('대출기간을 선택해주세요.');
      return;
    }

    // 캐피탈이율
    if(!corpIntrRt) {
      alert('캐피탈 이자율을 입력해주세요.');
      return;
    }

    // 딜러이율
    if(!dlrIntrRt) {
      alert('딜러 적용 이자율을 입력해주세요.');
      return;
    }
    console.log('loanId', loanId);
    console.log('loanCorpCd', loanCorpCd);    // 대출회사 코드
    console.log('loanAmt', loanAmt);    // 대출금액
    console.log('loanDt', loanDt);    // 대출실행일
    console.log('loanMmCnt', loanMmCnt);    // 대출기간
    console.log('corpIntrRt', corpIntrRt);    // 캐피탈이율
    console.log('corpMmIntrAmt', corpMmIntrAmt);    // 캐피탈 월 이자액
    console.log('corpTotPayIntrAmt', corpTotPayIntrAmt);    // 캐피탈 총 납입 이자액
    console.log('dlrIntrRt', dlrIntrRt);    // 딜러이율
    console.log('dlrMmIntrAmt', dlrMmIntrAmt);    // 딜러 월 이자액
    console.log('dlrTotayIntrAmt', dlrTotayIntrAmt);    // 딜러 총 납입 이자액
    console.log('loanSctCd', loanSctCd);    // 대출유형
    console.log('loanMemo', loanMemo);    // 특이사항

    setLoading(true);
    setError(null);

    try {
      const formValues = {
        loanId : loanId,
        agentId: session.agentId,         // 상사 ID
        carRegId: carRegId,               // 차량 등록 ID
        loanCorpCd: loanCorpCd,           // 대출 업체 코드
        loanStatCd: '10',                 // 대출 상태 코드 (진행중: 10, 상환완료: 20, 취소: 30)
        loanAmt: loanAmt,                 // 대출금액
        loanDt: loanDt,                   // 대출실행일
        loanMmCnt: loanMmCnt,             // 대출기간
        corpIntrRt: corpIntrRt,           // 캐피탈 이자율
        corpMmIntrAmt: corpMmIntrAmt,     // 캐피탈 월 이자액
        corpTotPayIntrAmt: corpTotPayIntrAmt, // 캐피탈 총 납입 이자액
        dlrIntrRt: dlrIntrRt,             // 딜러 이자율
        dlrMmIntrAmt: dlrMmIntrAmt,       // 딜러 월 이자액
        dlrTotPayIntrAmt: dlrTotayIntrAmt, // 딜러 총 납입 이자액
        rpyFcstDt: loanDt,                // 상환 예정 일자
        loanSctCd: loanSctCd,             // 대출 구분 코드
        loanMemo: loanMemo,               // 대출 메모
        usrId: session?.usrId || '',      // 사용자 ID
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateCarLoan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });

      const res = await response.json();

      setLoading(false);
      alert('재고금융 수정이 완료 되었습니다.'); // 테스트용 알림

      if (res.success) {
        router.push('/inventory-finance/inventory-list');
        return { success: true, res, error: null };
      } else {
        throw new Error(res.message || '재고금융 수정에 실패했습니다');
      }
      
    } catch (error) {
      console.error('재고금융 수정 오류:', error);
      setError(error.message);
      alert('재고금융 수정 중 오류가 발생했습니다: ' + error.message);
      setLoading(false);
    }
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
              <td>{selectedCar?.CAR_STAT_NM || (carPurDetail && carPurDetail.CAR_STAT_NM)}</td>
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
                      name="loanCorpCd"
                      value={loanCorpCd || ''}
                    />
                    <button className="select__toggle" type="button" onClick={() => setIsLoanCompSelectOpen(!isLoanCompSelectOpen)}>
                      <span className="select__text">
                        {loanCorpCd ? (selectedLoanComp?.LOAN_CORP_NM || '선택') : '선택'}
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
                      <li className={`select__option ${!loanCorpCd ? 'select__option--selected' : ''}`} data-value="" onClick={() => {
                        setloanCorpCd('');
                        setIsLoanCompSelectOpen(false);
                      }}>
                        선택
                      </li>
                      {loanCompList.map((comp) => (
                        <li key={comp.LOAN_CORP_CD} className={`select__option ${loanCorpCd === comp.LOAN_CORP_CD ? 'select__option--selected' : ''}`} data-value={comp.LOAN_CORP_CD} onClick={() => {
                          setloanCorpCd(comp.LOAN_CORP_CD);
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
                    name="loanAmt"
                    value={loanAmt ? Number(loanAmt).toLocaleString() : '0'}
                    onChange={(e) => setLoanAmt(e.target.value.replace(/[^\d]/g, ''))}
                    onFocus={(e) => e.target.select()}
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
                    <button 
                      className="select__toggle" 
                      type="button"
                      onClick={() => setIsLoanMmCntSelectOpen(!isLoanMmCntSelectOpen)}
                    >
                      <span className="select__text">{loanMmCnt || '선택'}</span>
                      <Image
                        className="select__arrow"
                        src="/images/ico-dropdown.svg"
                        width={10}
                        height={10}
                        alt=""
                      />
                    </button>
                    <ul className={`select__menu ${isLoanMmCntSelectOpen ? 'active' : ''}`}>
                      {[1,2,3,4,5,6,7,8,9,10,11,12,24,36].map((month) => (
                        <li 
                          key={month}
                          className="select__option" 
                          data-value={month}
                          onClick={() => {
                            setLoanMmCnt(month);
                            setIsLoanMmCntSelectOpen(false);
                          }}
                        >
                          {month}
                        </li>
                      ))}
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
                      value={corpIntrRt}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setCorpIntrRt(value);
                        }
                      }}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => setCorpIntrRt('')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <span className="input-help">%</span>
                </div>
              </td>
              <th>월 이자</th>
              <td>{corpMmIntrAmt?.toLocaleString() || '0'} 원 </td>
              <th>총 이자</th>
              <td>{corpTotPayIntrAmt?.toLocaleString() || '0'} 원</td>
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
                      value={dlrIntrRt}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setDlrIntrRt(value);
                        }
                      }}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => setDlrIntrRt('')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <span className="input-help">%</span>
                </div>
              </td>
              <th>월 이자</th>
              <td>{dlrMmIntrAmt?.toLocaleString() || '0'} 원</td>
              <th>총 이자</th>
              <td>{dlrTotayIntrAmt?.toLocaleString() || '0'} 원</td>
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
        <button 
          className="btn btn--primary" 
          type="button" 
          onClick={updateInventoryFinance}
          disabled={loading}
        >
          확인
        </button>
      </div>
    </main>
  );
}
