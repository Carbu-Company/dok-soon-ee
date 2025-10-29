"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Pagination from "@/components/ui/pagination";



/**
 * 리스트 항목 변경하기. 2025.10.28
 * 선택 매출일	차량명	차량번호	해당딜러	매출항목	거래금액	주문자명	연락처	거래유형	식별번호	제외처리	발행하기
 */

// ===== 상수 정의 =====
const TRANSACTION_TYPE = {
  INCOME_DEDUCTION: '01',  // 소득공제용
  EXPENSE_PROOF: '02'       // 지출증빙용
};

const ISSUANCE_TYPE = {
  VOLUNTARY: '01',          // 자진발급
  REGULAR: '02'             // 일반발급
};

export default function CashReceiptRegisterPage({
  session, 
  dealerList = [], 
  saleItemList = [], 
  crStatList = [],
  crTypeList = [],
  crTradeTypeList = [],
  carList = [],
  pagination = {},
  searchAction
}) {

  const router = useRouter();

  // ===== 발행대기 목록 상태 =====
  const [pendingList, setPendingList] = useState(carList || []);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(pagination?.totalPages || 1);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);

  // ===== 검색 상태 =====
  const [carNo, setCarNo] = useState("");
  const [selectedDealer, setSelectedDealer] = useState("");
  const [isDealerSelectOpen, setIsDealerSelectOpen] = useState(false);
  const [dtGubun, setDtGubun] = useState("");
  const [isDtGubunSelectOpen, setIsDtGubunSelectOpen] = useState(false);
  const [startDt, setStartDt] = useState("");
  const [endDt, setEndDt] = useState("");

  // ===== 발행 정보 상태 =====
  const [transactionType, setTransactionType] = useState(TRANSACTION_TYPE.INCOME_DEDUCTION);
  const [issuanceType, setIssuanceType] = useState(ISSUANCE_TYPE.VOLUNTARY);

  // ===== UI 상태 =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showIssuanceForm, setShowIssuanceForm] = useState(false);

  // ===== 이벤트 핸들러 =====
  
  // 모든 토글을 닫는 함수
  const closeAllToggles = () => {
    setIsDealerSelectOpen(false);
    setIsDtGubunSelectOpen(false);
  };

  // 외부 클릭 및 ESC 키 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isToggleButton = event.target.closest('.select__toggle');
      const isMenuContent = event.target.closest('.select__menu');
      
      if (!isToggleButton && !isMenuContent) {
        closeAllToggles();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeAllToggles();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // 검색 파라미터
  const getDefaultParams = (pageNum = currentPage) => ({
    agentId: session?.agentId,
    page: pageNum,
    pageSize: pageSize,
  });

  const searchParams = {
    carNo: carNo,
    dealer: selectedDealer,
    dtGubun: dtGubun,
    startDt: startDt,
    endDt: endDt,
    orderItem: "01",
    ordAscDesc: "desc",
  };

  // 검색 핸들러
  const handleSearch = async (pageNum = 1) => {
    try {
      setLoading(true);

      if (typeof searchAction === "function") {
        const searchParamsWithPage = {
          ...getDefaultParams(pageNum),
          ...searchParams,
        };

        const result = await searchAction(searchParamsWithPage);

        if (result && result.success) {
          const responseData = result.data?.list?.carlist || [];
          const paginationInfo = result.data?.list?.pagination || {};

          setPendingList(responseData);
          setTotalPages(paginationInfo.totalPages || 1);
          setCurrentPage(paginationInfo.currentPage || pageNum);
        } else {
          alert("검색 중 오류가 발생했습니다: " + (result?.error || "unknown"));
        }
      } else {
        console.error("searchAction이 없습니다.");
      }
    } catch (error) {
      console.error("검색 에러:", error);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = async (page) => {
    await handleSearch(page);
  };

  // 아이템 선택/해제 핸들러
  const handleItemSelect = (item, index) => {
    setSelectedItems(prev => {
      // 인덱스로만 비교하여 다중 선택 가능하도록 수정
      const isSelected = prev.some(selected => selected.index === index);
      
      if (isSelected) {
        // 선택 해제
        return prev.filter(selected => selected.index !== index);
      } else {
        // 선택 추가
        const itemId = `${index}_${item.CAR_REG_ID || item.NTS_CONF_NO || index}`;
        return [...prev, { ...item, index, itemId }];
      }
    });
  };

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (selectedItems.length === pendingList.length) {
      setSelectedItems([]);
    } else {
      const allItems = pendingList.map((item, index) => ({ 
        ...item, 
        index, 
        itemId: `${index}_${item.CAR_REG_ID || item.NTS_CONF_NO || index}` 
      }));
      setSelectedItems(allItems);
    }
  };

  // 선택된 아이템들의 총 금액 계산
  const getTotalAmount = () => {
    return selectedItems.reduce((total, item) => {
      return total + (Number(item.TRADE_AMT) || 0);
    }, 0);
  };

  // 선택된 아이템들의 공급가액 계산
  const getTotalSupplyPrice = () => {
    return selectedItems.reduce((total, item) => {
      const amount = Number(item.TRADE_AMT) || 0;
      return total + Math.floor(amount / 1.1);
    }, 0);
  };

  // 선택된 아이템들의 부가세 계산
  const getTotalVatAmount = () => {
    return selectedItems.reduce((total, item) => {
      const amount = Number(item.TRADE_AMT) || 0;
      const supplyPrice = Math.floor(amount / 1.1);
      return total + (amount - supplyPrice);
    }, 0);
  };

  // 발행 처리 핸들러
  const handleIssuance = async () => {
    if (selectedItems.length === 0) {
      alert('발행할 항목을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const issuanceData = {
        transactionType: transactionType,
        issuanceType: issuanceType,
        selectedItems: selectedItems,
        usrId: session?.usrId,
        agentId: session?.agentId,
      };

      // 개별 현금영수증 발행 처리
      const issuancePromises = selectedItems.map(async (item) => {
        try {
          const itemData = {
            ...issuanceData,
            costSeq: item.COST_SEQ || item.CAR_REG_ID,
            tradeAmt: item.TRADE_AMT,
            custNm: item.CUST_NM,
            rcgnNo: item.RCGN_NO,
            carNo: item.CAR_NO,
            dlrNm: item.DLR_NM,
          };

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cashReceiptIssuance`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData)
          });
          
          const res = await response.json();
          return res;
        } catch (error) {
          console.error(`현금영수증 발행 오류 (${item.CAR_NO}):`, error);
          return { success: false, error: error.message };
        }
      });

      const results = await Promise.all(issuancePromises);
      const successCount = results.filter(result => result.success).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        alert(`${successCount}건의 현금영수증이 성공적으로 발행되었습니다.${failCount > 0 ? ` (실패: ${failCount}건)` : ''}`);
        setSelectedItems([]);
        handleSearch(currentPage); // 목록 새로고침
      } else {
        throw new Error('모든 현금영수증 발행에 실패했습니다');
      }
    } catch (error) {
      setError(error.message);
      alert('현금영수증 발행 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">현금영수증 발행</h2>

        <div className="guidebox">
          <p className="guidebox__title">
            발행대기 목록에서 선택하여 현금영수증을 발행할 수 있습니다.
          </p>
          <p className="guidebox__title">
            복수 선택하여 한번에 발행이 가능합니다.
          </p>
          <p className="guidebox__title">
            연말정산시 소득공제를 위해 발행합니다.
          </p>
        </div>
      </div>

      {/* 검색 영역 */}
      <div className="table-wrap">
        <h2 className="table-wrap__title">검색</h2>
        <table className="table table--lg">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            <tr>
              <th>차량번호</th>
              <td>
                <div className="input">
                  <input 
                    type="text" 
                    className="input__field" 
                    placeholder=""
                    value={carNo}
                    onChange={(e) => setCarNo(e.target.value)}
                  />
                  <div className="input__utils">
                    <button 
                      type="button" 
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => setCarNo("")}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </td>
              <th>담당딜러</th>
              <td>
                <div className="select">
                  <input
                    className="select__input"
                    type="hidden"
                    name="dealer"
                    defaultValue=""
                  />
                  <button
                    className="select__toggle"
                    type="button"
                    onClick={() => {
                      closeAllToggles();
                      setIsDealerSelectOpen(!isDealerSelectOpen);
                    }}
                  >
                    <span className="select__text">
                      {selectedDealer
                        ? dealerList.find(d => d.USR_ID === selectedDealer)?.USR_NM || ""
                        : ""}
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
                    style={{ display: isDealerSelectOpen ? "block" : "none" }}
                  >
                    <li
                      className={`select__option ${!selectedDealer ? "select__option--selected" : ""}`}
                      onClick={() => {
                        setSelectedDealer("");
                        setIsDealerSelectOpen(false);
                      }}
                    >
                      선택
                    </li>
                    {dealerList.map((dealer, index) => (
                      <li
                        key={index}
                        className={`select__option ${selectedDealer === dealer.USR_ID ? "select__option--selected" : ""}`}
                        data-value={dealer.USR_ID}
                        onClick={() => {
                          setSelectedDealer(dealer.USR_ID);
                          setIsDealerSelectOpen(false);
                        }}
                      >
                        {dealer.USR_NM}
                      </li>
                    ))}
                  </ul>
                </div>
              </td>
              <th>검색기간</th>
              <td>
                <div className="input-group">
                  <div className="select w140">
                    <input
                      className="select__input"
                      type="hidden"
                      name="dealer"
                      defaultValue="거래(발행)일"
                    />
                    <button
                      className="select__toggle"
                      type="button"
                      onClick={() => {
                        closeAllToggles();
                        setIsDtGubunSelectOpen(!isDtGubunSelectOpen);
                      }}
                    >
                      <span className="select__text">
                        {dtGubun === "01"
                          ? "매도(판매)일"
                          : dtGubun === "02"
                            ? "제시(매입)일" 
                            : "거래(발행)일"}
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
                      style={{ display: isDtGubunSelectOpen ? "block" : "none" }}
                    >
                      <li
                        className={`select__option ${dtGubun === "01" || !dtGubun ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("01");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        거래(발행)일
                      </li>
                      <li
                        className={`select__option ${dtGubun === "02" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("02");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        매도(판매)일
                      </li>
                      <li
                        className={`select__option ${dtGubun === "03" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("03");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        제시(매입)일
                      </li>
                    </ul>
                  </div>

                  <div className="input w140">
                    <input 
                      type="date" 
                      className="input__field" 
                      placeholder="시작일" 
                      autoComplete="off"
                      onChange={(e) => setStartDt(e.target.value)}
                      value={startDt || ''} 
                    />
                  </div>
                  <span className="input-group__dash">-</span>
                  <div className="input w140">
                    <input
                      type="date"
                      className="input__field"
                      placeholder="종료일"
                      autoComplete="off"
                      onChange={e => setEndDt(e.target.value)}
                      value={endDt || ''} 
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn--type03"
                    onClick={() => handleSearch(1)}
                    disabled={loading}
                  >
                    <span className="ico ico--search"></span>검색
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 발행대기 목록 */}
      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">
            발행대상 목록<span>Total {pagination?.totalCount || pendingList?.length || 0}건</span>
          </h2>
          <div className="input-group">
            <button
              type="button"
              className="btn btn--white"
              onClick={handleSelectAll}
            >
              {selectedItems.length === pendingList.length ? '전체해제' : '전체선택'}
              {pendingList.length > 0 && ` (${selectedItems.length}/${pendingList.length})`}
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setShowIssuanceForm(!showIssuanceForm)}
              disabled={selectedItems.length === 0}
            >
              <span className="ico ico--add"></span>선택발행 ({selectedItems.length}건)
            </button>
          </div>
        </div>

        <table className="table">
          <colgroup>
            <col style={{ width: "80px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "200px" }} />
            <col style={{ width: "300px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "320px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "80px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>선택</th>
              <th>문서</th>
              <th>거래일시</th>
              <th>국세청승인번호</th>
              <th>거래구분</th>
              <th>식별번호</th>
              <th>고객명</th>
              <th>담당딜러</th>
              <th>품명</th>
              <th>거래금액</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {pendingList.map((item, index) => {
              const isSelected = selectedItems.some(selected => selected.index === index);
              return (
                <tr key={index} className={isSelected ? 'table__row--selected' : ''}>
                  <td>
                    <div className="form-option form-option--icon">
                      <label className="form-option__label">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleItemSelect(item, index)}
                          className="form-option__checkbox--round"
                        />
                        <span className="form-option__title">선택</span>
                      </label>
                    </div>
                  </td>
                  <td>{item.TRADE_SCT_NM}</td>
                  <td>{item.TRADE_DT}</td>
                  <td>{item.NTS_CONF_NO}</td>
                  <td>{item.TRADE_TP_NM}</td>
                  <td>{item.RCGN_NO}</td>
                  <td>{item.CUST_NM}</td>
                  <td>{item.DLR_NM}</td>
                  <td>{item.CAR_NM} {item.CAR_NO}</td>
                  <td>{item.TRADE_AMT}</td>
                  <td>{item.CR_TRNS_STAT_NM}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* 발행 정보 폼 */}
      {showIssuanceForm && (
        <div className="table-wrap">
          <h2 className="table-wrap__title">발행정보</h2>
          <table className="table table--lg">
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "auto" }} />
            </colgroup>
            <tbody>
              <tr>
                <th>
                  거래유형 <span className="text-red">*</span>
                </th>
                <td>
                  <div className="form-option-wrap">
                    <div className="form-option">
                      <label className="form-option__label">
                        <input 
                          type="radio" 
                          name="transactionType" 
                          value={TRANSACTION_TYPE.INCOME_DEDUCTION}
                          checked={transactionType === TRANSACTION_TYPE.INCOME_DEDUCTION}
                          onChange={(e) => setTransactionType(e.target.value)}
                        />
                        <span className="form-option__title">소득공제용</span>
                      </label>
                    </div>
                    <div className="form-option">
                      <label className="form-option__label">
                        <input 
                          type="radio" 
                          name="transactionType" 
                          value={TRANSACTION_TYPE.EXPENSE_PROOF}
                          checked={transactionType === TRANSACTION_TYPE.EXPENSE_PROOF}
                          onChange={(e) => setTransactionType(e.target.value)}
                        />
                        <span className="form-option__title">지출증빙용</span>
                      </label>
                    </div>
                  </div>
                  <div className="input-help">※ 연말정산시 소득공제를 위해 발행합니다.</div>
                </td>
              </tr>

              <tr>
                <th>
                  발급유형
                </th>
                <td>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input 
                        type="checkbox" 
                        name="issuanceType"
                        checked={issuanceType === ISSUANCE_TYPE.VOLUNTARY}
                        onChange={(e) => setIssuanceType(e.target.checked ? ISSUANCE_TYPE.VOLUNTARY : ISSUANCE_TYPE.REGULAR)}
                      />
                      <span className="form-option__title">자진발급</span>
                    </label>
                  </div>
                </td>
              </tr>

              <tr>
                <th>
                  선택된 건수
                </th>
                <td>
                  <div className="input-help">
                    총 {selectedItems.length}건 | 
                    거래금액: {getTotalAmount().toLocaleString()}원 | 
                    공급가액: {getTotalSupplyPrice().toLocaleString()}원 | 
                    부가세: {getTotalVatAmount().toLocaleString()}원
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="container__btns">
        <button
          className="btn btn--light"
          type="button"
          onClick={() => {
            router.push('/cash-receipts/list');
          }}
        >
          취소
        </button>
        <button 
          className="btn btn--primary" 
          type="button" 
          onClick={handleIssuance}
          disabled={loading || selectedItems.length === 0}
        >
          {loading ? '발행 중...' : `발행하기 (${selectedItems.length}건)`}
        </button>
      </div>
    </main>
  );
}
