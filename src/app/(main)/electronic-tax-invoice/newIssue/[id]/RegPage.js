"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import CustSearchModal from "@/components/modal/CustSearchModal";
import { isValidResidentNumber, checkBizID, isValidCorporateNumber } from '@/lib/util.js'
import { openPostcodeSearch } from '@/components/modal/AddressModal'
import { getAcqTax } from '@/app/(main)/common/script.js'
import { getMgtKey } from "@/app/(main)/api/search";
import { issueTaxInvoice } from "@/app/(main)/api/popbill";


/**
 * 전자세금계산서 발행 페이지
 * @param {Object} session - 세션 정보
 * @param {Object} taxIssueInfo - 세금계산서 발행 정보
 * @returns {JSX.Element} - 전자세금계산서 발행 페이지
 */

export default function ElectronicTaxInvoiceNewIssuePage({
  session, 
  taxIssueInfo = []
}) {


  /**
   * 파라미터 초기화
   */
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * 품목 리스트 상태 관리
   */
  const [itemList, setItemList] = useState(taxIssueInfo?.ITEM_LIST ?? []);

  /**
   * 기본 정보 및 발행정보 상태 관리
   */
  const [custNo, setCustNo] = useState(taxIssueInfo?.CUST_NO ?? '');
  const [brno, setBrno] = useState(taxIssueInfo?.BRNO ?? '');
  const [subBrno, setSubBrno] = useState(taxIssueInfo?.SUB_BRNO ?? '');
  const [corpNm, setCorpNm] = useState(taxIssueInfo?.CORP_NM ?? '');
  const [custNm, setCustNm] = useState(taxIssueInfo?.CUST_NM ?? '');
  const [addr, setAddr] = useState(taxIssueInfo?.ADDR ?? '');
  const [bizType, setBizType] = useState(taxIssueInfo?.BIZ_TYPE ?? '');
  const [bizItem, setBizItem] = useState(taxIssueInfo?.BIZ_ITEM ?? '');
  const [email, setEmail] = useState(taxIssueInfo?.EMAIL ?? '');
  const todayString = (() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();
  const [writeDt, setWriteDt] = useState(taxIssueInfo?.WRITE_DT ?? todayString);
  const [memo, setMemo] = useState(taxIssueInfo?.MEMO ?? '');
  const [totalAmount, setTotalAmount] = useState(taxIssueInfo?.TOTAL_AMOUNT ?? 0);
  const [supplyPrice, setSupplyPrice] = useState(taxIssueInfo?.SUPPLY_PRICE ?? 0);
  const [vatAmount, setVatAmount] = useState(taxIssueInfo?.VAT_AMOUNT ?? 0);

  const [taxIssueType, setTaxIssueType] = useState('001');
  const [isTaxIssueTypeOpen, setIsTaxIssueTypeOpen] = useState(false);

  /**
   * 고객 선택 모달 관리
   */
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [isCustModalOpen, setIsCustModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // 팝빌 연동 사용자 및 폼 데이터 상태 관리
  const [user, setUser] = useState(session);
  const [formData, setFormData] = useState({
    brno: brno,
    corpNm: corpNm,
    custNm: custNm,
    addr: addr,
    bizType: bizType,
    bizItem: bizItem,
    email: email,
    writeDt: writeDt,
    memo: memo,
    taxIssueType: taxIssueType,
    taxIssueTypeOpen: isTaxIssueTypeOpen,
    itemList: [],
    totalAmount: totalAmount,
    supplyPrice: supplyPrice,
    vatAmount: vatAmount,
    taxMgmtkey: '',
  });

  // 세금계산서 발행 대상 정보 상태 관리
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

    // 등록번호
    if(!brno) {
      alert('등록번호를 입력해주세요.');
      return;
    }

    // 상호명
    if(!corpNm) {
      alert('상호명을 입력해주세요.');
      return;
    }

    // 성명
    if(!custNm) {
      alert('성명을 입력해주세요.');
      return;
    }

    // 품목 리스트 체크 
    if(itemList.length === 0) {
      alert('품목을 추가해주세요.');
      return;
    }

    // 합계금액, 공급가액, 부가세 가 0이면 처리 안되게
    if(totalAmount === 0 || supplyPrice === 0 || vatAmount === 0) {
      alert('합계금액, 공급가액, 부가세 중 하나라도 0이면 발행 안됩니다.');
      return;
    }

    /**
     * 전자세금계산 팝빌 연동 성공시
     * 발행 정보 DB 적재 .
     * (세금계산서 발행 키 값 생성)
     */


    // 1. 세금계산서 발행 키값 생성
    const taxMgmtkey = await getMgtKey();
    console.log('세금계산서 발행 키값:', taxMgmtkey);  
    if(!taxMgmtkey) {
      alert('세금계산서 발행 키값 생성에 실패했습니다.');
      return;
    }


    // 2. 세금계산서 발행 (팝빌)
    const result = await issueTaxInvoice(user, formData);

    // 3. 발행 정보 DB 적재



    /**
     * 팝빌 발행 성공시
     * 발행 정보 DB 적재
     */


    //
    const formValues = {    
      brno: brno,
      corpNm: corpNm,
      custNm: custNm,
      addr: addr,
      bizType: bizType,
      bizItem: bizItem,
      email: email,
      writeDt: writeDt,
      memo: memo,
      taxIssueType: taxIssueType,
      taxIssueTypeOpen: isTaxIssueTypeOpen,
      itemList: JSON.stringify(itemList),
      totalAmount: totalAmount,
      supplyPrice: supplyPrice,
      vatAmount: vatAmount,
      taxMgmtKey: taxMgmtkey,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insertCarTax`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });
      const res = await response.json();
      
      alert('전자세금계산서 발행 되었습니다.'); // 테스트용 알림
      setLoading(false);
      if (res.success) {
        router.push('/electronic-tax-invoice/register');
        return { success: true, res, error: null };
      } else {
        throw new Error(res.message || '전자세금계산서 발행에 실패했습니다');
      }
    } catch (error) {
      setError(error.message);
      alert('전자세금계산서 발행 중 오류가 발생했습니다.'); // 테스트용 알림
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
                등록번호 <span className="text-red">*</span>
              </th>
              <td>
              <div className="input-group">
              <div className="input w400">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder="등록번호"
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
                  <button className="btn btn--dark" type="button">확인</button>
                  </div>
              </td>

              <th>
                종사업장번호 
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
                주소 
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
              <div className="input-group">
                  <div className="input w200">
                  <input 
                        type="date" 
                        className="input__field" 
                        placeholder="작성일자" 
                        autoComplete="off"
                        name='writeDt'
                        onChange={(e) => setWriteDt(e.target.value)}
                        value={writeDt || ''} 
                      />
                  </div>
                </div>
              </td>

              <th>
                비고 
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
                구분
              </th>
              <td>
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="taxIssueType" 
                        value="001"
                        checked={taxIssueType === "001"}
                        onChange={(e) => setTaxIssueType(e.target.value)}
                      />
                      <span className="form-option__title">청구</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="radio" 
                        name="taxIssueType" 
                        value="002"
                        checked={taxIssueType === "002"}
                        onChange={(e) => setTaxIssueType(e.target.value)}
                      />
                      <span className="form-option__title">영수</span>
                    </label>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                합계금액 
              </th>
              <td>
                <div className="input" style={{ textAlign: 'right' }}>
                  {totalAmount.toLocaleString()}
                </div>
              </td>
              <th>
                공급가액
              </th>
              <td>
                <div className="input" style={{ textAlign: 'right' }}>
                  {supplyPrice.toLocaleString()}
                </div>
              </td>
              <th>
                부가세 
              </th>
              <td>
                <div className="input" style={{ textAlign: 'right' }}>
                  {vatAmount.toLocaleString()}
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
            <col style={{ width: "200px" }} />
            <col style={{ width: "200px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "120px" }} />
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
