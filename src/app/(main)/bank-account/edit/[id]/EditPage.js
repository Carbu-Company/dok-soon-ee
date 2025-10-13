'use client';

import { useState } from 'react';
import CarSearchModal from '@/components/modal/CarSearchModal';

export default function Page({   
    session = null, 
    tradeInItemCDList = [], 
    tradeOutItemCDList = [], 
    carAcctDetail = []
  }) {

  // 거래항목 코드 목록 상태
  const [tradeItemCDList, setTradeItemCDList] = useState(
    carAcctDetail.TRADE_SCT_NM === "입금" ? tradeInItemCDList : 
    carAcctDetail.TRADE_SCT_NM === "출금" ? tradeOutItemCDList : []
  );

  console.log("tradeItemCDList", tradeItemCDList);

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

    console.log('evdcCd', evdcCd);    // 거래항목 코드

    console.log('purDesc', purDesc);    // 특이사항
    console.log('parkingCd', parkingCd);    // 주차위치 코드
    console.log('parkingLocationDesc', parkingLocationDesc);    // 주차위치 설명
    console.log('fctCndcYn', fctCndcYn);    // 사실확인서
    console.log('attachedFiles', attachedFiles);    // 관련 서류 첨부
    console.log('parkKeyNo', parkKeyNo);    // Key번호

    // 증빙종류
    if(!evdcCd) {
      alert('거래항목명을 선택해주세요.');
      return;
    }


    const formValues = {
      carRegId : carAcctDetail.ACCT_DTL_SEQ,                     // 계좌 내역 순번
      carAgent: session?.agentId,                                // 상사 ID
      mo=
    };


    console.log('formValues', formValues);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updatePurchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });
      const res = await response.json();
      
      alert('매입차량 수정 완료되었습니다.'); // 테스트용 알림
      setLoading(false);
      return { success: true, res, error: null };
    } catch (error) {
      setError(error.message);
      alert('매입차량 수정 중 오류가 발생했습니다.'); // 테스트용 알림
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
                  <button className="select__toggle" type="button">
                    <span className="select__text">선택</span>
                    <img className="select__arrow" src="/images/ico-dropdown.svg" alt="" />
                  </button>

                  <ul className="select__menu">
                    <li className="select__option select__option--selected" data-value="">선택</li>
                    {tradeItemCDList.map((item) => (
                      <li key={item.CD} className="select__option" data-value={item.CD}>
                        {item.CD_NM}
                      </li>
                    ))}
                  </ul>
                </div>
              </td>
              <th>추가메모</th>
              <td colSpan={3}>
                <div className="input">
                  <input type="text" className="input__field" placeholder="" />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
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
