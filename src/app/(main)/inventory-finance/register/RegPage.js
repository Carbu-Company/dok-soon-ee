"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarSearchModal from "@/components/modal/CarSearchModal";

export default function InventoryFinanceRegisterPage({ session = null, carPurDetail = [], dealerList = [], loanCompList = [] }) {
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
  const [loanCorpCd, setloanCorpCd] = useState('');

  // 선택된 대출회사 정보(실제 데이터 필드명 기준)
  const selectedLoanComp = loanCompList.find(c => c.LOAN_CORP_CD === loanCorpCd) || null;

  // 대출금액 선택 상태 관리
  const [loanAmt, setLoanAmt] = useState('');
  const [loanDt, setLoanDt] = useState('');

  // 개월수 콤보 선택
  const [isLoanMmCntSelectOpen, setIsLoanMmCntSelectOpen] = useState(false);
  const [loanMmCnt, setLoanMmCnt] = useState('');

  // 캐피탈이율 선택 상태 관리
  const [loanCorpIntrRt, setLoanCorpIntrRt] = useState('');

  // 딜러이율 선택 상태 관리
  const [dlrAplyIntrRt, setDlrAplyIntrRt] = useState('');

  // 월 이자 계산
  const [mmCorpIntrAmt, setMmCorpIntrAmt] = useState(0);
  const [mmDlrIntrAmt, setMmDlrIntrAmt] = useState(0);

  // 총 이자 계산
  const [totCorpPayIntrAmt, setTotCorpPayIntrAmt] = useState(0);
  const [totDlrPayIntrAmt, setTotDlrPayIntrAmt] = useState(0);

  useEffect(() => {

    if ( loanAmt && loanCorpIntrRt && loanMmCnt) {
      setMmCorpIntrAmt((loanAmt * loanCorpIntrRt / 100 / 12).toFixed(0));
      setTotCorpPayIntrAmt((loanAmt * loanCorpIntrRt / 100 * loanMmCnt).toFixed(0));
    }

    if ( loanAmt && dlrAplyIntrRt && loanMmCnt ) {
      setMmDlrIntrAmt((loanAmt * dlrAplyIntrRt / 100 / 12).toFixed(0));
      setTotDlrPayIntrAmt((loanAmt * dlrAplyIntrRt / 100 * loanMmCnt).toFixed(0));
    }

  },[loanAmt],[loanMmCnt],[loanCorpIntrRt],[dlrAplyIntrRt]);

  // 대출유형 선택 상태 관리
  const [loanSctCd, setLoanSctCd] = useState('');

  // 특이사항 선택 상태 관리
  const [loanMemo, setLoanMemo] = useState('');

  // 제시구분 코드를 텍스트로 변환하는 함수
  const getCarStatusText = (statusCode) => {
    const statusMap = {
      '001': '상사매입',
      '002': '일반판매',
      '003': '알선판매'
    };
    return statusMap[statusCode] || statusCode || '';
  };
  
  useEffect(() => {
    // URL 쿼리 파라미터에서 showModal이 true이면 모달을 열기
    if (searchParams.get("showModal") === "true") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    // URL에서 쿼리 파라미터 제거
    router.replace("/inventory-finance/register");
  };

  const handleCarSelect = carData => {
    console.log('선택된 차량:', carData);
    setSelectedCar(carData);
    setIsModalOpen(false);
    router.replace("/inventory-finance/register");
  };

  // 재고 금융 한도 조회 api 호출
  const getCarLoanCorpList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarLoanCorpList?agentId=${session.agentId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (!response.ok) {
          throw new Error('재고금융 업체별 한도 조회에 실패했습니다.');
      }
      const data = await response.json();
      return data;

    } catch (error) {
        console.error('재고금융 업체별 한도 조회 오류:', error);
        throw error;
    }
  };

  // 재고금융 등록 API 호출
  const insertInventoryFinance = async () => {
    const carRegId = selectedCar?.CAR_REG_ID || (carPurDetail && carPurDetail.CAR_REG_ID);
    if (!carRegId) {
      alert('차량 정보가 없습니다. 차량을 먼저 선택해주세요.');
      setIsModalOpen(true); // 모달을 다시 열기
      return;
    }

    console.log('session.agentId', session.agentId);
    console.log('carRegId', carRegId);    // 차량 등록 ID
    console.log('loanCorpCd', loanCorpCd);    // 대출회사 코드
    console.log('loanAmt', loanAmt);    // 대출금액
    console.log('loanDt', loanDt);    // 대출실행일
    console.log('loanMmCnt', loanMmCnt);    // 대출기간
    console.log('loanCorpIntrRt', loanCorpIntrRt);    // 캐피탈이율
    console.log('dlrAplyIntrRt', dlrAplyIntrRt);    // 딜러이율
    console.log('loanSctCd', loanSctCd);    // 대출유형
    console.log('loanMemo', loanMemo);    // 특이사항

    setLoading(true);
    setError(null);

    try {
      const formValues = {
        agentId: session.agentId,         // 대행사 ID
        carRegId: carRegId,               // 차량 등록 ID
        loanCorpCd: loanCorpCd,           // 대출회사 코드
        loanAmt: loanAmt,                 // 대출금액
        loanDt: loanDt,                   // 대출실행일
        loanMmCnt: loanMmCnt,             // 대출기간
        loanCorpIntrRt: loanCorpIntrRt,   // 캐피탈이율
        dlrAplyIntrRt: dlrAplyIntrRt,     // 딜러이율
        loanSctCd: loanSctCd,             // 대출유형
        loanMemo: loanMemo,               // 특이사항
        usrId: session?.usrId || '',     // 등록자 ID
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insertCarLoan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });

      const res = await response.json();
      
      if (!res.success) {
        throw new Error(res.message || '재고금융 등록에 실패했습니다');
      }

      return res;

      await Promise.all(promises);
      
      alert('재고금융이 성공적으로 등록되었습니다.');
      setLoading(false);
      // 성공 후 목록 페이지로 이동하거나 필요한 처리
      // router.push('/inventory-finance/list');
      
    } catch (error) {
      console.error('재고금융 등록 오류:', error);
      setError(error.message);
      alert('재고금융 등록 중 오류가 발생했습니다: ' + error.message);
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
              <td>{mmCorpIntrAmt?.toLocaleString() || '0'}</td>
              <th>총 이자</th>
              <td>{totCorpPayIntrAmt?.toLocaleString() || '0'}</td>
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
              <td>{mmDlrIntrAmt?.toLocaleString() || '0'}</td>
              <th>총 이자</th>
              <td>{totDlrPayIntrAmt?.toLocaleString() || '0'}</td>
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
