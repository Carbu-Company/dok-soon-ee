"use client";
import Image from 'next/image'
import { isValidResidentNumber, isValidBusinessNumber, isValidCorporateNumber } from '../../../../../public/js/util.js'
import { useState } from 'react'

export default function RegPage({ session = null, dealerList = [], evdcCdList = [] }) {
    console.log(evdcCdList);
    // 유효한 증빙코드 목록만 필터링
    const validEvdcList = evdcCdList.filter(item => item || item.CD_ID || item.CD_NM);

    // 연락처 상태 관리
    const [phoneNumber, setPhoneNumber] = useState('01012345678');
    
    // 고객 정보 상태 관리
    const [customerName, setCustomerName] = useState('홍길동');
    const [evdcCd, setEvdcCd] = useState('001');
    const [emailId, setEmailId] = useState('test');
    const [emailDomain, setEmailDomain] = useState('naver.com');
    const [address, setAddress] = useState('서울특별시 성동구 왕십리로 12길 27, 6층');
    const [addressDetail, setAddressDetail] = useState('제이플랜 파크빌 605호');

    // 파일 업로드 상태 관리
    const [attachedFiles, setAttachedFiles] = useState([
      { id: 1, name: '홍길동_추가 서류_1.pdf' },
      { id: 2, name: '홍길동_추가 서류_2.pdf' }
    ]);

    // 상태 관리
    const [residentNumber, setResidentNumber] = useState('821212-1527515');
    const [businessNumber, setBusinessNumber] = useState('790-35-42372');
    const [customerType, setCustomerType] = useState('개인'); // '개인' 또는 '법인'
    const [validationErrors, setValidationErrors] = useState({});

    // 금액 관련 상태
    const [purchaseAmount, setPurchaseAmount] = useState('5000000');          // 매입금액
    const [brokerageAmount, setBrokerageAmount] = useState('222220');       // 상사매입비
    const [acquisitionTax, setAcquisitionTax] = useState('11110');         // 취득세
    const [brokerageDate, setBrokerageDate] = useState('2025-09-02');           // 상사매입비 입금일
    const [purchaseDate, setPurchaseDate] = useState('2025-09-02');             // 매입일

    // 차량 관련 상태
    const [vehicleType, setVehicleType] = useState('승용');            // 차량 유형
    const [vehicleName, setVehicleName] = useState('렉서스');               // 차량명
    const [vehicleNumberAfter, setVehicleNumberAfter] = useState('69보고 70톤'); // 차량번호(매입후)
    const [vehicleNumberBefore, setVehicleNumberBefore] = useState(''); // 차량번호(매입전)
    const [selectedDealer, setSelectedDealer] = useState('');         // 매입딜러
    const [presentationType, setPresentationType] = useState('상사매입'); // 제시구분
    const [isSelectOpen, setIsSelectOpen] = useState(false);         // 셀렉트 박스 열림/닫힘 상태

    // 주민(법인)등록번호 유효성 검사
    const validateResidentNumber = (value) => {
        if (!value.trim()) {
            return '';
        }

        let isValid = false;
        if (customerType === '개인') {
            isValid = isValidResidentNumber(value);
        } else if (customerType === '법인') {
            isValid = isValidCorporateNumber(value);
        }

        return isValid ? '' : `유효하지 않은 ${customerType === '개인' ? '주민등록번호' : '법인등록번호'}입니다.`;
    };

    // 사업자등록번호 유효성 검사
    const validateBusinessNumber = (value) => {
        if (!value.trim()) {
            return '';
        }
        return isValidBusinessNumber(value) ? '' : '유효하지 않은 사업자등록번호입니다.';
    };

    // 입력값 변경 핸들러
    const handleResidentNumberChange = (e) => {
        const value = e.target.value;
        setResidentNumber(value);
        
        const error = validateResidentNumber(value);
        setValidationErrors(prev => ({
            ...prev,
            residentNumber: error
        }));
    };

    const handleBusinessNumberChange = (e) => {
        const value = e.target.value;
        setBusinessNumber(value);
        
        const error = validateBusinessNumber(value);
        setValidationErrors(prev => ({
            ...prev,
            businessNumber: error
        }));
    };

    const handleCustomerTypeChange = (type) => {
        setCustomerType(type);
        // 고객구분이 변경되면 주민(법인)등록번호 재검증
        if (residentNumber) {
            const error = validateResidentNumber(residentNumber);
            setValidationErrors(prev => ({
                ...prev,
                residentNumber: error
            }));
        }
    };

    // 금액 입력 핸들러 (숫자만 입력 가능하도록)
    const handleNumberInput = (value, setter) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setter(numericValue);
    };

    // 날짜 입력 핸들러
    const handleDateInput = (value, setter) => {
        setter(value);
    };

    // 제시구분 변경 핸들러
    const handlePresentationTypeChange = (e) => {
        setPresentationType(e.target.checked ? '고객위탁' : '상사매입');
    };

    // 매입딜러 선택 핸들러
    const handleDealerSelect = (dealerCd) => {
        setSelectedDealer(dealerCd);
    };

    // 차량 유형 선택 핸들러
    const handleVehicleTypeSelect = (type) => {
        setVehicleType(type);
    };


    // 전체 입력 항목 체크
    useEffect(() => {
        // 필수 입력 항목들이 모두 채워졌는지 확인
        // purchaseAmount: 매입금액
        // purchaseDate: 매입일자
        // brokerageAmount: 중개수수료
        // brokerageDate: 중개일자
        // acquisitionTax: 취득세
        // vehicleName: 차량명
        // vehicleNumberAfter: 차량번호(이전)
        // vehicleNumberBefore: 차량번호(현재)      - 미지정
        // customerName: 고객명                    - 미지정
        // evdcCd: 증빙코드
        // phoneNumber: 연락처                     - 미지정
        // emailId: 이메일 아이디                   - 미지정
        // emailDomain: 이메일 도메인               - 미지정
        // address: 주소                           - 미지정
        // addressDetail: 상세주소                  - 미지정
        const allFieldsFilled = 
            purchaseAmount &&
            purchaseDate &&
            brokerageAmount &&
            brokerageDate &&
            acquisitionTax &&
            vehicleName &&
            vehicleNumberAfter &&
            //vehicleNumberBefore &&
            //customerName &&
            evdcCd 
            //phoneNumber &&
            //emailId &&
            //emailDomain &&
            //address &&
            //addressDetail
            ;
        
        setAllinputCheck(allFieldsFilled);
    }, [purchaseAmount, purchaseDate, brokerageAmount, brokerageDate, acquisitionTax,
        vehicleName, vehicleNumberAfter, vehicleNumberBefore, customerName, evdcCd,
        phoneNumber, emailId, emailDomain, address, addressDetail, attachedFiles]);

          // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const formData = new FormData(e.target);

        const formValues = {
        purchaseAmount: formData.get('purchaseAmount'),
        purchaseDate: formData.get('purchaseDate'),
        brokerageAmount: formData.get('brokerageAmount'),
        brokerageDate: formData.get('brokerageDate'),
        acquisitionTax: formData.get('acquisitionTax'),
        vehicleName: formData.get('vehicleName'),
        vehicleNumberAfter: formData.get('vehicleNumberAfter'),
        vehicleNumberBefore: formData.get('vehicleNumberBefore'),
        customerName: formData.get('customerName'),
        evdcCd: formData.get('evdcCd'),
        phoneNumber: formData.get('phoneNumber'),
        emailId: formData.get('emailId'),
        emailDomain: formData.get('emailDomain'),
        address: formData.get('address'),
        addressDetail: formData.get('addressDetail'),
        attachedFiles: formData.get('attachedFiles')
        };

        console.log(formValues);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insertSuggest`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formValues)
            });
            const res = await response.json();
            
            alert('신청 승인 되었습니다.'); // 테스트용 알림
            setLoading(false);
            return { success: true, res, error: null };
         } catch (error) {
            setError(error.message);
            alert('신청 승인 등록 중 오류가 발생했습니다.'); // 테스트용 알림
            setLoading(false);
            return { success: false, res: [], error: error.message };
         }

    };
    return (
        <main className="container container--page">
        <div className="container__head">
          <h2 className="container__title">매입차량 등록</h2>

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
                          name="radiogroup01" 
                          checked={presentationType === '상사매입'}
                          onChange={() => setPresentationType('상사매입')}
                        />
                        <span className="form-option__title">상사매입</span>
                      </label>
                    </div>
                    <div className="form-option">
                      <label className="form-option__label">
                        <input 
                          type="radio" 
                          name="radiogroup01"
                          checked={presentationType === '고객위탁'}
                          onChange={() => setPresentationType('고객위탁')}
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
                      name="dealer" 
                      value={selectedDealer || ''} 
                    />
                    <button 
                      className="select__toggle" 
                      type="button"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                    >
                      <span className="select__text">
                        {selectedDealer ? dealerList.find(d => d.dealerCd === selectedDealer)?.USR_NM || '선택' : '선택'}
                      </span>
                      <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                    </button>

                    <ul className="select__menu" style={{ display: isSelectOpen ? 'block' : 'none' }}>
                      <li 
                        key="default-dealer"
                        className={`select__option ${!selectedDealer ? 'select__option--selected' : ''}`}
                        data-value=""
                        onClick={() => {
                          handleDealerSelect('');
                          setIsSelectOpen(false);
                        }}
                      >선택</li>
                      {dealerList && dealerList.map((dealer) => (
                        <li 
                          key={`dealer-${dealer.USR_ID}`}
                          className={`select__option ${selectedDealer === dealer.dealerCd ? 'select__option--selected' : ''}`}
                          data-value={dealer.dealerCd}
                          onClick={() => {
                            handleDealerSelect(dealer.dealerCd);
                            setIsSelectOpen(false);
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
                        value={purchaseAmount}
                        onChange={(e) => handleNumberInput(e.target.value, setPurchaseAmount)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => setPurchaseAmount('0')}
                        >삭제</button>
                      </div>
                    </div>
                    <span className="input-help">1,000,000 / 100,000</span>
                  </div>
                </td>
              </tr>
              <tr>

                <th>매입일</th>
                <td>
                  <div className="input-group">
                    <div className="input w200">
                      <input 
                        type="text" 
                        className="jsStartDate input__field input__field--date" 
                        placeholder="매입일" 
                        value={purchaseDate}
                        onChange={(e) => handleDateInput(e.target.value, setPurchaseDate)}
                        autoComplete="off" 
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
                        value={brokerageAmount}
                        onChange={(e) => handleNumberInput(e.target.value, setBrokerageAmount)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => setBrokerageAmount('0')}
                        >삭제</button>
                      </div>
                    </div>

                    <div className="input w200">
                      <input 
                        type="text" 
                        className="jsStartDate input__field input__field--date" 
                        placeholder="상사매입비 입금일" 
                        value={brokerageDate}
                        onChange={(e) => handleDateInput(e.target.value, setBrokerageDate)}
                        autoComplete="off" 
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
                      value={acquisitionTax} 
                      onChange={(e) => setAcquisitionTax(e.target.value)}
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
                        name="dealer" 
                        value={vehicleType} 
                      />
                      <button className="select__toggle" type="button">
                        <span className="select__text">승용</span>
                        <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                      </button>
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="승용">승용</li>
                        <li className="select__option" data-value="daum.net">승합</li>
                        <li className="select__option" data-value="naver.com">경차</li>
                        <li className="select__option" data-value="naver.com">화물</li>
                        <li className="select__option" data-value="nate.com">특수</li>
                      </ul>
                    </div>

                    <div className="input w300">
                      <input type="text" className="input__field" placeholder="차량명" value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>

                  </div>
                </td>
                <th>차량번호(매입후)</th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="차량번호(매입후)" value={vehicleNumberAfter} onChange={(e) => setVehicleNumberAfter(e.target.value)} />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                </td>
                <th>차량번호(매입전)</th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="차량번호(매입전)" value={vehicleNumberBefore} onChange={(e) => setVehicleNumberBefore(e.target.value)} />
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
                      <input type="text" className="input__field" placeholder="고객명 " value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
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
                    <input className="select__input" type="hidden" name="customerType" value={customerType} />
                    <button className="select__toggle" type="button">
                      <span className="select__text">{customerType}</span>
                      <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                    </button>

                    <ul className="select__menu">
                      <li className={`select__option ${customerType === '개인' ? 'select__option--selected' : ''}`} 
                          data-value="개인" 
                          onClick={() => handleCustomerTypeChange('개인')}>개인</li>
                      <li className={`select__option ${customerType === '법인' ? 'select__option--selected' : ''}`} 
                          data-value="법인" 
                          onClick={() => handleCustomerTypeChange('법인')}>법인</li>
                    </ul>
                  </div>
                </td>
                <th>증빙종류</th>
                <td>
                  <div className="select">
                    <input 
                      className="select__input" 
                      type="hidden" 
                      name="dealer" 
                      value={evdcCd || ''}
                      onChange={(e) => setEvdcCd(e.target.value)}
                    />
                    <button className="select__toggle" type="button">
                      <span className="select__text">선택</span>
                      <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                    </button>

                    <ul className="select__menu">
                      <li 
                        key="default" 
                        className="select__option select__option--selected" 
                        data-value="">
                        선택
                      </li>
                      {validEvdcList.map((item, index) => {
                        // CD_ID나 CD_NM이 없는 항목은 건너뛰기
                        // if (!item.CD_ID || !item.CD_NM) return null;
                        
                        return (
                          <li 
                            key={`evdc-${item.CD_ID}-${index}`}
                            className="select__option"
                            data-value={item.CD_NM}>
                            {item.CD_NM}
                          </li>
                        );
                      })}
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
          <button className="btn btn--light" type="button" onClick={() => { window.location.href = 'm1.jsp'; }}>취소</button>
          <button className="btn btn--primary" type="submit" disabled={!allinputCheck}>확인</button>
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
                    <input type="text" className="input__field" placeholder="관인계약서번호" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                </td>
                <th>이전일</th>
                <td>
                  <div className="input-group">
                    <div className="input w200">
                      <input type="text" className="jsStartDate input__field input__field--date" placeholder="이전일" autoComplete="off" />
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
                      className={`input__field ${validationErrors.residentNumber ? 'input__field--error' : ''}`}
                      placeholder={customerType === '개인' ? '주민등록번호 (- 없이 입력)' : '법인등록번호 (- 없이 입력)'} 
                      value={residentNumber}
                      onChange={handleResidentNumberChange}
                    />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete" onClick={() => {
                        setResidentNumber('');
                        setValidationErrors(prev => ({...prev, residentNumber: ''}));
                      }}>삭제</button>
                    </div>
                  </div>
                  {validationErrors.residentNumber && (
                    <div className="input-error-message" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
                      {validationErrors.residentNumber}
                    </div>
                  )}
                </td>
                <th>연락처</th>
                <td>
                  <div className="input w200">
                    <input type="text" className="input__field" placeholder="- 없이 입력" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
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
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => setEmailId('')}
                        >삭제</button>
                      </div>
                    </div>
                    <span className="input-group__dash">@</span>
                    <div className="select w140">
                      <input 
                        className="select__input" 
                        type="hidden" 
                        name="emailDomain" 
                        value={emailDomain}
                      />
                      <button className="select__toggle" type="button">
                        <span className="select__text">{emailDomain}</span>
                        <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                      </button>
                      <ul className="select__menu">
                        <li 
                          className={`select__option ${emailDomain === 'naver.com' ? 'select__option--selected' : ''}`}
                          data-value="naver.com"
                          onClick={() => setEmailDomain('naver.com')}
                        >naver.com</li>
                        <li 
                          className={`select__option ${emailDomain === 'daum.net' ? 'select__option--selected' : ''}`}
                          data-value="daum.net"
                          onClick={() => setEmailDomain('daum.net')}
                        >daum.net</li>
                        <li 
                          className={`select__option ${emailDomain === 'gmail.com' ? 'select__option--selected' : ''}`}
                          data-value="gmail.com"
                          onClick={() => setEmailDomain('gmail.com')}
                        >gmail.com</li>
                        <li 
                          className={`select__option ${emailDomain === 'nate.com' ? 'select__option--selected' : ''}`}
                          data-value="nate.com"
                          onClick={() => setEmailDomain('nate.com')}
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
                      <input 
                        type="text" 
                        className="input__field" 
                        placeholder="검색 버튼을 눌러주세요" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        readOnly
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => setAddress('')}
                        >삭제</button>
                      </div>
                    </div>
                    <button className="btn btn--dark" type="button">주소 검색</button>
                    <div className="input w400">
                      <input 
                        type="text" 
                        className="input__field" 
                        placeholder="상세 주소" 
                        value={addressDetail}
                        onChange={(e) => setAddressDetail(e.target.value)}
                      />
                      <div className="input__utils">
                        <button 
                          type="button" 
                          className="jsInputClear input__clear ico ico--input-delete"
                          onClick={() => setAddressDetail('')}
                        >삭제</button>
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
                      className={`input__field ${validationErrors.businessNumber ? 'input__field--error' : ''}`}
                      placeholder="사업자등록번호 (- 없이 입력)" 
                      value={businessNumber}
                      onChange={handleBusinessNumberChange}
                    />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete" onClick={() => {
                        setBusinessNumber('');
                        setValidationErrors(prev => ({...prev, businessNumber: ''}));
                      }}>삭제</button>
                    </div>
                  </div>
                  {validationErrors.businessNumber && (
                    <div className="input-error-message" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
                      {validationErrors.businessNumber}
                    </div>
                  )}
                </td>

                <th>매입(세금)계산서</th>
                <td>
                  <div className="select">
                    <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">선택</span>
                      <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                    </button>

                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="value1">선택</li>
                      <li className="select__option" data-value="">해당없음</li>
                      <li className="select__option" data-value="Y">수취</li>
                      <li className="select__option" data-value="N">미수취</li>
                    </ul>
                  </div>
                </td>
                <th>계산서발행일</th>
                <td>
                  <div className="input-group">
                    <div className="input w200">
                      <input type="text" className="jsStartDate input__field input__field--date" placeholder="발행일" autoComplete="off" />
                    </div>
                    <span className="input-help">계산서 발행일 및 계약서 계약일</span>
                  </div>
                </td>
              </tr>

              <tr>
                <th>사실확인서</th>
                <td>
                  <div className="select">
                    <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">선택</span>
                      <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                    </button>

                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="value1">선택</li>
                      <li className="select__option" data-value="value2">해당없음</li>
                      <li className="select__option" data-value="value3">수취</li>
                      <li className="select__option" data-value="value3">미수취</li>
                    </ul>
                  </div>
                </td>
                <th>특이사항</th>
                <td colSpan={3}>
                  <div className="input">
                    <textarea className="input__field" placeholder="내용 입력"></textarea>
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
                  <div className="input-group">
                    <div className="input w440">
                      {attachedFiles.map((file) => (
                        <div key={file.id} className="input-file-row">
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
                                const newFiles = attachedFiles.filter(f => f.id !== file.id);
                                setAttachedFiles(newFiles);
                              }}
                            >삭제</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="input-group">
                    <input
                      type="file"
                      id="fileInput"
                      style={{display: 'none'}}
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          const file = e.target.files[0];
                          const newFile = {
                            id: attachedFiles.length + 1,
                            name: file.name
                          };
                          setAttachedFiles([...attachedFiles, newFile]);
                          e.target.value = ''; // Reset file input
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      className="btn btn--sm btn--light"
                      onClick={() => {
                        document.getElementById('fileInput').click();
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
                      name="dealer" 
                      value="선택" 
                    />
                      <button className="select__toggle" type="button">
                        <span className="select__text">선택</span>
                        <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                      </button>
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="선택">선택</li>
                        <li className="select__option" data-value="daum.net">주차위치코드1</li>
                        <li className="select__option" data-value="daum.net">주차위치코드2</li>
                      </ul>
                    </div>

                    <div className="input w800">
                      <input type="text" className="input__field" placeholder="주차위치" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>

                  </div>
                </td>
                <th>Key번호</th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="Key번호" />
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