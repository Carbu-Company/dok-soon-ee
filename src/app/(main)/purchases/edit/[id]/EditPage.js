"use client";
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isValidResidentNumber, checkBizID, isValidCorporateNumber } from '../../../../../lib/util.js'
import { openPostcodeSearch } from '@/components/modal/AddressModal'
import { getAcqTax, autoHypenTelNo, autoHypenBizNO, autoHypenSNO } from '@/app/(main)/common/script.js'

// ===== 상수 정의 =====
const OWNER_TYPE = {
  INDIVIDUAL: '001', // 개인
  CORPORATION: '002' // 법인
};

const PRESENTATION_TYPE = {
  COMPANY_PURCHASE: '0', // 상사매입
  CUSTOMER_CONSIGNMENT: '1' // 고객위탁
};

const EMAIL_DOMAINS = [
  'naver.com',
  'gmail.com',
  'daum.net', 
  'nate.com',
];

const TAX_RECEIPT_STATUS = {
  RECEIVED: 'Y',      // 수취
  NOT_RECEIVED: 'N',  // 미수취
  NOT_APPLICABLE: 'E' // 해당없음
};

// ===== 메인 컴포넌트 =====
export default function EditPage({ 
  session = null, 
  dealerList = [], 
  carKndList = [], 
  evdcCdList = [], 
  parkingLocationList = [], 
  carPurDetail = [] ,  
  cstTypeCdList = [], 
}) {

  const router = useRouter();

  // ===== 드롭다운 열림/닫힘 상태 =====
  const [isDealerSelectOpen, setIsDealerSelectOpen] = useState(false);
  const [isCarKndSelectOpen, setIsCarKndSelectOpen] = useState(false);
  const [isEvdcCdSelectOpen, setIsEvdcCdSelectOpen] = useState(false);
  const [isParkingCdSelectOpen, setIsParkingCdSelectOpen] = useState(false);
  const [isOwnrTpCdOpen, setIsOwnrTpCdOpen] = useState(false);
  const [isEmailDomainOpen, setIsEmailDomainOpen] = useState(false);
  const [isTxblRcvYnOpen, setIsTxblRcvYnOpen] = useState(false);
  const [isFctCndcYnOpen, setIsFctCndcYnOpen] = useState(false);

  // ===== 기본 정보 상태 =====
  const [dealerId, setDealerId] = useState(carPurDetail.DLR_ID || '');
  const [carKndCd, setCarKndCd] = useState(carPurDetail.CAR_KND_CD || '');
  const [evdcCd, setEvdcCd] = useState(carPurDetail.PUR_EVDC_CD || '');
  const [parkingCd, setParkingCd] = useState(carPurDetail.PARK_ZON_CD || '');
  const [prsnSctCd, setPrsnSctCd] = useState(carPurDetail.PRSN_SCT_CD || PRESENTATION_TYPE.COMPANY_PURCHASE);

  // ===== 금액 관련 상태 =====
  const [purAmt, setPurAmt] = useState(carPurDetail?.PUR_AMT ? carPurDetail.PUR_AMT.toString() : '0');
  const [purSupPrc, setPurSupPrc] = useState(carPurDetail.PUR_SUP_PRC || 0);
  const [purVat, setPurVat] = useState(carPurDetail.PUR_VAT || 0);
  const [agentPurCst, setAgentPurCst] = useState(carPurDetail.AGENT_PUR_CST || '0');
  const [gainTax, setGainTax] = useState(carPurDetail.GAIN_TAX || '0');

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
  }, [purAmt]); // purSupPrc, purVat 제거하여 무한 루프 방지

  // ===== 날짜 관련 상태 =====
  const [carPurDt, setCarPurDt] = useState(carPurDetail.CAR_PUR_DT || '');
  const [brokerageDate, setBrokerageDate] = useState(carPurDetail.AGENT_PUR_CST_PAY_DT || '');
  const [carRegDt, setCarRegDt] = useState(carPurDetail.CAR_REG_DT || '');
  const [txblIssuDt, setTxblIssuDt] = useState(carPurDetail.TXBL_ISSU_DT || '');

  // ===== 차량 정보 상태 =====
  const [carNm, setCarNm] = useState(carPurDetail.CAR_NM || '');
  const [carNo, setCarNo] = useState(carPurDetail.CAR_NO || '');
  const [purBefCarNo, setPurBefCarNo] = useState(carPurDetail.PUR_BEF_CAR_NO || '');

  // ===== 고객 정보 상태 =====
  const [ownrNm, setOwnrNm] = useState(carPurDetail.OWNR_NM || '');
  const [ownrTpCd, setOwnrTpCd] = useState(carPurDetail.OWNR_TP_CD || OWNER_TYPE.INDIVIDUAL);
  const [ctshNo, setCtshNo] = useState(carPurDetail.CTSH_NO || '');
  const [ownrSsn, setOwnrSsn] = useState(carPurDetail.OWNR_SSN || '');
  const [ownrPhon, setOwnrPhon] = useState(carPurDetail.OWNR_PHON || '');
  const [ownrBrno, setOwnrBrno] = useState(carPurDetail.OWNR_BRNO || '');

  // ===== 이메일 정보 상태 =====
  const [ownrEmail, setOwnrEmail] = useState(carPurDetail.OWNR_EMAIL || '');

  // ===== 주소 정보 상태 =====
  const [ownrZip, setOwnrZip] = useState(carPurDetail.OWNR_ZIP || '');
  const [ownrAddr1, setOwnrAddr1] = useState(carPurDetail.OWNR_ADDR1 || '');
  const [ownrAddr2, setOwnrAddr2] = useState(carPurDetail.OWNR_ADDR2 || '');

  // ===== 세금 및 서류 관련 상태 =====
  const [txblRcvYn, setTxblRcvYn] = useState(carPurDetail.TXBL_RCV_YN || '');
  const [fctCndcYn, setFctCndcYn] = useState(carPurDetail.FCT_CNDC_YN || '');

  // ===== 기타 정보 상태 =====
  const [purDesc, setPurDesc] = useState(carPurDetail.PUR_DESC || '');
  const [parkingLocationDesc, setParkingLocationDesc] = useState(carPurDetail.PARK_ZON_DESC || '');
  const [parkKeyNo, setParkKeyNo] = useState(carPurDetail.PARK_KEY_NO || '');
  const [attachedFiles, setAttachedFiles] = useState([]);

  // 비용 발급 코드 선택 상태 관리 (콤보 박스)
  const [isCstTypeCdSelectOpen, setIsCstTypeCdSelectOpen] = useState(false);
  const [cstTypeCd, setCstTypeCd] = useState(carPurDetail.AGENT_PUR_CST_ISSU_CD || '');
    
  // ===== UI 상태 =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== 계산 로직 (useEffect) =====
  // 제시구분과 차량 종류 변경시 상사매입비 설정
  /*
  useEffect(() => {
    if (prsnSctCd === PRESENTATION_TYPE.COMPANY_PURCHASE) {
      // 상사매입이면...
      if (carKndCd !== '') {        
        const carKndValue = carKndCd.split('|')[1];
        setAgentPurCst(carKndValue);
      } else {
        setAgentPurCst('0');
      }
    } else {
      // 고객위탁이면...
      setAgentPurCst('0');
    }
  }, [prsnSctCd, carKndCd]);
  */

  // 매입금액과 차량 종류 변경시 취득세 계산 (상사매입일 때만)
  useEffect(() => {
    if (prsnSctCd === PRESENTATION_TYPE.COMPANY_PURCHASE && carKndCd !== '') {
      const carKndCdValue = carKndCd.split('|')[0];
      const taxAmount = getAcqTax(purAmt, carKndCdValue);
      setGainTax(taxAmount);
    } else {
      setGainTax('0');
    }
  }, [prsnSctCd, purAmt, carKndCd]);

  // ===== 이벤트 핸들러 =====
  // 주소 검색 핸들러
  const handleAddressSearch = useCallback(() => {
    openPostcodeSearch((addressData) => {
      setOwnrZip(addressData.zonecode);
      setOwnrAddr1(addressData.address);
      setOwnrAddr2(''); // 상세주소는 초기화
    });
  }, []);

  // 드롭다운 선택 핸들러들
  const handleDealerSelect = useCallback((dealerId) => {
    setDealerId(dealerId);
    setIsDealerSelectOpen(false);
  }, []);

  const handleCarKindSelect = useCallback((carKndCd) => {
    setCarKndCd(carKndCd);
    setIsCarKndSelectOpen(false);
  }, []);

  const handleOwnerTypeSelect = useCallback((ownrTpCd) => {
    setOwnrTpCd(ownrTpCd);
    setIsOwnrTpCdOpen(false);
  }, []);

  const handleEvidenceSelect = useCallback((evdcCd) => {
    setEvdcCd(evdcCd);
    setIsEvdcCdSelectOpen(false);
  }, []);

  const handleEmailDomainSelect = useCallback((domain) => {
    setEmailDomain(domain);
    setIsEmailDomainOpen(false);
  }, []);

  const handleTaxReceiptSelect = useCallback((status) => {
    setTxblRcvYn(status);
    setIsTxblRcvYnOpen(false);
  }, []);

  const handleFactConfirmSelect = useCallback((status) => {
    setFctCndcYn(status);
    setIsFctCndcYnOpen(false);
  }, []);

  const handleParkingSelect = useCallback((parkingCd) => {
    setParkingCd(parkingCd);
    setIsParkingCdSelectOpen(false);
  }, []);

  const handleSubmit = async () => {

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
    console.log('cstTypeCd', cstTypeCd);    // 비용 발급 코드
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
      if(!isValidResidentNumber(ownrSsn.replace(/-/g, '')) && ownrTpCd === OWNER_TYPE.INDIVIDUAL) {
        alert('주민등록번호를 확인해주세요.');
        return;
      } else if(!isValidCorporateNumber(ownrSsn.replace(/-/g, '')) && ownrTpCd === OWNER_TYPE.CORPORATION) {
        alert('법인등록번호를 확인해주세요.');
        return;
      }

    }

    // 사업자번호
    if(ownrBrno) {
      if(!checkBizID(ownrBrno.replace(/-/g, ''))) {
        alert('사업자등록번호를 확인해주세요.');
        return;
      }
    }

    const formValues = {
      carRegId : carPurDetail.CAR_REG_ID,                        // 매입차량 ID
      agentId: session?.agentId,                                // 상사사 ID
      purAmt,                                                    // 매입금액
      purSupPrc,                                                 // 공급가액
      purVat,                                                    // 부가세
      carPurDt,                                                  // 매입일   
      agentPurCst,                                               // 상사매입비
      brokerageDate,                                             // 상사매입비 입금일
      cstTypeCd,                                                 // 비용 발급 코드
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
      txblIssuDt,                                                // 세금 납부일
      purDesc,                                                   // 매입설명
      ownrAddr1,                                                 // 주소
      ownrAddr2,                                                 // 상세주소
      attachedFiles: attachedFiles.map(file => ({
        name: file.name,
        url: file.url
      })), // 관련 서류 첨부 (파일명과 URL)
      usrId: session?.usrId,                                     // 사용자 ID
      dealerId,                                                  // 딜러 코드
      parkingCd,                                                 // 주차위치 코드
      parkingLocationDesc,                                       // 주차위치 설명
      parkKeyNo,                                                 // Key번호
      fctCndcYn,                                                 // 사실 확인서 여부
      txblRcvYn,                                                 // 매입수취여부
      ctshNo,                                                     // 계약서번호
      carRegDt,                                                  // 이전일
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateCarPur`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });
      const res = await response.json();

      alert('매입차량 수정 되었습니다.'); // 테스트용 알림
      setLoading(false);
      if (res.success) {
        router.back();
        return { success: true, res, error: null };
      } else {
        throw new Error(res.message || '매입차량 수정에 실패했습니다');
      }
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
                        value={PRESENTATION_TYPE.COMPANY_PURCHASE}
                        checked={prsnSctCd === PRESENTATION_TYPE.COMPANY_PURCHASE}
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
                        value={PRESENTATION_TYPE.CUSTOMER_CONSIGNMENT}
                        checked={prsnSctCd === PRESENTATION_TYPE.CUSTOMER_CONSIGNMENT}
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

                  <ul className={`select__menu ${isDealerSelectOpen ? 'active' : ''}`}>
                    <li 
                      key="default-dealer"
                      className={`select__option ${!dealerId ? 'select__option--selected' : ''}`}
                      data-value=""
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDealerSelect('');
                      }}
                    >선택</li>
                    {dealerList && dealerList.map((dealer) => (
                      <li 
                        key={`dealer-${dealer.USR_ID}`}
                        className={`select__option ${dealerId === dealer.USR_ID ? 'select__option--selected' : ''}`}
                        data-value={dealer.USR_ID}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDealerSelect(dealer.USR_ID);
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

                  <div className="select w120">
                    <input 
                      className="select__input" 
                      type="hidden" 
                      name="carKndCd" 
                      value={cstTypeCd || ''} 
                    />
                    <button 
                      className="select__toggle" 
                      type="button"
                      onClick={() => setIsCstTypeCdSelectOpen(!isCstTypeCdSelectOpen)}
                    >
                      <span className="select__text">
                        {cstTypeCd ? cstTypeCdList.find(c => c.CD === cstTypeCd)?.CD_NM || '해당없음' : '해당없음'}
                      </span>
                      <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                    </button>
                    <ul className="select__menu" style={{ display: isCstTypeCdSelectOpen ? 'block' : 'none' }}>
                      <li 
                        key="default-cstType"
                        className={`select__option ${!cstTypeCd ? 'select__option--selected' : ''}`}
                        data-value="000"
                        onClick={() => {
                          setCstTypeCd('000');
                          setIsCstTypeCdSelectOpen(false);
                        }}
                      >해당없음</li>
                      {cstTypeCdList && cstTypeCdList.map((cstType) => (
                        <li 
                          key={`cstType-${cstType.CD}`}
                          className={`select__option ${cstTypeCd === cstType.CD ? 'select__option--selected' : ''}`}
                          data-value={`${cstType.CD}`}
                          onClick={() => {
                            setCstTypeCd(`${cstType.CD}`);
                            setIsCstTypeCdSelectOpen(false);
                          }}
                        >{cstType.CD_NM}</li>
                      ))}
                    </ul>
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
                      value={carKndCd ? `${carKndCd}|0` : ''} 
                    />
                    <button 
                      className="select__toggle" 
                      type="button"
                      onClick={() => setIsCarKndSelectOpen(!isCarKndSelectOpen)}
                    >
                      <span className="select__text">
                        {carKndCd ? carKndList.find(c => c.CD === carKndCd.split('|')[0])?.CD_NM || '선택' : '선택'}
                      </span>
                      <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                    </button>
                    <ul className={`select__menu ${isCarKndSelectOpen ? 'active' : ''}`}>
                      <li 
                        key="default-carKnd"
                        className={`select__option ${!carKndCd ? 'select__option--selected' : ''}`}
                        data-value=""
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCarKindSelect('');
                        }}
                      >선택</li>
                      {carKndList && carKndList.map((carKnd) => (
                        <li 
                          key={`carKnd-${carKnd.CD}`}
                          className={`select__option ${carKndCd === `${carKnd.CD}|${carKnd.CD_NM2}` ? 'select__option--selected' : ''}`}
                          data-value={`${carKnd.CD}|${carKnd.CD_NM2}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCarKindSelect(`${carKnd.CD}|${carKnd.CD_NM2}`);
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
                      {ownrTpCd === OWNER_TYPE.CORPORATION ? '법인' : '개인'}
                    </span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>

                  <ul className={`select__menu ${isOwnrTpCdOpen ? 'active' : ''}`}>
                    <li 
                      className={`select__option ${ownrTpCd === OWNER_TYPE.INDIVIDUAL ? 'select__option--selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOwnerTypeSelect(OWNER_TYPE.INDIVIDUAL);
                      }}
                    >
                      개인
                    </li>
                    <li 
                      className={`select__option ${ownrTpCd === OWNER_TYPE.CORPORATION ? 'select__option--selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOwnerTypeSelect(OWNER_TYPE.CORPORATION);
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEvidenceSelect('');
                      }}
                    >
                      선택
                    </li>
                    {evdcCdList.map((item) => (
                      <li 
                        key={item.CD}
                        className={`select__option ${evdcCd === item.CD ? 'select__option--selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEvidenceSelect(item.CD);
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
                    onChange={(e) => {
                      autoHypenSNO(e.target);
                      setOwnrSsn(e.target.value);
                    }}
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
                    onChange={(e) => {
                      let value = autoHypenTelNo(e.target.value);
                      setOwnrPhon(value);
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                  </div>
                </div>
              </td>
              <th>e메일주소</th>
              <td>
                <div className="input">
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
                    onChange={(e) => {
                      autoHypenBizNO(e.target);
                      setOwnrBrno(e.target.value);
                    }}
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
                      {txblRcvYn === TAX_RECEIPT_STATUS.RECEIVED ? '수취' : 
                       txblRcvYn === TAX_RECEIPT_STATUS.NOT_RECEIVED ? '미수취' :
                       txblRcvYn === TAX_RECEIPT_STATUS.NOT_APPLICABLE ? '해당없음' : '선택'}
                    </span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>

                  <ul className={`select__menu ${isTxblRcvYnOpen ? 'active' : ''}`}>
                    <li 
                      className={`select__option ${!txblRcvYn ? 'select__option--selected' : ''}`} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaxReceiptSelect('');
                      }}
                    >선택</li>
                    <li 
                      className={`select__option ${txblRcvYn === TAX_RECEIPT_STATUS.NOT_APPLICABLE ? 'select__option--selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaxReceiptSelect(TAX_RECEIPT_STATUS.NOT_APPLICABLE);
                      }}
                    >해당없음</li>
                    <li 
                      className={`select__option ${txblRcvYn === TAX_RECEIPT_STATUS.RECEIVED ? 'select__option--selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaxReceiptSelect(TAX_RECEIPT_STATUS.RECEIVED);
                      }}
                    >수취</li>
                    <li 
                      className={`select__option ${txblRcvYn === TAX_RECEIPT_STATUS.NOT_RECEIVED ? 'select__option--selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaxReceiptSelect(TAX_RECEIPT_STATUS.NOT_RECEIVED);
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
                    <span className="select__text">{fctCndcYn === TAX_RECEIPT_STATUS.RECEIVED ? '수취' : 
                       fctCndcYn === TAX_RECEIPT_STATUS.NOT_RECEIVED ? '미수취' :
                       fctCndcYn === TAX_RECEIPT_STATUS.NOT_APPLICABLE ? '해당없음' : '선택'}</span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>

                  <ul className={`select__menu ${isFctCndcYnOpen ? 'active' : ''}`}>
                    <li 
                      className={`select__option ${!fctCndcYn ? 'select__option--selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFactConfirmSelect('');
                      }}
                    >선택</li>
                    <li 
                      className={`select__option ${fctCndcYn === TAX_RECEIPT_STATUS.NOT_APPLICABLE ? 'select__option--selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFactConfirmSelect(TAX_RECEIPT_STATUS.NOT_APPLICABLE);
                      }}
                    >해당없음</li>
                    <li 
                      className={`select__option ${fctCndcYn === TAX_RECEIPT_STATUS.RECEIVED ? 'select__option--selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFactConfirmSelect(TAX_RECEIPT_STATUS.RECEIVED);
                      }}
                    >수취</li>
                    <li 
                      className={`select__option ${fctCndcYn === TAX_RECEIPT_STATUS.NOT_RECEIVED ? 'select__option--selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFactConfirmSelect(TAX_RECEIPT_STATUS.NOT_RECEIVED);
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleParkingSelect('');
                        }}
                      >
                        선택
                      </li>
                      {parkingLocationList.map((item) => (
                        <li 
                          key={item.CD}
                          className={`select__option ${parkingCd === item.CD ? 'select__option--selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleParkingSelect(item.CD);
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