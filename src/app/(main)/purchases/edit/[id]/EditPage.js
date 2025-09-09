"use client";
import Image from 'next/image'
import { useState, useEffect } from 'react';
import { updatePurchase } from "@/app/(main)/purchases/edit/[id]/api";
import { isValidResidentNumber, checkBizID, isValidCorporateNumber } from '../../../../../../public/js/util.js'
import { openPostcodeSearch } from '@/components/modal/AddressModal'

export default function EditPage({ session = null, dealerList = [], carKndList = [], evdcCdList = [], parkingLocationList = [], carPurDetail = []}) {

  console.log('carPurDetail', carPurDetail);
  
  // 매입딜러 선택 상태 관리 (콤보 박스)
  const [isDealerSelectOpen, setIsDealerSelectOpen] = useState(false);
  const [dealerId, setDealerId] = useState(carPurDetail.DLR_ID || '');

  // 차량 종류 선택 상태 관리 (콤보 박스)
  const [isCarKndSelectOpen, setIsCarKndSelectOpen] = useState(false);
  const [carKndCd, setCarKndCd] = useState(carPurDetail.CAR_KND_CD || '');

  // 증빙종류 선택 상태 관리 (콤보 박스)
  const [isEvdcCdSelectOpen, setIsEvdcCdSelectOpen] = useState(false);
  const [evdcCd, setEvdcCd] = useState(carPurDetail.PUR_EVDC_CD || '');

  // 주차위치 선택 상태 관리 (콤보 박스)
  const [isParkingCdSelectOpen, setIsParkingCdSelectOpen] = useState(false);
  const [parkingCd, setParkingCd] = useState(carPurDetail.PARK_ZON_CD || '');

  // 제시구분 선택 상태 관리 (옵션버튼)
  const [prsnSctCd, setPrsnSctCd] = useState(carPurDetail.PRSN_SCT_CD || '0'); 

  // 매입금액 선택 상태 관리
  const [purAmt, setPurAmt] = useState(carPurDetail?.PUR_AMT ? carPurDetail.PUR_AMT.toString() : '0');
  const [purSupPrc, setPurSupPrc] = useState(carPurDetail.PUR_SUP_PRC || 0);
  const [purVat, setPurVat] = useState(carPurDetail.PUR_VAT || 0);

  // 매입금액이 변경될 때 공급가액과 부가세 계산
  useEffect(() => {
    // purAmt가 undefined이거나 null인 경우 빈 문자열로 처리
    const amountStr = purAmt || '';
    // 문자열에서 숫자로 변환
    const amount = Number(amountStr.toString().replace(/[^0-9]/g, ''));
    
    if (!isNaN(amount)) {
      // 공급가액 = 매입금액 / 1.1 (소수점 버림)
      const supplyPrice = Math.floor(amount / 1.1);
      // 부가세 = 매입금액 - 공급가액
      const vat = amount - supplyPrice;
      
      // 값이 실제로 변경된 경우에만 state 업데이트
      if (purSupPrc !== supplyPrice) {
        setPurSupPrc(supplyPrice);
      }
      if (purVat !== vat) {
        setPurVat(vat);
      }
    } else {
      // 값이 실제로 변경된 경우에만 state 업데이트
      if (purSupPrc !== 0) {
        setPurSupPrc(0);
      }
      if (purVat !== 0) {
        setPurVat(0);
      }
    }
  }, [purAmt, purSupPrc, purVat]);

  // 상사매입비 
  const [agentPurCst, setAgentPurCst] = useState(carPurDetail.AGENT_PUR_CST || '0');

  // 매입일 선택 상태 관리
  const [carPurDt, setCarPurDt] = useState(carPurDetail.CAR_PUR_DT || '');

  // jQuery datepicker와 React state 연동을 위한 전역 콜백 등록
  useEffect(() => {
    // 전역 콜백 함수 등록
    // dateText는 jQuery datepicker의 onSelect 이벤트에서 전달되는 선택된 날짜 값입니다.
    // public/js/main.js 파일의 datepicker 초기화 코드에서 onSelect 콜백을 통해 전달됩니다.
    window.updateCarPurDt = (dateText) => {
      setCarPurDt(dateText);
    };

    // 컴포넌트 언마운트 시 정리
    return () => {
      delete window.updateCarPurDt;
    };
  }, []);

  // 취득세 선택 상태 관리
  const [gainTax, setGainTax] = useState(carPurDetail.GAIN_TAX || '0');

  // 상사매입비 입금일 선택 상태 관리
  const [brokerageDate, setBrokerageDate] = useState(carPurDetail.AGENT_PUR_CST_PAY_DT || '');

  // 이전일 선택 상태 관리
  const [carRegDt, setCarRegDt] = useState(carPurDetail.CAR_REG_DT || '');

  // 발행일 선택 상태 관리
  const [txblIssuDt, setTxblIssuDt] = useState(carPurDetail.TXBL_ISSU_DT || '');

  // 차량명 
  const [carNm, setCarNm] = useState(carPurDetail.CAR_NM || '');

  // 차량번호(매입후) 선택 상태 관리
  const [carNo, setCarNo] = useState(carPurDetail.CAR_NO || '');

  // 차량번호(매입전) 선택 상태 관리
  const [purBefCarNo, setPurBefCarNo] = useState(carPurDetail.PUR_BEF_CAR_NO || '');

  // 고객명 선택 상태 관리
  const [ownrNm, setOwnrNm] = useState(carPurDetail.OWNR_NM || '');

  // 고객구분 선택 상태 관리
  const [ownrTpCd, setOwnrTpCd] = useState(carPurDetail.OWNR_TP_CD || '001');
  const [isOwnrTpCdOpen, setIsOwnrTpCdOpen] = useState(false);

  // 계약서번호 선택 상태 관리
  const [ctshNo, setCtshNo] = useState(carPurDetail.CTSH_NO || '');

  // 주민(법인)등록번호 선택 상태 관리
  const [ownrSsn, setOwnrSsn] = useState(carPurDetail.OWNR_SSN || '');

  // 연락처 선택 상태 관리
  const [ownrPhon, setOwnrPhon] = useState(carPurDetail.OWNR_PHON || '');

  // e메일 주소 선택 상태 관리
  const [ownrEmail, setOwnrEmail] = useState(carPurDetail.OWNR_EMAIL || '');

  // e메일 도메인 선택 상태 관리
  const [emailDomain, setEmailDomain] = useState(carPurDetail.OWNR_EMAIL_DOMAIN || '');
  const [isEmailDomainOpen, setIsEmailDomainOpen] = useState(false);

  // 우편번호
  const [ownrZip, setOwnrZip] = useState(carPurDetail.OWNR_ZIP || '');

  // 주소1 값 저장
  const [ownrAddr1, setOwnrAddr1] = useState(carPurDetail.OWNR_ADDR1 || '');
  // 주소2 값 저장
  const [ownrAddr2, setOwnrAddr2] = useState(carPurDetail.OWNR_ADDR2 || '');

  // 사업자등록번호 값 저장
  const [ownrBrno, setOwnrBrno] = useState(carPurDetail.OWNR_BRNO || '');

  // 세금 납부일 값 저장
  const [txblRcvYn, setTxblRcvYn] = useState(carPurDetail.TXBL_RCV_YN || '');
  const [isTxblRcvYnOpen, setIsTxblRcvYnOpen] = useState(false);

  // 특이사항 선택 상태 관리
  const [purDesc, setPurDesc] = useState(carPurDetail.PUR_DESC || '');

  // 주차위치 설명 선택 상태 관리
  const [parkingLocationDesc, setParkingLocationDesc] = useState(carPurDetail.PARK_ZON_DESC || '');

  // Key번호 선택 상태 관리
  const [parkKeyNo, setParkKeyNo] = useState(carPurDetail.PARK_KEY_NO || '');

  // 사실확인서 선택 상태 관리
  const [fctCndcYn, setFctCndcYn] = useState(carPurDetail.FCT_CNDC_YN || '');
  const [isFctCndcYnOpen, setIsFctCndcYnOpen] = useState(false);

  // 관련 서류 첨부 상태 관리
  const [attachedFiles, setAttachedFiles] = useState([]);

  // 입력 항목 체크 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    openPostcodeSearch((addressData) => {
      setOwnrZip(addressData.zonecode);
      setOwnrAddr1(addressData.address);
      setOwnrAddr2(''); // 상세주소는 초기화
    });
  };

  const handleSubmit = async () => {
    console.log('formValues============================');
    
    
    setLoading(true);
    setError(null);

    console.log('dealerId', dealerId);    // 매입딜러 ID
    console.log('carKndCd', carKndCd);    // 차량 종류 코드
    console.log('evdcCd', evdcCd);    // 증빙종류 코드
    console.log('carNm', carNm);    // 차량명

    console.log('prsnSctCd', prsnSctCd);    // 제시구분 코드
    console.log('purAmt', purAmt);    // 매입금액
    console.log('purSupPrc', purSupPrc);    // 공급가액
    console.log('purVat', purVat);    // 부가세    
    console.log('carPurDt', carPurDt);    // 매입일
    console.log('agentPurCst', agentPurCst);    // 상사매입비
    console.log('brokerageDate', brokerageDate);    // 상사매입비 입금일
    console.log('carRegDt', carRegDt);    // 이전일
    console.log('txblIssuDt', txblIssuDt);    // 발행일
    console.log('carNo', carNo);    // 차량번호(매입후)
    console.log('purBefCarNo', purBefCarNo);    // 차량번호(매입전)
    console.log('ownrNm', ownrNm);    // 고객명
    console.log('ownrTpCd', ownrTpCd);    // 고객구분
    console.log('ctshNo', ctshNo);    // 계약서번호
    console.log('ownrSsn', ownrSsn);    // 주민(법인)등록번호
    console.log('ownrPhon', ownrPhon);    // 연락처
    console.log('ownrEmail', ownrEmail);    // e메일 주소
    console.log('emailDomain', emailDomain);    // e메일 도메인
    console.log('ownrZip', ownrZip);    // 우편번호
    console.log('ownrAddr1', ownrAddr1);    // 주소1
    console.log('ownrAddr2', ownrAddr2);    // 주소2
    console.log('ownrBrno', ownrBrno);    // 사업자등록번호
    console.log('txblRcvYn', txblRcvYn);    // 세금 납부일
    console.log('purDesc', purDesc);    // 특이사항
    console.log('parkingCd', parkingCd);    // 주차위치 코드
    console.log('parkingLocationDesc', parkingLocationDesc);    // 주차위치 설명
    console.log('fctCndcYn', fctCndcYn);    // 사실확인서
    console.log('attachedFiles', attachedFiles);    // 관련 서류 첨부
    console.log('parkKeyNo', parkKeyNo);    // Key번호

    // 매입딜러
    if(!dealerId) {
      alert('매입딜러를 선택해주세요.');
      return;
    }

    // 매입금액
    if(!purAmt || purAmt === '0') {
      alert('매입금액을 입력해주세요.');
      return;
    }

    // 매입일
    if(!carPurDt) {
      alert('매입일을 선택해주세요.');
      return;
    }

    // 상사매입비
    if(!agentPurCst) {
      alert('상사매입비를 입력해주세요.');
      return;
    }

    // 취득세
    if(!gainTax) {
      alert('취득세를 선택해주세요.');
      return;
    }

    // 차량 유형
    if(!carKndCd) {
      alert('차량 유형을 선택해주세요.');
      return;
    }

    // 차량명
    if(!carNm) {
      alert('차량명을 입력해주세요.');
      return;
    }

    // 차량번호(매입후)
    if(!carNo) {
      alert('차량번호(매입후)를 입력해주세요.');
      return;
    }

    // 고객명
    if(!ownrNm) {
      alert('매도자/전소유자명을 입력해주세요.');
      return;
    }

    // 고객구분
    if(!ownrTpCd) {
      alert('고객구분을 선택해주세요.');
      return;
    }

    // 증빙종류
    if(!evdcCd) {
      alert('증빙종류를 선택해주세요.');
      return;
    }

    // 주민(법인)등록번호
    if(ownrSsn) {

      // 주민번호 체크 
      if(!isValidResidentNumber(ownrSsn) && ownrTpCd === '001') {
        alert('주민등록번호를 확인해주세요.');
        return;
      } else if(!isValidCorporateNumber(ownrSsn) && ownrTpCd === '002') {
        alert('법인등록번호를 확인해주세요.');
        return;
      }

    }

    // 사업자번호
    if(ownrBrno) {
      if(!checkBizID(ownrBrno)) {
        alert('사업자등록번호를 확인해주세요.');
        return;
      }
    }

    const formValues = {
      carRegId : carPurDetail.CAR_REG_ID,                        // 매입차량 ID
      carAgent: session?.agentId,                                // 상사사 ID
      purAmt,                                                    // 매입금액
      purSupPrc,                                                 // 공급가액
      purVat,                                                    // 부가세
      carPurDt,                                                  // 매입일   
      agentPurCst,                                               // 상사매입비
      brokerageDate,                                             // 상사매입비 입금일
      gainTax,                                                   // 취득세
      carNm,                                                     // 차량명
      carNo,                                                     // 차량번호(매입후)
      purBefCarNo,                                               // 차량번호(매입전)
      ownrTpCd,                                                  // 소유자 유형
      ownrSsn,                                                   // 주민등록번호
      ownrBrno,                                                  // 사업자등록번호
      ownrNm,                                                    // 고객명
      ownrZip,                                                   // 주소 우편번호
      evdcCd,                                                    // 증빙종류
      carKndCd,                                                  // 차량 유형 
      prsnSctCd,                                                 // 제시 구분
      ownrPhon,                                                  // 연락처
      ownrEmail,                                                 // 이메일 아이디
      emailDomain,                                               // 이메일 도메인
      txblIssuDt,                                                // 세금 납부일
      purDesc,                                                   // 매입설명
      ownrAddr1,                                                 // 주소
      ownrAddr2,                                                 // 상세주소
      attachedFiles,                                             // 관련 서류 첨부
      usrId: session?.usrId,                                     // 사용자 ID
      dealerId,                                                  // 딜러 코드
      parkingCd,                                                 // 주차위치 코드
      parkingLocationDesc,                                       // 주차위치 설명
      parkKeyNo,                                                 // Key번호
      fctCndcYn,                                                 // 사실 확인서 여부
      txblRcvYn,                                                 // 매입수취여부
      ctshNo                                                     // 계약서번호
    };
    

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
        <h2 className="container__title">매입차량 수정</h2>

        <div className="guidebox">
          <p className="guidebox__title">도움말</p>
          <p className="guidebox__desc">도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다.</p>
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
              <th>제시구분<span className="text-red">*</span></th>
              <td>
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="prsnSctCd" 
                        value="0" 
                        defaultChecked
                        onChange={(e) => setPrsnSctCd(e.target.value)}
                      />
                      <span className="form-option__title">상사매입</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="prsnSctCd" 
                        value="1"
                        onChange={(e) => setPrsnSctCd(e.target.value)}
                      />
                      <span className="form-option__title">고객위탁</span>
                    </label>
                  </div>
                </div>
              </td>
              <th>매입딜러</th>
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

              <th>매입금액</th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w160">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="매입금액" 
                      name="purAmt"
                      value={purAmt ? Number(purAmt).toLocaleString() : '0'}
                      onChange={(e) => setPurAmt(e.target.value.replace(/[^\d]/g, ''))}
                      onFocus={(e) => e.target.select()}
                    />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                  <span className="input-help">{purSupPrc?.toLocaleString() || '0'} / {purVat?.toLocaleString() || '0'}</span>
                </div>
              </td>
            </tr>
            <tr>

              <th>매입일</th>
              <td>
                  <div className="input-group">
                    <div className="input w200">
                      <input 
                        type="date" 
                        className="input__field" 
                        placeholder="매입일" 
                        autoComplete="off"
                        name='carPurDt'
                        onChange={(e) => setCarPurDt(e.target.value)}
                        value={carPurDt || ''} 
                      />
                    </div>
                    <span className="input-help">조합전산 제시일</span>
                  </div>
                </td>
              <th>상사매입비</th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w200">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="상사매입비" 
                      name="agentPurCst"
                      value={agentPurCst ? Number(agentPurCst).toLocaleString() : '0'}
                      onChange={(e) => setAgentPurCst(e.target.value.replace(/[^\d]/g, ''))}
                      onFocus={(e) => e.target.select()}
                    />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>

                  <div className="input w200">
                    <input 
                      type="date" 
                      className="input__field" 
                      placeholder="상사매입비 입금일" 
                      autoComplete="off"
                      name='brokerageDate'
                      onChange={(e) => setBrokerageDate(e.target.value)}
                      value={brokerageDate || ''} 
                    />
                  </div>
                </div>
              </td>
              <th>
                (예상)취득세
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico"><span className="ico ico--help">보기</span></button>
                  <div className="tooltip__box">
                    <p>2,860만원 이상의 차량에 대해서는 1.05%의 취득세가 발생합니다.-지방세특례제한법 제68조</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="(예상)취득세" 
                    name="gainTax"
                    value={gainTax ? Number(gainTax).toLocaleString() : '0'}
                    onChange={(e) => setGainTax(e.target.value.replace(/[^\d]/g, ''))}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th>차량명</th>
              <td>
                <div className="input-group input-group--sm">

                  <div className="select w120">
                    <input 
                      className="select__input" 
                      type="hidden" 
                      name="carKndCd" 
                      value={carKndCd || ''} 
                    />
                    <button 
                      className="select__toggle" 
                      type="button"
                      onClick={() => setIsCarKndSelectOpen(!isCarKndSelectOpen)}
                    >
                      <span className="select__text">
                        {carKndCd ? carKndList.find(c => c.CD === carKndCd)?.CD_NM || '선택' : '선택'}
                      </span>
                      <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                    </button>
                    <ul className="select__menu" style={{ display: isCarKndSelectOpen ? 'block' : 'none' }}>
                      <li 
                        key="default-carKnd"
                        className={`select__option ${!carKndCd ? 'select__option--selected' : ''}`}
                        data-value=""
                        onClick={() => {
                          setCarKndCd('');
                          setIsCarKndSelectOpen(false);
                        }}
                      >선택</li>
                      {carKndList && carKndList.map((carKnd) => (
                        <li 
                          key={`carKnd-${carKnd.CD}`}
                          className={`select__option ${carKndCd === carKnd.CD ? 'select__option--selected' : ''}`}
                          data-value={carKnd.CD}
                          onClick={() => {
                            setCarKndCd(carKnd.CD);
                            setIsCarKndSelectOpen(false);
                          }}
                        >{carKnd.CD_NM}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="input w300">
                    <input type="text" className="input__field" placeholder="차량명" name="carNm" value={carNm} onChange={(e) => setCarNm(e.target.value)} onFocus={(e) => e.target.select()} />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>

                </div>
              </td>
              <th>차량번호(매입후)</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="차량번호(매입후)"
                    name="carNo"
                    value={carNo}
                    onChange={(e) => setCarNo(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
              <th>차량번호(매입전)</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="차량번호(매입전)"
                    name="purBefCarNo"
                    value={purBefCarNo}
                    onChange={(e) => setPurBefCarNo(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>

            </tr>

            <tr>
              <th>매도자/전소유자명</th>
              <td>
                <div className="input-group">
                  <div className="input w400">
                    <input type="text" className="input__field" placeholder="고객명 " name="ownrNm" value={ownrNm} onChange={(e) => setOwnrNm(e.target.value)} onFocus={(e) => e.target.select()}/>
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                  {/*<button className="btn btn--dark" type="button" disabled>검색</button>*/}
                  <button className="btn btn--dark" type="button">검색</button>
                </div>
              </td>
              <th>고객구분</th>
              <td>
                <div className="select">
                  <input 
                    className="select__input" 
                    type="hidden" 
                    name="ownrTpCd" 
                    value={ownrTpCd || '001'} 
                  />
                  <button 
                    className="select__toggle" 
                    type="button"
                    onClick={() => setIsOwnrTpCdOpen(!isOwnrTpCdOpen)}
                  >
                    <span className="select__text">
                      {ownrTpCd === '002' ? '법인' : '개인'}
                    </span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>

                  <ul className={`select__menu ${isOwnrTpCdOpen ? 'active' : ''}`}>
                    <li 
                      className={`select__option ${ownrTpCd === '001' ? 'select__option--selected' : ''}`}
                      onClick={() => {
                        setOwnrTpCd('001');
                        setIsOwnrTpCdOpen(false);
                      }}
                    >
                      개인
                    </li>
                    <li 
                      className={`select__option ${ownrTpCd === '002' ? 'select__option--selected' : ''}`}
                      onClick={() => {
                        setOwnrTpCd('002');
                        setIsOwnrTpCdOpen(false);
                      }}
                    >
                      법인
                    </li>
                  </ul>
                </div>
              </td>
              <th>증빙종류</th>
              <td>
                <div className="select">
                  <input 
                    className="select__input" 
                    type="hidden" 
                    name="evdcCd" 
                    value={evdcCd || ''} 
                  />
                  <button 
                    className="select__toggle" 
                    type="button"
                    onClick={() => setIsEvdcCdSelectOpen(!isEvdcCdSelectOpen)}
                  >
                    <span className="select__text">
                      {evdcCd ? evdcCdList.find(item => item.CD === evdcCd)?.CD_NM : '선택'}
                    </span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>

                  <ul className={`select__menu ${isEvdcCdSelectOpen ? 'active' : ''}`}>
                    <li 
                      className="select__option select__option--selected" 
                      onClick={() => {
                        setEvdcCd('');
                        setIsEvdcCdSelectOpen(false);
                      }}
                    >
                      선택
                    </li>
                    {evdcCdList.map((item) => (
                      <li 
                        key={item.CD}
                        className={`select__option ${evdcCd === item.CD ? 'select__option--selected' : ''}`}
                        onClick={() => {
                          setEvdcCd(item.CD);
                          setIsEvdcCdSelectOpen(false);
                        }}
                      >
                        {item.CD_NM}
                      </li>
                    ))}
                  </ul>
                </div>
              </td>
            </tr>

            {/*
            <tr>
              <th>상사매입비</th>
              <td colSpan={5}>
                <div className="input-group">
                  <div className="input w240">
                    <input type="text" className="input__field" placeholder="상사매입비 " />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                  <button className="btn btn--dark" type="button" disabled>확인</button>
                  <button className="btn btn--dark" type="button">확인</button>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                (예상)취득세 
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico"><span className="ico ico--help">보기</span></button>
                  <div className="tooltip__box">
                    <p>문자를 전송할 발신번호의 명의자를 의미합니다. <br /> 선택한 소유자 유형에 따라 구비서류가 상이합니다.</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input">
                  <input type="text" className="input__field" placeholder="(예상)취득세 " />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
              <th>추가</th>
              <td>
                <div className="select">
                  <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                  <button className="select__toggle" type="button">
                    <span className="select__text">선택</span>
                    <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                  </button>

                  <ul className="select__menu">
                    <li className="select__option select__option--selected" data-value="value1">선택</li>
                    <li className="select__option" data-value="value2">선택2</li>
                    <li className="select__option" data-value="value3">선택3</li>
                    <li className="select__option" data-value="value4">선택4</li>
                    <li className="select__option" data-value="value5">선택5</li>
                    <li className="select__option" data-value="value6">선택6</li>
                    <li className="select__option" data-value="value7">선택7</li>
                    <li className="select__option" data-value="value8">선택8</li>
                    <li className="select__option" data-value="value9">선택9</li>
                    <li className="select__option" data-value="value10">선택10</li>
                    <li className="select__option" data-value="value11">선택11</li>
                  </ul>
                </div>
              </td>
              <th>매입비</th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w200">
                    <input type="text" className="input__field" placeholder="매입비 " />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                  <span className="input-group__dash">/</span>
                  <div className="input w200">
                    <input type="text" className="input__field" placeholder="매입비 " />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>선택</th>
              <td colSpan={3}>
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="checkbox" />
                      <span className="form-option__title">옵션명</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="checkbox" />
                      <span className="form-option__title">옵션명</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="checkbox" />
                      <span className="form-option__title">옵션명</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="checkbox" />
                      <span className="form-option__title">옵션명</span>
                    </label>
                  </div>
                </div>
              </td>
              <th>유형</th>
              <td>
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup02" />
                      <span className="form-option__title">상사</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup02" />
                      <span className="form-option__title">딜러</span>
                    </label>
                  </div>
                </div>
              </td>
            </tr>
            */}
          </tbody>
        </table>
      </div>

      <div className="container__btns">
        <button className="btn btn--light" type="button" onClick={() => { window.location.href = '/purchases/list'; }}>취소</button>
        <button className="btn btn--primary" type="button" onClick={handleSubmit}>확인</button>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">선택 입력 정보</h2>
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
              <th>계약서번호</th>
              <td>
                <div className="input w200">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="관인계약서번호"
                    name="ctshNo"
                    value={ctshNo || ''}
                    onChange={(e) => setCtshNo(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
              <th>이전일</th>
              <td>
                <div className="input-group">
                  <div className="input w200">
                    <input 
                      type="date" 
                      className="input__field" 
                      placeholder="이전일" 
                      autoComplete="off"
                      name='carRegDt'
                      onChange={(e) => setCarRegDt(e.target.value)}
                      value={carRegDt || ''} 
                    />
                  </div>
                  <span className="input-help">조합전산 이전일</span>
                </div>
              </td>
              <th>조합제시메모</th>
              <td className="text-left">조합전산 제시메모 내용입니다.</td>
            </tr>

            <tr>
              <th>주민(법인)등록번호</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="주민(법인)등록번호"
                    name="ownrSsn"
                    value={ownrSsn || ''}
                    onChange={(e) => setOwnrSsn(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
              <th>연락처</th>
              <td>
                <div className="input w200">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="- 없이 입력"
                    name="ownrPhon"
                    value={ownrPhon || ''}
                    onChange={(e) => setOwnrPhon(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
              <th>e메일주소</th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w160">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="e메일 주소"
                      name="ownrEmail"
                      value={ownrEmail || ''}
                      onChange={(e) => setOwnrEmail(e.target.value)}
                      onFocus={(e) => e.target.select()}
                    />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                  <span className="input-group__dash">@</span>
                  <div className="select w140">
                    <input className="select__input" type="hidden" name="emailDomain" value={emailDomain || ''} />
                    <button 
                      className="select__toggle" 
                      type="button"
                      onClick={() => setIsEmailDomainOpen(!isEmailDomainOpen)}
                    >
                      <span className="select__text">{emailDomain || '직접입력'}</span>
                      <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                    </button>
                    <ul className={`select__menu ${isEmailDomainOpen ? 'active' : ''}`}>
                      <li 
                        className={`select__option ${!emailDomain ? 'select__option--selected' : ''}`}
                        onClick={() => {
                          setEmailDomain('');
                          setIsEmailDomainOpen(false);
                        }}
                      >직접입력</li>
                      <li 
                        className={`select__option ${emailDomain === 'gmail.com' ? 'select__option--selected' : ''}`}
                        onClick={() => {
                          setEmailDomain('gmail.com');
                          setIsEmailDomainOpen(false);
                        }}
                      >gmail.com</li>
                      <li 
                        className={`select__option ${emailDomain === 'daum.net' ? 'select__option--selected' : ''}`}
                        onClick={() => {
                          setEmailDomain('daum.net');
                          setIsEmailDomainOpen(false);
                        }}
                      >daum.net</li>
                      <li 
                        className={`select__option ${emailDomain === 'nate.com' ? 'select__option--selected' : ''}`}
                        onClick={() => {
                          setEmailDomain('nate.com');
                          setIsEmailDomainOpen(false);
                        }}
                      >nate.com</li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th>주소</th>
              <td colSpan={3}>
                <div className="input-group">

                  <div className="input w400">
                    <input type="hidden" name="ownrZip" value={ownrZip} />
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="검색 버튼을 눌러주세요"
                      name="ownrAddr1"
                      value={ownrAddr1 || ''}
                      onChange={(e) => setOwnrAddr1(e.target.value)}
                    />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                  <button className="btn btn--dark" type="button" onClick={handleAddressSearch}>주소 검색</button>
                  <div className="input w400">
                    <input  
                      type="text" 
                      className="input__field" 
                      placeholder="상세 주소"
                      name="ownrAddr2"
                      value={ownrAddr2 || ''}
                      onChange={(e) => setOwnrAddr2(e.target.value)}
                    />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                </div>
              </td>
              <th></th>
              <td></td>
            </tr>

            <tr>
              <th>사업자등록번호</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="-없이 입력"
                    name="ownrBrno"
                    value={ownrBrno || ''}
                    onChange={(e) => setOwnrBrno(e.target.value)}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>

              <th>매입(세금)계산서</th>
              <td>
                <div className="select">
                  <input 
                    className="select__input" 
                    type="hidden" 
                    name="txblRcvYn" 
                    value={txblRcvYn || ''} 
                    onChange={(e) => setTxblRcvYn(e.target.value)}
                  />
                  <button 
                    className="select__toggle" 
                    type="button"
                    onClick={() => setIsTxblRcvYnOpen(!isTxblRcvYnOpen)}
                  >
                    <span className="select__text">
                      {txblRcvYn === 'Y' ? '수취' : 
                       txblRcvYn === 'N' ? '미수취' :
                       txblRcvYn === 'NA' ? '해당없음' : '선택'}
                    </span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>

                  <ul className={`select__menu ${isTxblRcvYnOpen ? 'active' : ''}`}>
                    <li 
                      className={`select__option ${!txblRcvYn ? 'select__option--selected' : ''}`} 
                      onClick={() => {
                        setTxblRcvYn('');
                        setIsTxblRcvYnOpen(false);
                      }}
                    >선택</li>
                    <li 
                      className={`select__option ${txblRcvYn === 'NA' ? 'select__option--selected' : ''}`}
                      onClick={() => {
                        setTxblRcvYn('NA');
                        setIsTxblRcvYnOpen(false);
                      }}
                    >해당없음</li>
                    <li 
                      className={`select__option ${txblRcvYn === 'Y' ? 'select__option--selected' : ''}`}
                      onClick={() => {
                        setTxblRcvYn('Y');
                        setIsTxblRcvYnOpen(false);
                      }}
                    >수취</li>
                    <li 
                      className={`select__option ${txblRcvYn === 'N' ? 'select__option--selected' : ''}`}
                      onClick={() => {
                        setTxblRcvYn('N');
                        setIsTxblRcvYnOpen(false);
                      }}
                    >미수취</li>
                  </ul>
                </div>
              </td>
              <th>계산서발행일</th>
              <td>
                <div className="input-group">
                  <div className="input w200">
                    <input 
                      type="date" 
                      className="input__field" 
                      placeholder="발행일" 
                      autoComplete="off"
                      name='txblIssuDt'
                      onChange={(e) => setTxblIssuDt(e.target.value)}
                      value={txblIssuDt || ''} 
                    />
                  </div>
                  <span className="input-help">계산서 발행일 및 계약서 계약일</span>
                </div>
              </td>
            </tr>

            <tr>
              <th>사실확인서</th>
              <td>
                <div className="select">
                  <input className="select__input" type="hidden" name="fctCndcYn" value={fctCndcYn || ''} />
                  <button 
                    className="select__toggle" 
                    type="button"
                    onClick={() => setIsFctCndcYnOpen(!isFctCndcYnOpen)}
                  >
                    <span className="select__text">{fctCndcYn || '선택'}</span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>

                  <ul className={`select__menu ${isFctCndcYnOpen ? 'active' : ''}`}>
                    <li 
                      className={`select__option ${!fctCndcYn ? 'select__option--selected' : ''}`}
                      onClick={() => {
                        setFctCndcYn('');
                        setIsFctCndcYnOpen(false);
                      }}
                    >선택</li>
                    <li 
                      className={`select__option ${fctCndcYn === 'NA' ? 'select__option--selected' : ''}`}
                      onClick={() => {
                        setFctCndcYn('');
                        setIsFctCndcYnOpen(false);
                      }}
                    >해당없음</li>
                    <li 
                      className={`select__option ${fctCndcYn === 'Y' ? 'select__option--selected' : ''}`}
                      onClick={() => {
                        setFctCndcYn('Y');
                        setIsFctCndcYnOpen(false);
                      }}
                    >수취</li>
                    <li 
                      className={`select__option ${fctCndcYn === 'N' ? 'select__option--selected' : ''}`}
                      onClick={() => {
                        setFctCndcYn('N');
                        setIsFctCndcYnOpen(false);
                      }}
                    >미수취</li>
                  </ul>
                </div>
              </td>
              <th>특이사항</th>
              <td colSpan={3}>
                <div className="input">
                  <textarea 
                    className="input__field" 
                    placeholder="내용 입력"
                    name="purDesc"
                    value={purDesc || ''}
                    onChange={(e) => setPurDesc(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  ></textarea>
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
            </tr>

            {/*
            <tr>
              <th>사업자등록증</th>
              <td colSpan={3}>
                <div className="input-group">
                  <div className="input w440">
                    <input type="text" className="input__field input__field--file" placeholder="파일을 선택하세요" disabled />
                    <div className="input__utils">
                      <button type="button" className="input__remove ico ico--trash">삭제</button>
                    </div>
                  </div>
                  <button className="btn btn--dark" type="button">파일 선택</button>
                </div>
              </td>
            </tr>
            */}
            <tr>
              <th>관련 서류 첨부</th>
              <td colSpan={5}>
                {attachedFiles.length > 0 && attachedFiles.map((file, index) => (
                  <div className="input-group" key={index}>
                    <div className="input w440">
                      <input 
                        type="text" 
                        className="input__field input__field--file" 
                        placeholder="파일을 선택하세요" 
                        value={file.name} 
                        disabled 
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="input__remove ico ico--trash"
                          onClick={() => {
                            const newFiles = [...attachedFiles];
                            newFiles.splice(index, 1);
                            setAttachedFiles(newFiles);
                          }}
                        >삭제</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="input-group">
                  <button 
                    type="button" 
                    className="btn btn--sm btn--light"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.onchange = (e) => {
                        if (e.target.files?.[0]) {
                          setAttachedFiles([...attachedFiles, e.target.files[0]]);
                        }
                      };
                      input.click();
                    }}
                  >
                    <span className="ico ico--add-black"></span>추가
                  </button>
                </div>
              </td>
            </tr>

            <tr>
              <th>주차위치</th>
              <td colSpan={3}>
                <div className="input-group input-group--sm">

                  <div className="select w200">
                    <input 
                      className="select__input" 
                      type="hidden" 
                      name="parkingCd" 
                      value={parkingCd || ''} 
                    />
                    <button 
                      className="select__toggle" 
                      type="button"
                      onClick={() => setIsParkingCdSelectOpen(!isParkingCdSelectOpen)}
                    >
                      <span className="select__text">
                        {parkingCd ? parkingLocationList.find(item => item.CD === parkingCd)?.CD_NM : '선택'}
                      </span>
                      <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                    </button>

                    <ul className={`select__menu ${isParkingCdSelectOpen ? 'active' : ''}`}>
                      <li 
                        className="select__option select__option--selected" 
                        onClick={() => {
                          setParkingCd('');
                          setIsParkingCdSelectOpen(false);
                        }}
                      >
                        선택
                      </li>
                      {parkingLocationList.map((item) => (
                        <li 
                          key={item.CD}
                          className={`select__option ${parkingCd === item.CD ? 'select__option--selected' : ''}`}
                          onClick={() => {
                            setParkingCd(item.CD);
                            setIsParkingCdSelectOpen(false);
                          }}
                        >
                          {item.CD_NM}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="input w800">
                    <input type="text" className="input__field" placeholder="주차위치"
                      name="parkingLocationDesc"
                      value={parkingLocationDesc || ''}
                      onChange={(e) => setParkingLocationDesc(e.target.value)}
                    />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>

                </div>
              </td>
              <th>Key번호</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="Key번호"
                    name="parkKeyNo"
                    value={parkKeyNo || ''}
                    onChange={(e) => setParkKeyNo(e.target.value)}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
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