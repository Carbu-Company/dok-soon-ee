"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from 'next/navigation';
import CarSearchModal from "@/components/modal/CarSearchModal";
import CustSearchModal from "@/components/modal/CustSearchModal";
import { isValidResidentNumber, checkBizID, isValidCorporateNumber } from '@/lib/util.js'
import { openPostcodeSearch } from '@/components/modal/AddressModal'
import { getAcqTax } from '@/app/(main)/common/script.js'

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
  'gmail.com',
  'daum.net', 
  'nate.com'
];

const TAX_RECEIPT_STATUS = {
  RECEIVED: 'Y',      // 수취
  NOT_RECEIVED: 'N',  // 미수취
  NOT_APPLICABLE: 'E' // 해당없음
};

export default function SalesRegisterPage({
  session, 
  dealerList = [], 
  carKndList = [], 
  evdcCdList = [], 
  parkingLocationList = [], 
  sellTpList = [],
  carPurDetail = []
}) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isCustModalOpen, setIsCustModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  console.log(sellTpList);

  // URL 파라미터를 확인해서 모달을 자동으로 열기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const openModal = urlParams.get("openModal");

      if (openModal === "true") {
        setIsModalOpen(true);
      }
    }
  }, []);

  // 페이지 로드 시 모달 자동 열기 (한 번만 실행)
  useEffect(() => {
    console.log('=== RegPage useEffect 실행 ===');
    console.log('session:', session);
    console.log('session?.agentId:', session?.agentId);
    console.log('carPurDetail:', carPurDetail);
    
    // 차량 정보가 없으면 모달을 자동으로 열기 (페이지 로드 시에만)
    if (!carPurDetail || !carPurDetail.CAR_REG_ID) {
      console.log('차량 정보 없음 - 모달 열기');
      setIsModalOpen(true);
    } else {
      console.log('차량 정보 있음 - 모달 열지 않음');
    }
  }, []); // 빈 의존성 배열로 변경하여 한 번만 실행


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

  // 고객 선택 핸들러
  const handleCustomerSelect = (customer) => {
    console.log('선택된 고객:', customer);
    setSelectedCustomer(customer);
    setIsCustModalOpen(false);
    
    // 선택된 고객 정보를 현재 매수고객에 적용
    if (buyerCustomers.length > 0) {
      const updatedCustomers = buyerCustomers.map(cust => ({
        ...cust,
        customerName: customer.CUST_NM || '',
        residentNumber: customer.CUST_NO || '',
        phone: customer.CUST_PHON || '',
        address: customer.CUST_ADDR || '',
        zipCode: customer.CUST_ZIP || ''
      }));
      setBuyerCustomers(updatedCustomers);
    }
  };

  const handleCustModalClose = () => {
    setIsCustModalOpen(false);
  };

  const handleCustSearchClick = () => {
    setIsCustModalOpen(true);
  };

  // 매수고객 추가 핸들러
  const handleAddBuyerCustomer = () => {
    const newCustomer = {
      id: Date.now(), // 고유 ID 생성
      customerName: '',
      residentNumber: '',
      businessNumber: '',
      phone: '',
      address: '',
      memo: '',
      shareRate: ''
    };
    setBuyerCustomers([...buyerCustomers, newCustomer]);
  };

  // 매수고객 삭제 핸들러
  const handleDeleteBuyerCustomer = (customerId) => {
    if (buyerCustomers.length > 1) { // 최소 1개는 유지
      setBuyerCustomers(buyerCustomers.filter(customer => customer.id !== customerId));
    }
  };

  // 매수고객 정보 업데이트 핸들러
  const handleUpdateBuyerCustomer = (customerId, field, value) => {
    setBuyerCustomers(buyerCustomers.map(customer => 
      customer.id === customerId 
        ? { ...customer, [field]: value }
        : customer
    ));
  };

  /////////////////////////////////////////////////////////////////////////////
  // 매출 등록 항목 
  /////////////////////////////////////////////////////////////////////////////

  // 담당 딜러
  const [selectedSellDealer, setSelectedSellDealer] = useState("");
  const [isSellDealerSelectOpen, setIsSellDealerSelectOpen] = useState(false);

  // 판매금액 선택 상태 관리
  const [sellAmt, setSellAmt] = useState('0');
  const [sellSupPrc, setSellSupPrc] = useState('0');
  const [sellVat, setSellVat] = useState('0');

  // 매입금액이 변경될 때 공급가액과 부가세 계산
  useEffect(() => {
    // sellAmt undefined이거나 null인 경우 빈 문자열로 처리
    const amountStr = sellAmt || '';
    // 문자열에서 숫자로 변환
    const amount = Number(amountStr.toString().replace(/[^0-9]/g, ''));
    
    if (!isNaN(amount)) {
      // 공급가액 = 판매금액 / 1.1 (소수점 올림)
      const supplyPrice = Math.ceil(amount / 1.1);
      // 부가세 = 판매금액 - 공급가액
      const vat = amount - supplyPrice;
      
      // 값이 실제로 변경된 경우에만 state 업데이트
      if (sellSupPrc !== supplyPrice) {
        setSellSupPrc(supplyPrice);
      }
      if (sellVat !== vat) {
        setSellVat(vat);
      }
    } else {
      // 값이 실제로 변경된 경우에만 state 업데이트
      if (sellSupPrc !== 0) {
        setSellSupPrc(0);
      }
      if (sellVat !== 0) {
        setSellVat(0);
      }
    }
  }, [sellAmt]); // sellSupPrc, sellVat 제거하여 무한 루프 방지

  
  // 판매유형 선택 상태 관리
  const [selectedSellType, setSelectedSellType] = useState("");
  const [isSellTypeSelectOpen, setIsSellTypeSelectOpen] = useState(false);

  // 판매일 선택 상태 관리
  const [carSaleDt, setCarSaleDt] = useState('');

  // 상사매도비 선택 상태 관리
  const [agentSelCost, setAgentSelCost] = useState('0');

  // 성능보험료 선택 상태 관리
  const [perfInfeAmt, setPerfInfeAmt] = useState('0');

  // 차량번호(출고) 선택 상태 관리
  const [outCarNo, setOutCarNo] = useState('');

  // selectedCar가 변경될 때 차량번호(출고) 초기값 설정
  useEffect(() => {
    if (selectedCar?.CAR_NO) {
      setOutCarNo(selectedCar.CAR_NO);
    }
  }, [selectedCar]);

  // 특이사항 선택 상태 관리
  const [sellMemo, setSellMemo] = useState('');

  // 관련 서류 첨부 상태 관리
  const [attachedSellFiles, setAttachedSellFiles] = useState([]);

  // 매수고객 정보 상태 관리
  const [buyerCustomers, setBuyerCustomers] = useState([
    {
      id: 1,
      customerName: '',
      residentNumber: '',
      businessNumber: '',
      phone: '',
      zip: '',
      address: '',
      memo: '',
      shareRate: ''
    }
  ]);

  // 주소 검색 핸들러
  const handleBuyerAddressSearch = useCallback(() => {
    openPostcodeSearch((addressData) => {
      setBuyerCustomers(addressData.zonecode);
      setBuyerCustomers(addressData.address);
    });
  }, []);

  const handleSellSubmit = async () => {
    console.log('handleSellSubmit');

    setLoading(true);
    setError(null);


    const formValues = {    
      carRegId: carPurDetail.CAR_REG_ID,                       // 매입차량 ID
      carSaleDt,                                               // 판매일
      saleRegDt: new Date().toISOString().split('T')[0],       // 등록일
      agentId: session?.agentId,                               // 상사사 ID
      dlrId: selectedSellDealer,                               // 딜러 ID
      saleTpCd: selectedSellType,                              // 판매유형
      buyerNm: buyerCustomers[0].customerName,                 // 매수자명
      buyerTpCd: buyerCustomers[0].customerType,               // 매수자구분
      buyerSsn: buyerCustomers[0].residentNumber,              // 매수자 주민번호
      buyerBrno: buyerCustomers[0].businessNumber,             // 매수자 사업자번호
      buyerPhon: buyerCustomers[0].phone,                      // 매수자 연락처
      buyerZip: buyerCustomers[0].zipCode,                     // 매수자 우편번호
      buyerAddr1: buyerCustomers[0].address,                   // 매수자 주소
      buyerAddr2: buyerCustomers[0].addressDetail,             // 매수자 상세주소
      saleAmt: sellAmt,                                        // 판매금액
      saleSupPrc: sellSupPrc,                                  // 판매 공급가액
      saleVat: sellVat,                                        // 판매 부가세
      saleCarNo: outCarNo,                                     // 판매차량번호
      agentSelCost,                                            // 상사매도비
      perfInfeAmt,                                             // 성능보험료
      txblIssuYn: 'N',                                         // 세금계산서발행여부
      selcstInclusYn: 'N',                                     // 매도비포함여부
      selEvdcCd: '',                                           // 매도증빙코드
      selEvdcCont: '',                                         // 매도증빙내용
      selEvdcDt: '',                                           // 매도증빙일자
      adjFinYn: 'N',                                           // 정산완료여부
      attachedFiles: attachedSellFiles,                        // 첨부파일
      saleDesc: sellMemo,                                      // 판매설명
      totFeeAmt: '0',                                          // 총수수료
      realFeeAmt: '0',                                         // 실수수료
      saleCrIssuYn: 'N',                                       // 매도확인서발행여부
      modrId: session?.usrId,                                   // 수정자ID
      buyerCustomers
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateCarSel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });
      const res = await response.json();
      
      alert('매도차량 등록 되었습니다.'); // 테스트용 알림
      setLoading(false);
      if (res.success) {
        router.push('/car-sell/list');
        return { success: true, res, error: null };
      } else {
        throw new Error(res.message || '매도차량 등록에 실패했습니다');
      }
    } catch (error) {
      setError(error.message);
      alert('매도차량 등록 중 오류가 발생했습니다.'); // 테스트용 알림
      setLoading(false);
      return { success: false, res: [], error: error.message };
    }

  };

  /////////////////////////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////
  // 매입 등록 항목 
  /////////////////////////////////////////////////////////////////////////////

  
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
  const [dealerId, setDealerId] = useState(carPurDetail?.DLR_ID || '');
  const [carKndCd, setCarKndCd] = useState(carPurDetail?.CAR_KND_CD || '');
  const [evdcCd, setEvdcCd] = useState(carPurDetail?.PUR_EVDC_CD || '');
  const [parkingCd, setParkingCd] = useState(carPurDetail?.PARK_ZON_CD || '');
  const [prsnSctCd, setPrsnSctCd] = useState(carPurDetail?.PRSN_SCT_CD || PRESENTATION_TYPE.COMPANY_PURCHASE);

  // ===== 금액 관련 상태 =====
  const [purAmt, setPurAmt] = useState(carPurDetail?.PUR_AMT ? carPurDetail.PUR_AMT.toString() : '0');
  const [purSupPrc, setPurSupPrc] = useState(carPurDetail?.PUR_SUP_PRC || 0);
  const [purVat, setPurVat] = useState(carPurDetail?.PUR_VAT || 0);
  const [agentPurCst, setAgentPurCst] = useState(carPurDetail?.AGENT_PUR_CST || '0');
  const [gainTax, setGainTax] = useState(carPurDetail?.GAIN_TAX || '0');

  // 매입금액이 변경될 때 공급가액과 부가세 계산
  useEffect(() => {
    // purAmt가 undefined이거나 null인 경우 빈 문자열로 처리
    const amountStr = purAmt || '';
    // 문자열에서 숫자로 변환
    const amount = Number(amountStr.toString().replace(/[^0-9]/g, ''));
    
    if (!isNaN(amount)) {
      // 공급가액 = 매입금액 / 1.1 (소수점 올림)
      const supplyPrice = Math.ceil(amount / 1.1);
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
  const [carPurDt, setCarPurDt] = useState(carPurDetail?.CAR_PUR_DT || '');
  const [brokerageDate, setBrokerageDate] = useState(carPurDetail?.AGENT_PUR_CST_PAY_DT || '');
  const [carRegDt, setCarRegDt] = useState(carPurDetail?.CAR_REG_DT || '');
  const [txblIssuDt, setTxblIssuDt] = useState(carPurDetail?.TXBL_ISSU_DT || '');

  // ===== 차량 정보 상태 =====
  const [carNm, setCarNm] = useState(carPurDetail?.CAR_NM || '');
  const [carNo, setCarNo] = useState(carPurDetail?.CAR_NO || '');
  const [purBefCarNo, setPurBefCarNo] = useState(carPurDetail?.PUR_BEF_CAR_NO || '');

  // ===== 고객 정보 상태 =====
  const [ownrNm, setOwnrNm] = useState(carPurDetail?.OWNR_NM || '');
  const [ownrTpCd, setOwnrTpCd] = useState(carPurDetail?.OWNR_TP_CD || OWNER_TYPE.INDIVIDUAL);
  const [ctshNo, setCtshNo] = useState(carPurDetail?.CTSH_NO || '');
  const [ownrSsn, setOwnrSsn] = useState(carPurDetail?.OWNR_SSN || '');
  const [ownrPhon, setOwnrPhon] = useState(carPurDetail?.OWNR_PHON || '');
  const [ownrBrno, setOwnrBrno] = useState(carPurDetail?.OWNR_BRNO || '');

  // ===== 이메일 정보 상태 =====
  const [ownrEmail, setOwnrEmail] = useState(carPurDetail?.OWNR_EMAIL || '');
  const [emailDomain, setEmailDomain] = useState(carPurDetail?.OWNR_EMAIL_DOMAIN || '');

  // ===== 주소 정보 상태 =====
  const [ownrZip, setOwnrZip] = useState(carPurDetail?.OWNR_ZIP || '');
  const [ownrAddr1, setOwnrAddr1] = useState(carPurDetail?.OWNR_ADDR1 || '');
  const [ownrAddr2, setOwnrAddr2] = useState(carPurDetail?.OWNR_ADDR2 || '');

  // ===== 세금 및 서류 관련 상태 =====
  const [txblRcvYn, setTxblRcvYn] = useState(carPurDetail?.TXBL_RCV_YN || '');
  const [fctCndcYn, setFctCndcYn] = useState(carPurDetail?.FCT_CNDC_YN || '');

  // ===== 기타 정보 상태 =====
  const [purDesc, setPurDesc] = useState(carPurDetail?.PUR_DESC || '');
  const [parkingLocationDesc, setParkingLocationDesc] = useState(carPurDetail?.PARK_ZON_DESC || '');
  const [parkKeyNo, setParkKeyNo] = useState(carPurDetail?.PARK_KEY_NO || '');
  const [attachedFiles, setAttachedFiles] = useState([]);

  // ===== UI 상태 =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== 계산 로직 (useEffect) =====
  // 제시구분과 차량 종류 변경시 상사매입비 설정
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

  const handlePurSubmit = async () => {

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
      if(!isValidResidentNumber(ownrSsn) && ownrTpCd === OWNER_TYPE.INDIVIDUAL) {
        alert('주민등록번호를 확인해주세요.');
        return;
      } else if(!isValidCorporateNumber(ownrSsn) && ownrTpCd === OWNER_TYPE.CORPORATION) {
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
      agentId: session?.agentId,                                // 상사사 ID
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
      ctshNo,                                                     // 계약서번호
      carRegDt,                                                  // 이전일
    };


    //console.log('formValues', formValues);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateCarPur`, {
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

  /////////////////////////////////////////////////////////////////////////////
  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">판매차량 등록</h2>

        <div className="guidebox">
          <p className="guidebox__title">
            차 정보를 가지고 인입 시 차량 선택 모달 창 불필요.(차량 검색은 필요. 변경가능)
          </p>
          <p className="guidebox__title">
            알선(내 차를 다른 딜러가 파는 경우, 같은 소속 상사 딜러도 마찬가지 임) 처리
          </p>
          <p className="guidebox__title">
            판매 처리 등록 후 모달창 띄움. 정상처리됨. 매출처리등록 진행하시겠습니까?{" "}
          </p>
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
                판매딜러 <span className="text-red">*</span>
              </th>
              <td>
                <div className="select">
                  <input
                    className="select__input"
                    type="hidden"
                    name="dealer"
                    defaultValue="선택"
                  />
                  <button
                    className="select__toggle"
                    type="button"
                    onClick={() => setIsSellDealerSelectOpen(!isSellDealerSelectOpen)}
                  >
                    <span className="select__text">
                      {selectedSellDealer
                        ? dealerList.find(d => d.USR_ID === selectedSellDealer)?.USR_NM || "선택"
                        : "선택"}
                    </span>
                    <Image
                      className="select__arrow"
                      src="/images/ico-dropdown.svg"
                      alt=""
                      width={10}
                      height={10}
                    />
                  </button>

                  <ul
                    className="select__menu"
                    style={{ display: isSellDealerSelectOpen ? "block" : "none" }}
                  >
                    <li
                      className={`select__option ${!selectedSellDealer ? "select__option--selected" : ""}`}
                      onClick={() => {
                        setSelectedSellDealer("");
                        setIsSellDealerSelectOpen(false);
                      }}
                    >
                      선택
                    </li>
                    {dealerList.map((dealer, index) => (
                      <li
                        key={index}
                        className={`select__option ${selectedSellDealer === dealer.USR_ID ? "select__option--selected" : ""}`}
                        data-value={dealer.USR_ID}
                        onClick={() => {
                          setSelectedSellDealer(dealer.USR_ID);
                          setIsSellDealerSelectOpen(false);
                        }}
                      >
                        {dealer.USR_NM}
                      </li>
                    ))}
                  </ul>
                </div>
              </td>

              <th>
                판매금액 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w160">
                    <input
                      type="text"
                      className="input__field"
                      placeholder="판매금액"
                      name="sellAmt"
                      value={sellAmt ? Number(sellAmt).toLocaleString() : '0'}
                      onChange={(e) => setSellAmt(e.target.value.replace(/[^\d]/g, ''))}
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
                  <span className="input-help">{sellSupPrc?.toLocaleString() || '0'} / {sellVat?.toLocaleString() || '0'}</span>
                </div>
              </td>
              <th>
                판매일 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input-group">
                  <div className="input w200">
                  <input 
                        type="date" 
                        className="input__field" 
                        placeholder="판매일" 
                        autoComplete="off"
                        name='carSaleDt'
                        onChange={(e) => setCarSaleDt(e.target.value)}
                        value={carSaleDt || ''} 
                      />
                  </div>
                  <span className="input-help">조합전산 매도일</span>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                상사매도비 <span className="text-red">*</span>
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>상사매도비는 판매 처리시 상사 매출로 자동 등록됩니다.</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input">
                <input 
                      type="text" 
                      className="input__field" 
                      placeholder="상사매도비" 
                      name="agentSelCost"
                      value={agentSelCost ? Number(agentSelCost).toLocaleString() : '0'}
                      onChange={(e) => setAgentSelCost(e.target.value.replace(/[^\d]/g, ''))}
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
                성능보험료 <span className="text-red">*</span>
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>성능보험료는 판매 처리시 상사 매출로 자동 등록됩니다.</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input">
                <input 
                    type="text" 
                    className="input__field" 
                    placeholder="성능보험료" 
                    name="perfInfeAmt"
                    value={perfInfeAmt ? Number(perfInfeAmt).toLocaleString() : '0'}
                    onChange={(e) => setPerfInfeAmt(e.target.value.replace(/[^\d]/g, ''))}
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
                차량번호(출고) <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                <input 
                    type="text" 
                    className="input__field" 
                    placeholder="차량번호(출고)"
                    name="outCarNo"
                    value={outCarNo}
                    onChange={(e) => setOutCarNo(e.target.value)}
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
              <th>판매유형</th>
              <td>
                <div className="select">
                  <input
                    className="select__input"
                    type="hidden"
                    name="sellTpCd"
                    value={selectedSellType || (sellTpList[0]?.CD || '')}
                  />
                  <button 
                    className="select__toggle" 
                    type="button"
                    onClick={() => setIsSellTypeSelectOpen(!isSellTypeSelectOpen)}
                  >
                    <span className="select__text">
                      {sellTpList.find(type => type.CD === selectedSellType)?.CD_NM || sellTpList[0]?.CD_NM || ''}
                    </span>
                    <Image
                      className="select__arrow"
                      src="/images/ico-dropdown.svg"
                      alt=""
                      width={10}
                      height={10}
                    />
                  </button>

                  <ul className={`select__menu ${isSellTypeSelectOpen ? 'active' : ''}`}>
                    {sellTpList.map((type, index) => (
                      <li 
                        key={index}
                        className={`select__option ${(selectedSellType || sellTpList[0]?.CD) === type.CD ? 'select__option--selected' : ''}`}
                        data-value={type.CD}
                        onClick={() => {
                          setSelectedSellType(type.CD);
                          setIsSellTypeSelectOpen(false);
                        }}
                      >
                        {type.CD_NM}
                      </li>
                    ))}
                  </ul>
                </div>
              </td>
              <th>특이사항</th>
              <td colSpan="3">
                <div className="input">
                <textarea 
                    className="input__field" 
                    placeholder="내용 입력"
                    name="sellMemo"
                    value={sellMemo || ''}
                    onChange={(e) => setSellMemo(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  ></textarea>
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
              <th>관련 서류 첨부</th>
              <td colSpan={5}>
                {attachedSellFiles.length > 0 && attachedSellFiles.map((file, index) => (
                  <div className="input-group" key={index}>
                    <div className="input w440">
                      <input 
                        type="text" 
                        className="input__field input__field--file" 
                        placeholder="파일을 선택하세요" 
                        value={file.name || ''} 
                        disabled 
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="input__remove ico ico--trash"
                          onClick={() => {
                            const newFiles = [...attachedSellFiles];
                            newFiles.splice(index, 1);
                            setAttachedSellFiles(newFiles);
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
                          const file = e.target.files[0];
                          setAttachedSellFiles([...attachedSellFiles, {
                            file: file,
                            name: file.name,
                            url: null,
                            uploaded: false
                          }]);
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
          </tbody>
        </table>
      </div>

      {/* 알선 경우만 s */}
      <div className="table-wrap" id="alson_div" style={{ display: "none" }}>
        <h2 className="table-wrap__title">알선</h2>
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
                알선딜러 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                  <input type="text" className="input__field" placeholder="" />
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
                차주입금액 <span className="text-red">*</span>
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>
                      매입상사 차주딜러에게 입금되어야 할 금액(즉, 판매가-차주입금액은 알선딜러
                      수익이 됨)
                    </p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input">
                  <input type="text" className="input__field" placeholder="금액" defaultValue="0" />
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
                알선수수료
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>
                      알선 판매에 따른 수수료로 매입고객이 지불. 차주상사에는 매출로 등록,
                      알선딜러에는 공제(예수부가세,원천세)후 지급됩니다.
                    </p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input">
                  <input type="text" className="input__field" placeholder="금액" defaultValue="0" />
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
              <th>주민등록번호</th>
              <td>
                <div className="input">
                  <input type="text" className="input__field" placeholder="" />
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
              <th>연락처</th>
              <td>
                <div className="input">
                  <input type="text" className="input__field" placeholder="" />
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
              <th>소속상사명</th>
              <td>
                <div className="input">
                  <input type="text" className="input__field" placeholder="" />
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
              <th>입금계좌</th>
              <td>
                <div className="input">
                  <input type="text" className="input__field" placeholder="" />
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
              <th></th>
              <td></td>
              <th></th>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 알선 경우만 e */}

      {/* 매수자 고객 정보 s */}
      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">매수고객</h2>
          <button 
            className="btn btn--dark btn--padding--r20" 
            type="button" 
            id="btnClone"
            onClick={handleAddBuyerCustomer}
          >
            <span className="ico ico--add"></span>고객 추가(공동명의)
          </button>
        </div>
        <table className="table table--xl" id="myTable">
          <colgroup>
            <col style={{ width: "240px" }} />
            <col style={{ width: "220px" }} />
            <col style={{ width: "200px" }} />
            <col style={{ width: "200px" }} />
            <col style={{ width: "300px" }} />
            <col style={{ width: "200px" }} />
            <col style={{ width: "200px" }} />
            <col style={{ width: "64px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>고객명</th>
              <th>주민(법인)등록번호</th>
              <th>사업자등록번호</th>
              <th>연락처</th>
              <th>주소</th>
              <th>특이사항</th>
              <th>지분율</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {buyerCustomers.map((customer, index) => (
              <tr key={customer.id}>
                <td>
                  <div className="input-with-search">
                    <div className="input">
                      <input 
                        type="text" 
                        className="input__field" 
                        placeholder="고객명"
                        value={customer.customerName}
                        onChange={(e) => handleUpdateBuyerCustomer(customer.id, 'customerName', e.target.value)}
                      />
                      <div className="input__utils">
                        <button
                          type="button"
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => handleUpdateBuyerCustomer(customer.id, 'customerName', '')}
                        >
                          고객명
                        </button>
                      </div>
                    </div>
                    <button className="btn btn--dark" type="button" onClick={handleCustSearchClick}>검색</button>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="주민(법인)등록번호"
                      value={customer.residentNumber}
                      onChange={(e) => handleUpdateBuyerCustomer(customer.id, 'residentNumber', e.target.value)}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleUpdateBuyerCustomer(customer.id, 'residentNumber', '')}
                      >
                        주민(법인)등록번호
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="사업자등록번호"
                      value={customer.businessNumber}
                      onChange={(e) => handleUpdateBuyerCustomer(customer.id, 'businessNumber', e.target.value)}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleUpdateBuyerCustomer(customer.id, 'businessNumber', '')}
                      >
                        사업자등록번호
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="연락처"
                      value={customer.phone}
                      onChange={(e) => handleUpdateBuyerCustomer(customer.id, 'phone', e.target.value)}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleUpdateBuyerCustomer(customer.id, 'phone', '')}
                      >
                        연락처
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="address-input-group">
                    <div className="input zip-input">
                      <input 
                        type="text" 
                        className="input__field" 
                        placeholder="우편번호"
                        value={customer.zip}
                        onChange={(e) => handleUpdateBuyerCustomer(customer.id, 'zip', e.target.value)}
                      />
                    </div>
                    <div className="input-with-search">
                      <div className="input">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder="주소"
                          value={customer.address}
                          onChange={(e) => handleUpdateBuyerCustomer(customer.id, 'address', e.target.value)}
                        />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => handleUpdateBuyerCustomer(customer.id, 'address', '')}
                          >
                            주소
                          </button>
                        </div>
                      </div>
                      <button className="btn btn--dark" type="button" onClick={handleBuyerAddressSearch} style={{ width: "50px" }}>검색</button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="특이사항"
                      value={customer.memo}
                      onChange={(e) => handleUpdateBuyerCustomer(customer.id, 'memo', e.target.value)}
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                        onClick={() => handleUpdateBuyerCustomer(customer.id, 'memo', '')}
                      >
                        특이사항
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input-group">
                    <div className="select w200">
                      <input
                        className="select__input"
                        type="hidden"
                        name={`shareRate_${customer.id}`}
                        value={customer.shareRate}
                      />
                      <button className="select__toggle" type="button">
                        <span className="select__text">{customer.shareRate || '선택'}</span>
                        <Image
                          className="select__arrow"
                          src="/images/ico-dropdown.svg"
                          width={10}
                          height={10}
                          alt=""
                        />
                      </button>
                      <ul className="select__menu">
                        <li 
                          className={`select__option ${!customer.shareRate ? 'select__option--selected' : ''}`}
                          onClick={() => handleUpdateBuyerCustomer(customer.id, 'shareRate', '')}
                        >
                          선택
                        </li>
                        <li 
                          className={`select__option ${customer.shareRate === '1' ? 'select__option--selected' : ''}`}
                          onClick={() => handleUpdateBuyerCustomer(customer.id, 'shareRate', '1')}
                        >
                          1
                        </li>
                        <li 
                          className={`select__option ${customer.shareRate === '2' ? 'select__option--selected' : ''}`}
                          onClick={() => handleUpdateBuyerCustomer(customer.id, 'shareRate', '2')}
                        >
                          2
                        </li>
                        <li 
                          className={`select__option ${customer.shareRate === '99' ? 'select__option--selected' : ''}`}
                          onClick={() => handleUpdateBuyerCustomer(customer.id, 'shareRate', '99')}
                        >
                          99
                        </li>
                        <li 
                          className={`select__option ${customer.shareRate === '100' ? 'select__option--selected' : ''}`}
                          onClick={() => handleUpdateBuyerCustomer(customer.id, 'shareRate', '100')}
                        >
                          100
                        </li>
                      </ul>
                    </div>
                    <span className="input-help">%</span>
                  </div>
                </td>
                <td>
                  <button 
                    type="button" 
                    className="btn btn--ico"
                    onClick={() => handleDeleteBuyerCustomer(customer.id)}
                    disabled={buyerCustomers.length === 1}
                  >
                    <span className="ico ico--trash"></span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 매수자 고객 정보 e */}

      <div className="container__btns">
        <button
          className="btn btn--light"
          type="button"
          onClick={() => {
            window.location.href = "/car-sell/list";
          }}
        >
          취소
        </button>
        <button className="btn btn--primary" type="button" disabled>
          확인
        </button>
        <button className="btn btn--primary" type="button" onClick={handleSellSubmit}>
          확인
        </button>
      </div>

      {/* 매입정보 s */}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmailDomainSelect('');
                        }}
                      >직접입력</li>
                      {EMAIL_DOMAINS.map((domain) => (
                        <li 
                          key={domain}
                          className={`select__option ${emailDomain === domain ? 'select__option--selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEmailDomainSelect(domain);
                          }}
                        >{domain}</li>
                      ))}
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
      {/* 매입정보 e */}

      <div className="container__btns">
        <button className="btn btn--primary" type="button"  onClick={handlePurSubmit}>
          매입정보 수정
        </button>
      </div>

      {/* 차량 검색 모달 */}
      <CarSearchModal 
        open={isModalOpen} 
        onClose={handleModalClose} 
        onCarSelect={handleCarSelect}
        agentId={session}
      />
      
      <CustSearchModal 
        open={isCustModalOpen} 
        onClose={handleCustModalClose} 
        onCarSelect={handleCustomerSelect}
        agentId={session}
      />
    </main>
  );
}
