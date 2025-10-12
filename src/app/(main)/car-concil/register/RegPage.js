"use client";

import Image from 'next/image'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CarSearchModal from "@/components/modal/CarSearchModal";

export default function BrokerageSalesCreatePage({ session = null, dealerList = [], evdcCdList = [], tradeItemCDList = [], carKndList = [], carPurDetail = [] }) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 차량 검색 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // 매입딜러 선택 상태 관리 (콤보 박스)
  const [isDealerSelectOpen, setIsDealerSelectOpen] = useState(false);
  const [dealerId, setDealerId] = useState('');

  // 차량 종류 선택 상태 관리 (콤보 박스)
  const [isCarKndSelectOpen, setIsCarKndSelectOpen] = useState(false);
  const [carKndCd, setCarKndCd] = useState('001');   // 승용

  // 거래항목 선택 상태 관리 (콤보 박스)
  const [isTradeItemCdSelectOpen, setIsTradeItemCdSelectOpen] = useState(false);
  const [tradeItemCd, setTradeItemCd] = useState('');

  // 증빙종류 선택 상태 관리 (콤보 박스)
  const [isEvdcCdSelectOpen, setIsEvdcCdSelectOpen] = useState(false);
  const [evdcCd, setEvdcCd] = useState('001');    // 전자세금계산서

  // 알선금액 선택 상태 관리
  const [brkAmt, setBrkAmt] = useState('0');
  const [brkSupPrc, setBrkSupPrc] = useState('0');
  const [brkVat, setBrkVat] = useState('0');

  const [brkDedtAmt, setBrkDedtAmt] = useState('0');
  const [brkTaxAmt, setBrkTaxAmt] = useState('0');
  const [brkPayAmt, setBrkPayAmt] = useState('0');

  const [brkSaleDt, setBrkSaleDt] = useState('');

  // 차량명 선택 상태 관리
  const [carNm, setCarNm] = useState('');

  // 차량번호 선택 상태 관리
  const [carNo, setCarNo] = useState('');
  
  // 고객명/상사명 선택 상태 관리
  const [ownrNm, setOwnrNm] = useState('');
  
  // 연락처 선택 상태 관리
  const [ownrPhon, setOwnrPhon] = useState('');
  
  // 특이사항 선택 상태 관리
  const [brkDesc, setBrkDesc] = useState('');

  // 차량 등록 ID 선택 상태 관리
  const [carRegId, setCarRegId] = useState('1234');
  
  // 페이지 로드 시 모달 자동 열기 (한 번만 실행)
  useEffect(() => {
    // 차량 정보가 없으면 모달을 자동으로 열기 (페이지 로드 시에만)
    if (!carPurDetail || !carPurDetail.CAR_REG_ID) {
      console.log('차량 정보 없음 - 모달 열기');
      setIsModalOpen(true);
    } else {
      console.log('차량 정보 있음 - 모달 열지 않음');
    }
  }, []); // 빈 의존성 배열로 변경하여 한 번만 실행

  // 알선금액이 변경될 때 공급가액과 부가세 계산
  useEffect(() => {
    // 문자열에서 숫자로 변환
    const amount = Number(brkAmt.replace(/[^0-9]/g, ''));
    
    if (!isNaN(amount)) {
      // 공급가액 = 매입금액 / 1.1 (소수점 버림)
      const supplyPrice = Math.floor(amount / 1.1);
      // 부가세 = 매입금액 - 공급가액
      const vat = amount - supplyPrice;
      
      setBrkSupPrc(supplyPrice);
      setBrkVat(vat);
    } else {
      setBrkSupPrc(0);
      setBrkVat(0);
    }
  }, [brkAmt]);

  // 차량 선택 핸들러
  const handleCarSelect = (car) => {
    console.log('선택된 차량:', car);
    setSelectedCar(car);
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCarSearchClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {

    setLoading(true);
    setError(null);

    // 매입딜러
    if(!dealerId) {
      alert('판매딜러를 선택해주세요.');
      return;
    }

    // 차량 유형
    if(!carKndCd) {
      alert('차량 유형을 선택해주세요.');
      return;
    }

    // 거래항목 
    if(!tradeItemCd) {
      alert('거래항목을 선택해주세요.');
      return;
    }

    // 알선금액
    if(!brkAmt || brkAmt === '0') {
      alert('알선금액을 입력해주세요.');
      return;
    }

    // 공제비용
    if(!brkDedtAmt || brkDedtAmt === '0') {
      alert('공제비용을 입력해주세요.');
      return;
    }
    
    // 딜러지급액
    if(!brkPayAmt || brkPayAmt === '0') {
      alert('딜러지급액을 입력해주세요.');
      return;
    }

    // 알선판매일
    if(!brkSaleDt) {
      alert('알선판매일을 선택해주세요.');
      return;
    }

    // 차량 유형
    if(!carKndCd) {
      alert('차량 유형을 선택해주세요.');
      return;
    }

    // 증빙종류
    if(!evdcCd) {
      alert('증빙종류를 선택해주세요.');
      return;
    }

    // 차량명
    if(!carNm) {
      alert('차량명을 입력해주세요.');
      return;
    }
    
    // 차량번호
    if(!carNo) {
      alert('차량번호를 입력해주세요.');
      return;
    }
    
    // 고객명/상사명
    if(!ownrNm) {
      alert('고객명/상사명을 입력해주세요.');
      return;
    }
    
    
    // 연락처
    if(!ownrPhon) {
      alert('연락처를 입력해주세요.');
      return;
    }
    
    
    const formValues = {
      carAgent: session?.agentId,                                // 상사사 ID
      dealerId,                                                  // 판매딜러 ID
      tradeItemCd,                                               // 거래항목 코드
      brkSaleDt,                                                 // 알선판매일  
      brkAmt,                                                    // 알선금액
      brkSupPrc,                                                 // 공급가액
      brkVat,                                                    // 부가세
      brkDedtAmt,                                                // 공제비용
      brkTaxAmt,
      brkPayAmt,                                                 // 딜러지급액
      evdcCd,                                                    // 증빙종류 코드
      carKndCd,                                                  // 차량 유형 코드
      carNm,                                                     // 차량명
      carNo,                                                     // 차량번호
      ownrNm,                                                    // 고객명/상사명
      ownrPhon,                                                  // 연락처
      brkDesc,                                                   // 특이사항
      usrId: session?.usrId,                                     // 사용자 ID
      carRegId,                                                  // 차량 등록 ID
      };

    console.log('formValues', formValues);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insertCarConcil`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });
      const res = await response.json();
      
      alert('알선매출 등록 되었습니다.'); // 테스트용 알림
      setLoading(false);
      if (res.success) {
        router.push('/car-concil/list');
        return { success: true, res, error: null };
      } else {
        throw new Error(res.message || '알선매출 등록에 실패했습니다');
      }
    } catch (error) {
      setError(error.message);
      alert('알선매출 등록 중 오류가 발생했습니다.'); // 테스트용 알림
      setLoading(false);
      return { success: false, res: [], error: error.message };
    }

  };


  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">알선매출 등록</h2>

        <div className="guidebox">
          <p className="guidebox__title">매출등록, 세금계산서 발행 연동, 즉시발행 필요</p>
          <p className="guidebox__title">딜러지급액 자동계산(수정가능)</p>
          <p className="guidebox__title">사무장님 재확인 필요</p>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">기준차량</h2>
          <button
            className="btn btn--dark btn--padding--r20"
            type="button"
            id="openBtn"
            onClick={handleCarSearchClick}
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
              <td>{selectedCar?.CAR_STAT_NM || (carPurDetail && carPurDetail.CAR_STAT_NM) || ""}</td>
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
              <th>판매딜러</th>
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

              <th>거래항목</th>
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
                        setTradeItemCd('');
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
                          setTradeItemCd(item.CD);
                          setIsTradeItemCdSelectOpen(false);
                        }}
                      >
                        {item.CD_NM}
                      </li>
                    ))}
                  </ul>
                </div>
              </td>

              <th>알선판매일</th>
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
              <th>알선 금액</th>
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
                    name="brkDedtAmt"
                    value={brkDedtAmt ? Number(brkDedtAmt).toLocaleString() : '0'}
                    onChange={(e) => setBrkDedtAmt(e.target.value.replace(/[^\d]/g, ''))}
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
                    name="brkPayAmt"
                    value={brkPayAmt ? Number(brkPayAmt).toLocaleString() : '0'}
                    onChange={(e) => setBrkPayAmt(e.target.value.replace(/[^\d]/g, ''))}
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
              <th>매출증빙</th>
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
                      value={ownrNm || ''}
                      onChange={(e) => setOwnrNm(e.target.value)}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => setOwnrNm('')}
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
                    value={ownrPhon || ''}
                    onChange={(e) => setOwnrPhon(e.target.value)}
                  />
                  <div className="input__utils">
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => setOwnrPhon('')}
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
                    value={brkDesc || ''}
                    onChange={(e) => setBrkDesc(e.target.value)}
                  />
                  <div className="input__utils">
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => setBrkDesc('')}
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
            window.location.href = "m7.jsp";
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

      {/* 차량 검색 모달 */}
      <CarSearchModal 
        open={isModalOpen} 
        onClose={handleModalClose} 
        onCarSelect={handleCarSelect}
        agentId={session}
      />
    </main>
  );
}
