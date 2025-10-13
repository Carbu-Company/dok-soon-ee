'use client';

import { useState } from 'react';
import CarSearchModal from '@/components/modal/CarSearchModal';

export default function Page({   
    session = null, 
    tradeInItemCDList = [], 
    tradeOutItemCDList = [], 
    carAcctDetail = []
  }) {

  // ===== 거래항목 코드 목록 상태 =====    
  const [isTradeItemOpen, setIsTradeItemOpen] = useState(false);
  const [tradeItemCd, setTradeItemCd] = useState(carAcctDetail.TRADE_ITEM_CD || '');
  const [tradeItemNm, setTradeItemNm] = useState(carAcctDetail.TRADE_ITEM_NM || '');

  // ===== 거래항목 메모 상태 =====    
  const [tradeMemo, setTradeMemo] = useState(carAcctDetail.TRADE_RMRK_NM || '');

  // 거래항목 코드 목록 상태
  const [tradeItemCDList, setTradeItemCDList] = useState(
    carAcctDetail.TRADE_SCT_NM === "입금" ? tradeInItemCDList : 
    carAcctDetail.TRADE_SCT_NM === "출금" ? tradeOutItemCDList : []
  );
  // 차량 검색 모달 상태
  const [isCarSearchModalOpen, setIsCarSearchModalOpen] = useState(false);  
  // 선택된 차량 정보 상태
  const [selectedCar, setSelectedCar] = useState({
    carRegId: '',
    carNo: '',
    carName: '',
    dealerName: ''
  });

  // 차량 검색 모달 열기
  const handleOpenCarSearchModal = () => {
    setIsCarSearchModalOpen(true);
  };

  // 차량 검색 모달 닫기
  const handleCloseCarSearchModal = () => {
    setIsCarSearchModalOpen(false);
  };

  // 차량 선택 핸들러
  const handleCarSelect = (car) => {
    setSelectedCar({
      carRegId: car.CAR_REG_ID || '',
      carNo: car.CAR_NO || '',
      carName: car.CAR_NM || '',
      dealerName: car.DLR_NM || ''
    });
    setIsCarSearchModalOpen(false);
  };

  const handleSubmit = async () => {

    setLoading(true);
    setError(null);

    console.log('tradeItemCd', tradeItemCd);    // 거래항목 코드
    console.log('tradeMemo', tradeMemo);    // 특이사항
    console.log('selectedCar', selectedCar);    // 관계딜러

    // 증빙종류
    if(!tradeItemCd) {
      alert('거래항목명을 선택해주세요.');
      return;
    }

    const formValues = {
      acctDtlSeq : carAcctDetail.ACCT_DTL_SEQ,                   // 계좌 내역 순번
      tradeItemCd : tradeItemCd,                                 // 거래항목 코드
      tradeItemNm : tradeItemNm,                                 // 거래항목 명
      tradeMemo : tradeMemo,                                     // 거래항목 메모
      carRegId : selectedCar.carRegId,                           // 차량 ID
      usrId: session?.usrId,                                     // 사용자 ID
    };

    console.log('formValues', formValues);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateCarAcctDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });
      const res = await response.json();
      
      alert('계좌 내역 수정 완료되었습니다.'); // 테스트용 알림
      setLoading(false);
      return { success: true, res, error: null };
    } catch (error) {
      setError(error.message);
      alert('계좌 내역 수정 중 오류가 발생했습니다.'); // 테스트용 알림
      setLoading(false);
      return { success: false, res: [], error: error.message };
    }
  };

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">내역 등록</h2>

        <div className="guidebox">
          <p className="guidebox__title">차량번호 모달 검색(매입&amp;매도차량) 후 선택 시 차량명, 관계딜러 맵핑</p>
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
              <th>거래일시</th>
              <td>{carAcctDetail.TRADE_DTIME}</td>
              <th>계좌번호</th>
              <td>{carAcctDetail.ACCT_NO}</td>
              <th>통장적요</th>
              <td>{carAcctDetail.TRADE_RMRK_NM}</td>
            </tr>
            <tr>
              <th>입금액</th>
              <td className="text-red">{carAcctDetail.IAMT?.toLocaleString()}</td>
              <th>출금액</th>
              <td className="text-point">{carAcctDetail.OAMT?.toLocaleString()}</td>
              <th>잔액</th>
              <td>{carAcctDetail.BLNC?.toLocaleString()}</td>
            </tr>
            <tr>
              <th>
                거래항목
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico" type="button">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>거래구분을 환경설정에서 상사별로 등록가능합니다.(예,차량매입/상사매도비 등)</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="select">
                  <input className="select__input" type="hidden" name="tradeItem" defaultValue="" />
                  <button 
                    className="select__toggle" 
                    type="button"
                    onClick={() => setIsTradeItemOpen(!isTradeItemOpen)}
                  >
                    <span className="select__text">{tradeItemNm || '선택'}</span>
                    <img className="select__arrow" src="/images/ico-dropdown.svg" alt="" />
                  </button>

                  <ul className="select__menu" style={{display: isTradeItemOpen ? 'block' : 'none'}}>
                    <li className="select__option select__option--selected" data-value="">선택</li>
                    {tradeItemCDList.map((item) => (
                      <li 
                        key={item.CD} 
                        className="select__option" 
                        data-value={item.CD}
                        onClick={() => {
                          setTradeItemCd(item.CD);
                          setTradeItemNm(item.CD_NM);
                          setIsTradeItemOpen(false);
                        }}
                      >
                        {item.CD_NM}
                      </li>
                    ))}
                  </ul>
                </div>
              </td>
              <th>추가메모</th>
              <td colSpan={3}>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="" 
                    value={tradeMemo}
                    onChange={(e) => setTradeMemo(e.target.value)}
                  />
                  <div className="input__utils">
                    <button 
                      type="button" 
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => setTradeMemo('')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>차량번호</th>
              <td>
                <div className="input-group">
                  <div className="input w400">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="" 
                      value={selectedCar.carNo}
                      readOnly
                    />
                    <div className="input__utils">
                      <button 
                        type="button" 
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => setSelectedCar(prev => ({ ...prev, carNo: '' }))}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <button 
                    className="btn btn--dark" 
                    type="button"
                    onClick={handleOpenCarSearchModal}
                  >
                    검색
                  </button>
                </div>
              </td>
              <th>차량명</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="" 
                    value={selectedCar.carName}
                    readOnly
                  />
                  <div className="input__utils">
                    <button 
                      type="button" 
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => setSelectedCar(prev => ({ ...prev, carName: '' }))}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </td>
              <th>관계딜러</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="" 
                    value={selectedCar.dealerName}
                    readOnly
                  />
                  <div className="input__utils">
                    <button 
                      type="button" 
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => setSelectedCar(prev => ({ ...prev, dealerName: '' }))}
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
          onClick={() => { window.location.href = '/bank-account/list'; }}
        >
          취소
        </button>
        <button className="btn btn--primary" type="button" onClick={handleSubmit}>확인</button>
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
        open={isCarSearchModalOpen}
        onClose={handleCloseCarSearchModal}
        onCarSelect={handleCarSelect}
        agentId={session}
      />
    </main>
  );
}
