"use client";

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { updateCarBrkTrade } from "@/app/(main)/car-brokerage/edit/[id]/api";

export default function EditPage({ 
  session = null, 
  dealerList = [], 
  carKndList = [], 
  evdcCdList = [], 
  tradeItemCDList = [], 
  carBrkTradeInfo = [] 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

/*
  console.log('carBrkTradeInfo**********', carBrkTradeInfo);
  
  console.log('carBrkTradeInfo.BRK_TRADE_SEQ', carBrkTradeInfo.BRK_TRADE_SEQ);
  */


  // ===== 드롭다운 열림/닫힘 상태 =====
  const [isDealerSelectOpen, setIsDealerSelectOpen] = useState(false);
  const [isCarKndSelectOpen, setIsCarKndSelectOpen] = useState(false);
  const [isEvdcCdSelectOpen, setIsEvdcCdSelectOpen] = useState(false);
  const [isTradeItemCdOpen, setIsTradeItemCdOpen] = useState(false);
  const [isTradeItemCdSelectOpen, setIsTradeItemCdSelectOpen] = useState(false);

  const [brkTradeSeq, setBrkTradeSeq] = useState(carBrkTradeInfo.BRK_TRADE_SEQ || '');
  const [dealerId, setDealerId] = useState(carBrkTradeInfo.SALE_DLR_ID || '');
  const [tradeItemCd, _setTradeItemCd] = useState(carBrkTradeInfo.TRADE_ITEM_CD || '');
  // tradeItemNm은 아래에 있음

  // tradeItemCd를 변경할 때 tradeItemNm도 같이 설정하는 setter
  const setTradeItemCd = (cd) => {
    _setTradeItemCd(cd);
    if (cd && tradeItemCDList && tradeItemCDList.length > 0) {
      const matched = tradeItemCDList.find(item => item.CD === cd);
      setTradeItemNm(matched ? matched.CD_NM : '');
    } else {
      setTradeItemNm('');
    }
  };
  const [tradeItemNm, setTradeItemNm] = useState('');


  const [brkSaleDt, setBrkSaleDt] = useState(carBrkTradeInfo.BRK_SALE_DT || '');
  const [brkAmt, setBrkAmt] = useState(carBrkTradeInfo.TRADE_AMT || '');
  const [brkSupPrc, setBrkSupPrc] = useState(carBrkTradeInfo.TRADE_SUP_PRC || '');
  const [brkVat, setBrkVat] = useState(carBrkTradeInfo.TRADE_VAT || '');
  const [dedtAmt, setDedtAmt] = useState(carBrkTradeInfo.DEDT_AMT || '');
  const [taxSumAmt, setTaxSumAmt] = useState(carBrkTradeInfo.TAX_AMT || '');
  const [wttx, setWttx] = useState(carBrkTradeInfo.WTTX || '');
  const [dlrPayAmt, setDlrPayAmt] = useState(carBrkTradeInfo.DLR_PAY_AMT || '');
  const [evdcCd, setEvdcCd] = useState(carBrkTradeInfo.SALE_EVDC_CD || '');
  const [carKndCd, setCarKndCd] = useState(carBrkTradeInfo.CAR_KND_CD || '');
  const [carNm, setCarNm] = useState(carBrkTradeInfo.CAR_NM || '');
  const [carNo, setCarNo] = useState(carBrkTradeInfo.CAR_NO || '');
  const [custNm, setCustNm] = useState(carBrkTradeInfo.CUST_NM || '');
  const [custPhon, setCustPhon] = useState(carBrkTradeInfo.CUST_PHON || '');
  const [brkMemo, setBrkMemo] = useState(carBrkTradeInfo.BRK_MEMO || '');

  // 알선금액이 변경될 때 공급가액과 부가세 계산
  /**
   * 200,000 금액 
   * 10,000 공제비용
   * 딜러 지급액 : 177,027
   * 세액계 : 22,973
   */
  useEffect(() => {
    

    /**
     * 공제비용이 알선금액보다 클 수 없다.
     */
    if (
      !isNaN(Number(brkAmt)) && 
      !isNaN(Number(dedtAmt)) && 
      Number(dedtAmt) > Number(brkAmt)
    ) {
      alert('공제비용이 알선금액보다 클 수 없습니다. 공제비용을 초기화합니다.');
      setDedtAmt('0');
      return;
    }

    // brkAmt(알선금액), brkDedtAmt(공제비용)이 변경될 때 정산 계산
    const {
      SettAmtVat,   // 예수부가세 
      SettAmtVat_RST, // 예수부가세 제외 금액   (공급가)
      SettAmt33,    // 원천징수(3.3%)
      taxSum,       // 세금(합계)액   = 예수부가세 + 원천징수(3.3%)
      dealerPayAmt    // 딜러 지급액
    } = calculateSettlement(brkAmt, dedtAmt);

    console.log('SettAmtVat', SettAmtVat);
    console.log('SettAmt33', SettAmt33);
    console.log('taxSum', taxSum);
    console.log('dealerPayAmt', dealerPayAmt);

    /**
     * 필요한 데이터는 
     * 
     * 1. 예수부가세
     * 2. 원천징수(3.3%)
     * 3. 세금(합계)액   = 예수부가세 + 원천징수(3.3%)
     * 4. 지급액
     */
    setBrkVat(SettAmtVat); // 예수부가세
    //공급가액 = 알선금액 - 공제비용 - 세금(합계)액
    setBrkSupPrc(SettAmtVat_RST); // 공급가액
    setTaxSumAmt(taxSum);    // 세금(합계)액
    setWttx(SettAmt33); // 원천징수세(3.3%)
    setDlrPayAmt(dealerPayAmt); // 지급액
  }, [brkAmt, dedtAmt]);


  // 정산 관련 계산 함수 (Cal_Settle)
  // 원본 JS 로직을 React state 기반으로 변환
  const calculateSettlement = (costRealAmt, settCost) => {
    // costRealAmt, settCost는 숫자 또는 string이어도 좋다.
    // 콤마 등 들어있을 수 있으니 전처리
    const clearComma = (value) => String(value ?? '').replace(/,/g, '');
    const rtnZero = (v) => (v === '' || v == null || isNaN(Number(v)) ? '0' : v);

    const cost_realamt_int = parseInt(rtnZero(clearComma(costRealAmt)), 10);    // 총 금액
    const settcost_int = parseInt(rtnZero(clearComma(settCost)), 10);           // 공제금액(상품화 비용)

    console.log('cost_realamt_int', cost_realamt_int);
    console.log('settcost_int', settcost_int);

    const settamtbasic_int = cost_realamt_int - settcost_int;                   // 정산금액(기본)
    const settamtvat_int = Math.round((settamtbasic_int / 1.1) * 0.1);          // 예수부가세(VAT)
    const settamtvat_rst = settamtbasic_int - settamtvat_int;                   // 예수부가세 제외 금액   (공급가)

    console.log('settamtbasic_int', settamtbasic_int);
    console.log('settamtvat_int', settamtvat_int);
    console.log('settamtvat_rst', settamtvat_rst);

    const settamt33_int = parseInt(Math.round(settamtvat_rst * 0.033), 10);      // 원천징수금액

    const taxsum = settamtvat_int + settamt33_int;                              // 세금계
    const settamt_send_int = cost_realamt_int - taxsum;                         // 지급액

    // 콤마로 표시
    const addComma = (value) => value?.toLocaleString() ?? '0';

    return {
      //SETTAMTBASIC: addComma(settamtbasic_int),         // 정산기준금액
      SettAmtVat: settamtvat_int,             // 예수부가세
      SettAmtVat_RST: settamtvat_rst,         // 예수부가세 제외 금액   (공급가)
      //SettAmtSodeuk: addComma(settamtvat_rst),          // 예수부가세 제외(=sodeuk, 소득/수익)
      SettAmt33: settamt33_int,               // 원천징수(3.3%)
      //SettAmt: addComma(settamt33_rst),                 // 최종 정산금액
      taxSum: taxsum,                         // 세금계(VAT+3.3%)
      dealerPayAmt: settamt_send_int,         // 지급액(총금액-세금계)
      // 원본 jQuery 연동하는 HTML 삽입부/innerHTML 제외 (React에선 직접 안 씀)
    };
  };

  /**
   * 알선매출 수정
   * 
   */
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // 매입딜러
    if(!dealerId) {
      alert('판매딜러를 선택해주세요.');
      return;
    }

    // 거래항목 
    if(!tradeItemCd) {
      alert('거래항목을 선택해주세요.');
      return;
    }
    
    // 알선판매일
    if(!brkSaleDt) {
      alert('알선판매일을 선택해주세요.');
      return;
    }

    // 알선금액
    if(!brkAmt || brkAmt === '0') {
      alert('알선금액을 입력해주세요.');
      return;
    }

    alert('매출증빙: ' + evdcCd + ', 알선금액: ' + brkAmt + ', 공제비용: ' + dedtAmt + ', 딜러지급액: ' + dlrPayAmt);
    
    const formValues = {
      brkTradeSeq: brkTradeSeq,                 // BRK_TRADE_SEQ: 알선매출 순번
      saleDlrId: dealerId,                       // SALE_DLR_ID: 판매딜러 ID
      tradeItemCd : tradeItemCd,                 // TRADE_ITEM_CD: 거래항목 코드
      tradeItemNm : tradeItemNm,                 // TRADE_ITEM_NM: 거래항목명
      brkSaleDt : brkSaleDt,                     // BRK_SALE_DT: 알선판매일  
      tradeAmt: brkAmt,                          // TRADE_AMT: 알선금액
      tradeSupPrc: brkSupPrc,                    // TRADE_SUP_PRC: 공급가액
      tradeVat: brkVat,                          // TRADE_VAT: 부가세
      dedtAmt: dedtAmt,                       // DEDT_AMT: 공제비용 
      taxSumAmt: taxSumAmt,                      // TAX_SUM: 세금(합계)액
      wttx: wttx,                                  // WTTX: 원천징수세(3.3%)
      dlrPayAmt: dlrPayAmt,                      // DLR_PAY_AMT: 딜러지급액
      saleEvdcCd: evdcCd,                        // SALE_EVDC_CD: 증빙종류 코드
      carNm : carNm,                             // CAR_NM: 차량명
      carKndCd : carKndCd,                       // CAR_KND_CD: 차량 유형 코드
      carNo : carNo,                             // CAR_NO: 차량번호
      brkAgentNm : custNm,                       // BRK_AGENT_NM: 고객상사명(상사명)
      custNm : custNm,                           // CUST_NM: 고객명/상사명
      custPhon : custPhon,                       // CUST_PHON: 연락처  
      brkMemo : brkMemo,                         // BRK_MEMO: 특이사항
      usrId: session?.usrId                      // REGR_ID: 등록자 ID
      };

    console.log('formValues', formValues);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateCarBrkTrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });
      const res = await response.json();
      
      alert('알선매출 수정 되었습니다.'); // 테스트용 알림
      setLoading(false);
      if (res.success) {
        router.push('/car-brokerage/list');
        return { success: true, res, error: null };
      } else {
        throw new Error(res.message || '알선매출 수정에 실패했습니다');
      }
    } catch (error) {
      setError(error.message);
      alert('알선매출 수정 중 오류가 발생했습니다.'); // 테스트용 알림
      setLoading(false);
      return { success: false, res: [], error: error.message };
    }

  };

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">알선매출 수정</h2>

        <div className="guidebox">
          <p className="guidebox__title">매출등록, 세금계산서 발행 연동, 즉시발행 필요</p>
          <p className="guidebox__title">딜러지급액 자동계산(수정가능)</p>
          <p className="guidebox__title">사무장님 재확인 필요</p>
        </div>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">필수 입력 정보</h2>
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
              <th>판매딜러 <span className="text-red">*</span></th>
              <td>
              <div className="select">
                  <input 
                    className="select__input" 
                    type="hidden" 
                    name="dealerId" 
                    value={dealerId || ''} 
                  />
                  <button 
                    className="select__toggle" 
                    type="button"
                    onClick={() => setIsDealerSelectOpen(!isDealerSelectOpen)}
                  >
                    <span className="select__text">
                      {dealerId ? dealerList.find(d => d.USR_ID === dealerId)?.USR_NM || '선택' : '선택'}
                    </span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>

                  <ul className="select__menu" style={{ display: isDealerSelectOpen ? 'block' : 'none' }}>
                    <li 
                      key="default-dealer"
                      className={`select__option ${!dealerId ? 'select__option--selected' : ''}`}
                      data-value=""
                      onClick={() => {
                        setDealerId('');
                        setIsDealerSelectOpen(false);
                      }}
                    >선택</li>
                    {dealerList && dealerList.map((dealer) => (
                      <li 
                        key={`dealer-${dealer.USR_ID}`}
                        className={`select__option ${dealerId === dealer.USR_ID ? 'select__option--selected' : ''}`}
                        data-value={dealer.USR_ID}
                        onClick={() => {
                          setDealerId(dealer.USR_ID);
                          setIsDealerSelectOpen(false);
                        }}
                      >{dealer.USR_NM}</li>
                    ))}
                  </ul>
                </div>
              </td>

              <th>거래항목 <span className="text-red">*</span></th>
              <td>
                <div className="select">
                  <input
                    className="select__input"
                    type="hidden"
                    name="tradeItemCd"
                    value={tradeItemCd || ''}
                  />
                  <button className="select__toggle" type="button" onClick={() => setIsTradeItemCdSelectOpen(!isTradeItemCdSelectOpen)}>
                    <span className="select__text">
                      {tradeItemCd ? tradeItemCDList.find(item => item.CD === tradeItemCd)?.CD_NM : '선택'}
                    </span>
                    <Image
                      className="select__arrow"
                      src="/images/ico-dropdown.svg"
                      alt=""
                      width={10}
                      height={10}
                    />
                  </button>

                  <ul className={`select__menu ${isTradeItemCdSelectOpen ? 'active' : ''}`}>
                    <li 
                      className={`select__option ${!tradeItemCd ? 'select__option--selected' : ''}`}
                      onClick={() => {
                        _setTradeItemCd('');
                        setTradeItemNm('');
                        setIsTradeItemCdSelectOpen(false);
                      }}
                    >
                      선택
                    </li>
                    {tradeItemCDList.map((item) => (
                      <li 
                        key={item.CD}
                        className={`select__option ${tradeItemCd === item.CD ? 'select__option--selected' : ''}`}
                        onClick={() => {
                          _setTradeItemCd(item.CD);
                          setTradeItemNm(item.CD_NM);
                          setIsTradeItemCdSelectOpen(false);
                        }}
                      >
                        {item.CD_NM}
                      </li>
                    ))}
                  </ul>
                </div>
              </td>

              <th>알선판매일 <span className="text-red">*</span></th>
              <td>
                <div className="input-group">
                  <div className="input w200">
                    <input
                      type="date"
                      className="input__field" 
                      placeholder="날짜"
                      autoComplete="off"
                      name="brkSaleDt"
                      onChange={(e) => setBrkSaleDt(e.target.value)}
                      value={brkSaleDt || ''}
                    />
                  </div>
                  <span className="input-help">조합전산 매도일</span>
                </div>
              </td>
            </tr>
            <tr>
              <th>알선 금액 <span className="text-red">*</span></th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w160">
                    <input
                      type="text"
                      className="input__field"
                      placeholder="금액"
                      name="brkAmt"
                      value={brkAmt ? Number(brkAmt).toLocaleString() : '0'}
                      onChange={(e) => setBrkAmt(e.target.value.replace(/[^\d]/g, ''))}
                      onFocus={(e) => e.target.select()}
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
                  <span className="input-help">{brkSupPrc?.toLocaleString() || '0'} / {brkVat?.toLocaleString() || '0'}</span>
                </div>
              </td>
              <th>
                공제비용(상품화)
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>알선판매 시 인정되는 상품화비용은 비용처리가 가능합니다.</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="금액" 
                    name="dedtAmt"
                    value={dedtAmt ? Number(dedtAmt).toLocaleString() : '0'}
                    onChange={(e) => setDedtAmt(e.target.value.replace(/[^\d]/g, ''))}
                    onFocus={(e) => e.target.select()}
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
              <th>
                딜러지급액
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>예수부가세, 원천세를 제한 실 지급액</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="금액" 
                    name="dlrPayAmt"
                    value={dlrPayAmt ? Number(dlrPayAmt).toLocaleString() : '0'}
                    onChange={(e) => setDlrPayAmt(e.target.value.replace(/[^\d]/g, ''))}
                    onFocus={(e) => e.target.select()}
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
            </tr>
            <tr>
              <th>매출증빙 <span className="text-red">*</span></th>
              <td>
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="evdcCd"
                        checked={evdcCd === '001' || !evdcCd} 
                        onChange={() => setEvdcCd('001')}
                      />
                      <span className="form-option__title">전자세금계산서</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="evdcCd"
                        checked={evdcCd === '004'}
                        onChange={() => setEvdcCd('004')}
                      />
                      <span className="form-option__title">현금영수증</span>
                    </label>
                  </div>
                </div>
              </td>
              <th>차량명</th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="select w120">
                    <input
                      className="select__input"
                      type="hidden"
                      name="carKndCd" 
                      value={carKndCd || (carKndList && carKndList[0]?.CD)}
                    />
                    <button 
                      className="select__toggle" 
                      type="button"
                      onClick={() => setIsCarKndSelectOpen(!isCarKndSelectOpen)}
                    >
                      <span className="select__text">
                        {carKndCd ? carKndList.find(item => item.CD === carKndCd)?.CD_NM : carKndList && carKndList[0]?.CD_NM}
                      </span>
                      <Image
                        className="select__arrow"
                        src="/images/ico-dropdown.svg"
                        width={10}
                        height={10}
                        alt=""
                      />
                    </button>
                    <ul className={`select__menu ${isCarKndSelectOpen ? 'active' : ''}`}>
                      {carKndList && carKndList.map((item) => (
                        <li 
                          key={`carKnd-${item.CD}`}
                          className={`select__option ${carKndCd === item.CD ? 'select__option--selected' : ''}`}
                          data-value={item.CD}
                          onClick={() => {
                            setCarKndCd(item.CD);
                            setIsCarKndSelectOpen(false);
                          }}
                        >{item.CD_NM}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="input w300">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="차량명"
                      value={carNm || ''}
                      onChange={(e) => setCarNm(e.target.value)}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => setCarNm('')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              <th>차량번호</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder=""
                    value={carNo || ''}
                    onChange={(e) => setCarNo(e.target.value)} 
                  />
                  <div className="input__utils">
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => setCarNo('')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th>고객명/상사명</th>
              <td>
                <div className="input-group">
                  <div className="input w400">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder=""
                      value={custNm || ''}
                      onChange={(e) => setCustNm(e.target.value)}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => setCustNm('')}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  {/* <button className="btn btn--dark" type="button" disabled>검색</button> */}
                  <button className="btn btn--dark" type="button">
                    검색
                  </button>
                </div>
              </td>
              <th>연락처</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="'-' 없이 입력"
                    value={custPhon || ''}
                    onChange={(e) => setCustPhon(e.target.value)}
                  />
                  <div className="input__utils">
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => setCustPhon('')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </td>
              <th>특이사항</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder=""
                    value={brkMemo || ''}
                    onChange={(e) => setBrkMemo(e.target.value)}
                  />
                  <div className="input__utils">
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => setBrkMemo('')}
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
            if (typeof window !== "undefined") {
              window.history.back();
            }
          }}
        >
          취소
        </button>
        <button className="btn btn--primary" type="button" disabled>
          확인
        </button>
        <button className="btn btn--primary" type="button" onClick={handleSubmit}>
          확인
        </button>
      </div>

      {/*
        <div className="container__btns">
          <button className="btn btn--light" type="button">취소</button>
          <button className="btn btn--primary" type="button" disabled>확인</button>
          <button className="btn btn--primary" type="button">확인</button>
        </div>
        */}
    </main>
  );
  }
  