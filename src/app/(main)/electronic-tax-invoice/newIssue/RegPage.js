"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import CustSearchModal from "@/components/modal/CustSearchModal";
import { isValidResidentNumber, checkBizID, isValidCorporateNumber } from '@/lib/util.js'
import { openPostcodeSearch } from '@/components/modal/AddressModal'
import { getAcqTax } from '@/app/(main)/common/script.js'
export default function ElectronicTaxInvoiceNewIssuePage({
  session, 
  dealerList = [], 
  carKndList = [], 
  evdcCdList = [], 
  parkingLocationList = [], 
  sellTpList = [],
  carPurInfo = [],
  searchAction
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [carPurDetail, setCarPurDetail] = useState(carPurInfo);

  const [custNo, setCustNo] = useState('');
  const [brno, setBrno] = useState('');
  const [subBrno, setSubBrno] = useState('');
  const [corpNm, setCorpNm] = useState('');
  const [custNm, setCustNm] = useState('');
  const [addr, setAddr] = useState('');
  const [bizType, setBizType] = useState('');
  const [bizItem, setBizItem] = useState('');
  const [email, setEmail] = useState('');
  const [writeDt, setWriteDt] = useState('');
  const [memo, setMemo] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [supplyPrice, setSupplyPrice] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [itemList, setItemList] = useState([]);
  const [taxIssueType, setTaxIssueType] = useState('001');
  const [isTaxIssueTypeOpen, setIsTaxIssueTypeOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [isCustModalOpen, setIsCustModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);


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


  const handleTaxIssueSubmit = async () => {
    console.log('handleTaxIssueSubmit');

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

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">전자세금계산서 발행</h2>

        <div className="guidebox">
          <p className="guidebox__title">
            건별 발행이 가능합니다.
          </p>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">기본 정보</h2>
          <button
            className="btn btn--dark btn--padding--r20"
            type="button"
            id="openBtn"
            onClick={handleCustSearchClick}
          >
            <span className="ico ico--add"></span>고객검색
            <input
              className="select__input"
              type="hidden"
              name="custNo"
              value={custNo || ''}
              disabled
            />
          </button>
        </div>
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
                사업자등록번호 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                <input 
                    type="text" 
                    className="input__field" 
                    placeholder="사업자등록번호"
                    name="brno"
                    value={brno}
                    onChange={(e) => setBrno(e.target.value)}
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
                종사업장번호 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="종사업장번호"
                    name="subBrno"
                    value={subBrno}
                    onChange={(e) => setSubBrno(e.target.value)}
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
                상호명 <span className="text-red">*</span>
              </th>
              <td>
              <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="상호명"
                    name="corpNm"
                    value={corpNm}
                    onChange={(e) => setCorpNm(e.target.value)}
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
              <th>
                성명 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                <input 
                      type="text" 
                      className="input__field" 
                      placeholder="성명" 
                      name="custNm"
                      value={custNm}
                      onChange={(e) => setCustNm(e.target.value)}
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
                주소 <span className="text-red">*</span>
              </th>
              <td colSpan="3">
                <div className="input">
                <input 
                    type="text" 
                    className="input__field" 
                    placeholder="주소" 
                    name="addr"
                    value={addr}
                    onChange={(e) => setAddr(e.target.value)}
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
              <th>업태</th>
              <td>
                <div className="input">
                <input 
                    type="text" 
                    className="input__field" 
                    placeholder="업태" 
                    name="bizType"
                    value={bizType}
                    onChange={(e) => setBizType(e.target.value)}
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
              <th>종목</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="종목" 
                    name="bizItem"
                    value={bizItem}
                    onChange={(e) => setBizItem(e.target.value)}
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
              <th>이메일</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="이메일" 
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

          </tbody>
        </table>
      </div>


      {/* 발행 정보 e */}

      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">발행 정보</h2>
        </div>
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
                작성일자 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                <input 
                    type="text" 
                    className="input__field" 
                    placeholder="작성일자"
                    name="writeDt"
                    value={writeDt}
                    onChange={(e) => setWriteDt(e.target.value)}
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
                비고 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="비고"
                    name="memo"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
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
                구분 <span className="text-red">*</span>
              </th>
              <td>
                <div className="select">
                  <input 
                    className="select__input" 
                    type="hidden" 
                    name="taxIssueType" 
                    value={taxIssueType || '001'} 
                  />
                  <button 
                    className="select__toggle" 
                    type="button"
                    onClick={() => setIsTaxIssueTypeOpen(!isTaxIssueTypeOpen)}
                  >
                    <span className="select__text">
                      {taxIssueType === '001' ? '청구' : '영수'}
                    </span>
                    <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                  </button>

                  <ul className={`select__menu ${isTaxIssueTypeOpen ? 'active' : ''}`}>
                    <li 
                      className={`select__option ${taxIssueType === '001' ? 'select__option--selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTaxIssueType('001');
                      }}
                    >
                      청구
                    </li>
                    <li 
                      className={`select__option ${taxIssueType === '002' ? 'select__option--selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTaxIssueType('002');
                      }}
                    >
                      영수
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                합계금액 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                  <span className="input__field">{totalAmount.toLocaleString()}원</span>
                </div>
              </td>
              <th>
                공급가액액 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                  <span className="input__field">{supplyPrice.toLocaleString()}원</span>
                </div>
              </td>
              <th>
                부가세 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                  <span className="input__field">{vatAmount.toLocaleString()}원</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 세금계산서 항목 정보 s */}
      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">품목리스트</h2>
          <button 
            className="btn btn--dark btn--padding--r20" 
            type="button" 
            id="btnClone"
            onClick={handleAddBuyerCustomer}
          >
            <span className="ico ico--add"></span>품목 추가
          </button>
        </div>
        <table className="table table--xl" id="myTable">
          <colgroup>
            <col style={{ width: "80px" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "250px" }} />
            <col style={{ width: "250px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "50px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>월</th>
              <th>일</th>
              <th>품목</th>
              <th>규격</th>
              <th>수량</th>
              <th>단가</th>
              <th>공급가액</th>
              <th>부가세</th>
              <th>비고</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {(itemList.length === 0
              ? [{ id: 0, month: '', day: '', itemName: '', itemSpec: '', qty: '', price: '', total: '', supplyPrice: '', vat: '', note: '' }]
              : itemList
            ).map((item, index) => (
              <tr key={item.id}>
                <td>
                  <div className="input-with-search">
                    <div className="input">
                      <input 
                        type="text" 
                        className="input__field" 
                        placeholder="월"
                        value={item.month}
                        onChange={(e) => handleUpdateItem(item.id, 'month', e.target.value)}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="일"
                      value={item.day}
                      onChange={(e) => handleUpdateItem(item.id, 'day', e.target.value)}
                    />
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="품목"
                      value={item.itemName}
                      onChange={(e) => handleUpdateItem(item.id, 'itemName', e.target.value)}
                    />
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="규격"
                      value={item.itemSpec}
                      onChange={(e) => handleUpdateItem(item.id, 'itemSpec', e.target.value)}
                    />
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="수량"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                    />
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="단가"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(item.id, 'unitPrice', e.target.value)}
                    />
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="공급가액"
                      value={item.supplyPrice}
                      onChange={(e) => handleUpdateItem(item.id, 'supplyPrice', e.target.value)}
                    />
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="부가세"
                      value={item.vatAmount}
                      onChange={(e) => handleUpdateItem(item.id, 'vatAmount', e.target.value)}
                    />
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input 
                      type="text" 
                      className="input__field" 
                      placeholder="비고"
                      value={item.memo}
                      onChange={(e) => handleUpdateItem(item.id, 'memo', e.target.value)}
                    />
                  </div>
                </td>
                <td>
                  <button 
                    type="button" 
                    className="btn btn--ico"
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={itemList.length === 1}
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
        <button className="btn btn--primary" type="button" onClick={handleTaxIssueSubmit}>
          확인
        </button>
      </div>

      <CustSearchModal 
        open={isCustModalOpen} 
        onClose={handleCustModalClose} 
        onCarSelect={handleCustomerSelect}
        agentId={session}
      />
    </main>
  );
}
