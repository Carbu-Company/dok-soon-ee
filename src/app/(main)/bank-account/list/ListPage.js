'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@/components/ui/pagination";
import SimpleTableDownloadButton from "@/components/utils/SimpleTableDownloadButton";
import Image from "next/image";

export default function BankCashLedgerPage(props) {



  console.log('tradeInItemCDList', props.tradeInItemCDList);
  console.log('tradeOutItemCDList', props.tradeOutItemCDList);

  const router = useRouter();

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 기본 검색 영역
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // props 값 가져오기
  const [loading, setLoading] = useState(false);

  // 초기 데이터: 서버에서 전달된 데이터 구조 처리
  const initialCarListData = props.carList?.data?.carlist || [];
  const initialPagination = props.carList?.data?.pagination || {};
  
  // Summary 데이터
  const initialCarAcctSummary = props.carSummary?.data || [];

  const [carList, setCarList] = useState(initialCarListData);
  const [pagination, setPagination] = useState(initialPagination);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages || 1);

  const [carAcctSummary, setCarAcctSummary] = useState(initialCarAcctSummary);

  const [dealerList, setDealerList] = useState(props.dealerList || []);
  const [saleItemList, setSaleItemList] = useState(props.saleItemList || []);
  const [crStatList, setCrStatList] = useState(props.crStatList || []);
  const [evdcCdList, setEvdcCdList] = useState(props.evdcCdList || []);
  const [tradeInItemList, setTradeInItemList] = useState(props.tradeInItemList || []);
  const [tradeOutItemList, setTradeOutItemList] = useState(props.tradeOutItemList || []);
  const [agentAcctList, setAgentAcctList] = useState(props.agentAcctList || []);
  
  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage || 1);
  const [pageSize, setPageSize] = useState(initialPagination.pageSize || 10);

  const searchAction = props.searchAction;

  // 차량번호
  const [carNo, setCarNo] = useState("");

  // 담당 딜러
  const [selectedDealer, setSelectedDealer] = useState("");
  const [isDealerSelectOpen, setIsDealerSelectOpen] = useState(false);

  // 검색 구분 항목
  const [dtGubun, setDtGubun] = useState("01");
  const [isDtGubunSelectOpen, setIsDtGubunSelectOpen] = useState(false);

  // 검색 기간
  const [startDt, setStartDt] = useState("");
  const [endDt, setEndDt] = useState("");

  // 매입취소/삭제 모달 관련 state
  const [isGoodsFeeCarRemoveModalOpen, setIsGoodsFeeCarRemoveModalOpen] = useState(false);
  const [selectedCarForRemove, setSelectedCarForRemove] = useState(null);
  const [selectedCarTypeForRemove, setSelectedCarTypeForRemove] = useState(null);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 페이지네이션 영역
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 페이지 정렬 순서 항목

  // 정렬순서 항목
  const [ordItem, setOrdItem] = useState("01");
  const [isOrdItemSelectOpen, setIsOrdItemSelectOpen] = useState(false);

  // 정렬순서
  const [ordAscDesc, setOrdAscDesc] = useState("desc");
  const [isOrdAscDescSelectOpen, setIsOrdAscDescSelectOpen] = useState(false);

  // 건수 - pageSize
  const [listCount, setListCount] = useState(10);
  const [isListCountSelectOpen, setIsListCountSelectOpen] = useState(false);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 상세 검색 영역
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 페이지 정렬 순서 항목

  // 정렬순서 항목
  const [ordItemDtl, setOrdItemDtl] = useState("01");
  useEffect(() => {
    setOrdItem(ordItemDtl);
  }, [ordItemDtl]);
  const [isOrdItemSelectOpenDtl, setIsOrdItemSelectOpenDtl] = useState(false);

  // 정렬순서
  const [ordAscDescDtl, setOrdAscDescDtl] = useState("desc");
  useEffect(() => {
    setOrdAscDesc(ordAscDescDtl);
  }, [ordAscDescDtl]);
    const [isOrdAscDescSelectOpenDtl, setIsOrdAscDescSelectOpenDtl] = useState(false);

  // 건수 - pageSize
  const [listCountDtl, setListCountDtl] = useState(10);
  useEffect(() => {
    setListCount(listCountDtl);
  }, [listCountDtl]);
  const [isListCountSelectOpenDtl, setIsListCountSelectOpenDtl] = useState(false);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 상세 검색 차량번호
  const [dtlCarNo, setDtlCarNo] = useState("");
  // 상세 검색 담당 딜러
  const [dtlDealer, setDtlDealer] = useState("");
  const [isDtlDealerSelectOpen, setIsDtlDealerSelectOpen] = useState(false);

  // 상세 검색 검색기간 구분
  const [dtlDtGubun, setDtlDtGubun] = useState("");
  const [isDtlDtGubunSelectOpen, setIsDtlDtGubunSelectOpen] = useState(false);

  // 상세 검색 검색기간
  const [dtlStartDt, setDtlStartDt] = useState("");
  const [dtlEndDt, setDtlEndDt] = useState("");

  // 상세 검색 차량명
  const [dtlCarNm, setDtlCarNm] = useState("");

  // 상세 검색 거래항목
  const [dtlTradeSctNm, setDtlTradeSctNm] = useState("00");
  const [isDtlTradeSctNmSelectOpen, setIsDtlTradeSctNmSelectOpen] = useState(false);

  // 상세 검색 거래항목
  const [isDtlTradeItemCdSelectOpen, setIsDtlTradeItemCdSelectOpen] = useState(false);
  const [dtlTradeItemCd, setDtlTradeItemCd] = useState("");

  // 상세 검색 계좌번호
  const [dtlAgentAcct, setDtlAgentAcct] = useState("");
  const [isDtlAgentAcctSelectOpen, setIsDtlAgentAcctSelectOpen] = useState(false);

  // 상세 검색 메모
  const [dtlTradeMemo, setDtlTradeMemo] = useState("");
  const [dtlDtlMemo, setDtlDtlMemo] = useState("");


  const [searchBtn, setSearchBtn] = useState(0);

  // 상세검색 영역 표시/숨김 상태
  const [isDetailSearchOpen, setIsDetailSearchOpen] = useState(false);

  
  // 모든 토글을 닫는 함수
  const closeAllToggles = () => {
    setIsDealerSelectOpen(false);
    setIsDtGubunSelectOpen(false);
    setIsOrdItemSelectOpen(false);
    setIsOrdAscDescSelectOpen(false);
    setIsListCountSelectOpen(false);
    setIsDtlDealerSelectOpen(false);
    setIsDtlDtGubunSelectOpen(false);
    setIsDtlAgentAcctSelectOpen(false);
    setIsDtlTradeItemCdSelectOpen(false);
    setIsDtlTradeSctNmSelectOpen(false);
    setIsOrdItemSelectOpenDtl(false);
    setIsOrdAscDescSelectOpenDtl(false);
    setIsListCountSelectOpenDtl(false);
  };

  // 외부 클릭 및 ESC 키 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 토글 버튼이나 메뉴 내부 클릭인지 확인
      const isToggleButton = event.target.closest('.select__toggle');
      const isMenuContent = event.target.closest('.select__menu');
      
      // 토글 버튼이나 메뉴 내부가 아닌 곳을 클릭했을 때만 토글 닫기
      if (!isToggleButton && !isMenuContent) {
        closeAllToggles();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeAllToggles();
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 검색 영역
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 기본 파라미터 (동적으로 생성)
  const getDefaultParams = (pageNum = currentPage, pageSize = listCount) => ({
    carAgent: props.session?.agentId,
    page: pageNum,
    pageSize: pageSize,
  });

  // 검색 파라미터
  const searchParams = {
    carNo: searchBtn === 1 ? carNo : dtlCarNo,
    dealer: searchBtn === 1 ? selectedDealer : dtlDealer,
    dtGubun: searchBtn === 1 ? dtGubun : dtlDtGubun,
    startDt: searchBtn === 1 ? startDt : dtlStartDt,
    endDt: searchBtn === 1 ? endDt : dtlEndDt,
    dtlCarNm: dtlCarNm,
    dtlTradeSctNm: dtlTradeSctNm,
    dtlTradeItemCd: dtlTradeItemCd,
    dtlAgentAcct: dtlAgentAcct,
    dtlTradeMemo: dtlTradeMemo,
    dtlDtlMemo: dtlDtlMemo,
    orderItem: ordItem,
    ordAscDesc: ordAscDesc,
  };    

  // 검색 버튼 클릭 핸들러
  const handleSearch = async (pageNum = 1) => {
    console.log("***검색 버튼 클릭***", { pageNum, pageSize });

    try {
      setLoading(true);

      if (typeof searchAction === "function") {
        const searchParamsWithPage = {
          ...getDefaultParams(pageNum),
          ...searchParams,
        };

        //console.log('서버 액션 호출 파라미터:', searchParamsWithPage);
        const result = await searchAction(searchParamsWithPage);
        //console.log('서버 액션 응답:', result);

        if (result && result.success) {
          //console.log('result.data', result.data);
          const responseData = result.data?.list?.carlist || [];
          const paginationInfo = result.data?.list?.pagination || {};
          const summaryData = result.data?.summary || [];

          // console.log('응답 데이터:', {
          //   responseDataLength: responseData.length,
          //   paginationInfo,
          //   summaryData
          // });

          setCarList(responseData);
          setPagination(paginationInfo);
          setCarConcilSummary(summaryData);

          // 서버에서 제공하는 페이지네이션 정보 사용
          setTotalPages(paginationInfo.totalPages || 1);
          setCurrentPage(paginationInfo.currentPage || pageNum);
        } else {
          alert("검색 중 오류가 발생했습니다: " + (result?.error || "unknown"));
        }
      } else {
        // 오류 발생
        alert("검색 중 오류가 발생했습니다: " + (result?.error || "unknown"));
      }
    } catch (error) {
      console.error("검색 에러:", error);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시: 서버에서 이미 데이터가 전달되었다면 그걸 우선 사용하고,
  // 데이터가 없을 때만 검색을 수행합니다 (중복 호출 방지).
  // 초기 자동 검색 비활성화
  /*
    useEffect(() => {
      if (!initialCarListData || initialCarListData.length === 0) {
        handleSearch(1);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    */

  // 상세 검색 버튼 클릭 핸들러
  const handleDtlSearch = () => {
    setSearchBtn(2);
    handleSearch(1);
  };

  /**
   * 페이지 처리
   */
  const handlePageChange = async page => {
    await handleSearch(page);
  };

  const openModal = (id) => {
    if (typeof window !== "undefined" && window.openModal) {
      window.openModal(id);
    } else {
      console.log("openModal stub:", id);
    }
  };

  useEffect(() => {
    setPageSize(listCountDtl);
    if (searchBtn === 1 || searchBtn === 2) handleSearch(1); // 자동 검색 비활성화
    console.log("pageSize", pageSize);
    console.log("listCount", listCountDtl);
  }, [ordItem, ordAscDesc, listCount]);


  // 선택 초기화 함수
  const handleResetSearch = () => {

    // 기본 검색 필드 초기화
    setCarNo("");
    setSelectedDealer("");
    setDtGubun("");
    setStartDt("");
    setEndDt("");

    // 상세 검색 필드 초기화
    setDtlCarNo("");
    setDtlDealer("");
    setDtlDtGubun("");
    setDtlStartDt("");
    setDtlEndDt("");
    setDtlCarNm("");
    setDtlTradeSctNm("");
    setDtlTradeItemCd("");
    setDtlAgentAcct("");
    setDtlTradeMemo("");
    setDtlDtlMemo("");

    // 정렬 옵션 초기화
    setOrdItem("거래일");
    setOrdAscDesc("desc");
    setListCount(10);
    setOrdItemDtl("거래일");
    setOrdAscDescDtl("desc");
    setListCountDtl(10);

    // 검색 버튼을 기본 검색으로 설정
    setSearchBtn(1);

    console.log("검색 조건이 초기화되었습니다.");
  };


  // 엑셀 다운로드용 컬럼 정의
  const excelColumns = [
    { accessorKey: "TRADE_DTIME", header: "거래일시" },
    { accessorKey: "TRADE_SCT_NM", header: "거래구분" },
    { accessorKey: "ACCT_NO", header: "계좌번호" },
    { accessorKey: "CAR_INFO_NM", header: "차량정보" },    // 딜러명, 차량번호, 차량명
    { accessorKey: "TRADE_ITEM_NM", header: "거래항목" },
    { accessorKey: "IAMT", header: "입금액" },
    { accessorKey: "OAMT", header: "출금액" },
    { accessorKey: "BLNC", header: "잔액" },
    { accessorKey: "TRADE_MEMO", header: "통장적요" },
    { accessorKey: "DTL_MEMO", header: "상세메모" }
  ];

  // 숫자 형식으로 처리할 컬럼들
  const numericColumns = ["IAMT", "OAMT", "BLNC"];

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 
  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">통장시재 관리</h2>

        <div className="guidebox">
          <p className="guidebox__title">팝빌 연동, 주기별 / 선택적 가져오기</p>
          <p className="guidebox__title">거래항목 상사환경설정</p>
        </div>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">검색</h2>
        <table className="table table--lg">
          <colgroup>
            <col style={{ width: '10%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: 'auto' }} />
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
                  onChange={(e) => {
                    const value = e.target.value || '';
                    setCarNo(value);
                  }}
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
                    defaultValue="선택1"
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
                        ? dealerList.find(d => d.USR_ID === selectedDealer)?.USR_NM || "선택"
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
                        name="searchTerm"
                        defaultValue="거래일"
                      />
                      <button
                        className="select__toggle"
                        type="button"
                        onClick={() => {
                          closeAllToggles();
                          setIsDtGubunSelectOpen(!isDtGubunSelectOpen);
                        }}
                      >
                        <span className="select__text">거래일</span>
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
                          className="select__option select__option--selected"
                          onClick={() => {
                            setDtGubun("01");
                            setIsDtGubunSelectOpen(false);
                          }}
                        >
                          거래일
                        </li>
                      </ul>
                  </div>

                  <div className="input w140">
                    <input
                      type="text"
                      className="jsStartDate input__field input__field--date"
                      placeholder="시작일"
                      autoComplete="off"
                      value={startDt}
                      onChange={e => setStartDt(e.target.value)}
                    />
                  </div>
                  <span className="input-group__dash">-</span>
                  <div className="input w140">
                    <input
                      type="text"
                      className="jsEndDate input__field input__field--date"
                      placeholder="종료일"
                      autoComplete="off"
                      value={endDt}
                      onChange={e => setEndDt(e.target.value)}
                    />
                  </div>

                  {/* disabled 속성 제거 시, 활성화 상태 적용 */}
                  <button
                    type="button"
                    className="btn btn--type03"
                    onClick={() => {
                      setSearchBtn(1);
                      handleSearch(1);
                    }}
                    disabled={loading}
                  >
                    <span className="ico ico--search"></span>차량검색
                  </button>
                  <button 
                    type="button" 
                    className="jsSearchboxBtn btn btn--type02"
                    onClick={() => setIsDetailSearchOpen(!isDetailSearchOpen)}
                  >
                    <span className="ico ico--search_detail"></span>
                    상세조건검색
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 상세 검색 영역 */}
        <div className="jsSearchbox searchbox" style={{ display: isDetailSearchOpen ? "block" : "none" }}>
          <div className="searchbox__head">
            <h3 className="searchbox__title">상세검색</h3>

            <div className="input-group">
              <button className="btn btn--white" type="button" onClick={handleResetSearch}>
                <span className="ico ico--reset"></span>선택 초기화
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <form action="">
              <table className="table table--lg">
                <colgroup>
                  <col style={{ width: '8%' }} />
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: 'auto' }} />
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
                          value={dtlCarNo}
                          onChange={(e) => setDtlCarNo(e.target.value)}
                        />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setDtlCarNo("")}
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
                          defaultValue="선택"
                        />
                        <button
                          className="select__toggle"
                          type="button"
                          onClick={() => {
                            closeAllToggles();
                            setIsDtlDealerSelectOpen(!isDtlDealerSelectOpen);
                          }}
                        >
                          <span className="select__text">
                            {dtlDealer
                              ? dealerList.find(d => d.USR_ID === dtlDealer)?.USR_NM || "선택"
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
                          style={{ display: isDtlDealerSelectOpen ? "block" : "none" }}
                        >
                          <li
                            className={`select__option ${!dtlDealer ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtlDealer("");
                              setIsDtlDealerSelectOpen(false);
                            }}
                          >
                            선택
                          </li>
                          {dealerList.map((dealer, index) => (
                            <li
                              key={index}
                              className={`select__option ${dtlDealer === dealer.USR_ID ? "select__option--selected" : ""}`}
                              data-value={dealer.USR_ID}
                              onClick={() => {
                                setDtlDealer(dealer.USR_ID);
                                setIsDtlDealerSelectOpen(false);
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
                            name="ordItemDtlHidden"
                            defaultValue="거래일"
                          />
                          <button
                            className="select__toggle"
                            type="button"
                            onClick={() => {
                              closeAllToggles();
                              setIsDtlDtGubunSelectOpen(!isDtlDtGubunSelectOpen);
                            }}
                          >
                            <span className="select__text">거래일</span>
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
                            style={{ display: isDtlDtGubunSelectOpen ? "block" : "none" }}
                          >
                            <li
                              className="select__option select__option--selected"
                              onClick={() => {
                                setDtlDtGubun("01");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              거래일
                            </li>
                          </ul>
                        </div>

                        <div className="input w140">
                          <input
                            type="text"
                            className="jsStartDate input__field input__field--date"
                            placeholder="시작일"
                            autoComplete="off"
                            value={dtlStartDt}
                            onChange={e => setDtlStartDt(e.target.value)}
                          />
                        </div>
                        <span className="input-group__dash">-</span>
                        <div className="input w140">
                          <input
                            type="text"
                            className="jsEndDate input__field input__field--date"
                            placeholder="종료일"
                            autoComplete="off"
                            value={dtlEndDt}
                            onChange={e => setDtlEndDt(e.target.value)}
                          />
                        </div>
                      </div>
                    </td>                    
                  </tr>
                  <tr>
                    <th>차량명</th>
                    <td>
                    <div className="input">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder=""
                          value={dtlCarNm}
                          onChange={(e) => {
                            const value = e.target.value || '';
                            setDtlCarNm(value);
                          }}
                        />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setDtlCarNm("")}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                    <th>거래구분</th>
                    <td>
                      <div className="form-option-wrap">
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              name="radiogroup01" 
                              checked={dtlTradeSctNm === ""}
                              onChange={() => setDtlTradeSctNm("")}
                            />
                            <span className="form-option__title">전체</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              name="radiogroup01"
                              checked={dtlTradeSctNm === "01"}
                              onChange={() => setDtlTradeSctNm("01")} 
                            />
                            <span className="form-option__title">입금</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              name="radiogroup01"
                              checked={dtlTradeSctNm === "02"} 
                              onChange={() => setDtlTradeSctNm("02")}
                            />
                            <span className="form-option__title">출금</span>
                          </label>
                        </div>
                      </div>
                    </td>
                    <th>거래항목</th>
                    <td>
                      <div className="select">
                        <input 
                          className="select__input" 
                          type="hidden" 
                          name="tradeItemCd" 
                          defaultValue="" 
                        />
                        <button 
                          className="select__toggle" 
                          type="button"
                          onClick={() => {
                            closeAllToggles();
                            setIsDtlTradeItemCdSelectOpen(!isDtlTradeItemCdSelectOpen);
                          }}
                        >
                          <span className="select__text">선택</span>
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
                          style={{ display: isDtlTradeItemCdSelectOpen ? "block" : "none" }}
                        >
                          <li 
                            className="select__option select__option--selected"
                            onClick={() => {
                              setDtlTradeItemCd("");
                              setIsDtlTradeItemCdSelectOpen(false);
                            }}
                          >
                            선택
                          </li>
                          {dtlTradeSctNm === "00" && (
                            <>
                              {tradeInItemList.map((item) => (
                                <li
                                  key={item.CD}
                                  className={`select__option ${dtlTradeItemCd === item.CD ? "select__option--selected" : ""}`}
                                  onClick={() => {
                                    setDtlTradeItemCd(item.CD);
                                    setIsDtlTradeItemCdSelectOpen(false);
                                  }}
                                >
                                  {item.CD_NM}
                                </li>
                              ))}
                              {tradeOutItemList.map((item) => (
                                <li
                                  key={item.CD}
                                  className={`select__option ${dtlTradeItemCd === item.CD ? "select__option--selected" : ""}`}
                                  onClick={() => {
                                    setDtlTradeItemCd(item.CD);
                                    setIsDtlTradeItemCdSelectOpen(false);
                                  }}
                                >
                                  {item.CD_NM}
                                </li>
                              ))}
                            </>
                          )}
                          {dtlTradeSctNm === "01" && tradeInItemList.map((item) => (
                            <li
                              key={item.CD}
                              className={`select__option ${dtlTradeItemCd === item.CD ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlTradeItemCd(item.CD);
                                setIsDtlTradeItemCdSelectOpen(false);
                              }}
                            >
                              {item.CD_NM}
                            </li>
                          ))}
                          {dtlTradeSctNm === "02" && tradeOutItemList.map((item) => (
                            <li
                              key={item.CD}
                              className={`select__option ${dtlTradeItemCd === item.CD ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlTradeItemCd(item.CD);
                                setIsDtlTradeItemCdSelectOpen(false);
                              }}
                            >
                              {item.CD_NM}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>계좌번호</th>
                    <td>
                      <div className="select">
                        <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                        <button 
                          className="select__toggle" 
                          type="button"
                          onClick={() => setIsDtlAgentAcctSelectOpen(!isDtlAgentAcctSelectOpen)}
                        >
                          <span className="select__text">
                            {dtlAgentAcct ? agentAcctList.find(item => item.ACCT_NO === dtlAgentAcct)?.ACCT_NO : '선택'}
                          </span>
                          <img className="select__arrow" src="/images/ico-dropdown.svg" alt="" />
                        </button>
                        <ul className={`select__menu ${isDtlAgentAcctSelectOpen ? 'select__menu--open' : ''}`}>
                          <li 
                            className="select__option select__option--selected"
                            onClick={() => {
                              setDtlAgentAcct('');
                              setIsDtlAgentAcctSelectOpen(false);
                            }}
                          >
                            선택
                          </li>
                          {agentAcctList.map((item) => (
                            <li
                              key={item.ACCT_NO}
                              className={`select__option ${dtlAgentAcct === item.ACCT_NO ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlAgentAcct(item.ACCT_NO);
                                setIsDtlAgentAcctSelectOpen(false);
                              }}
                            >
                              {item.ACCT_NO}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                    <th>통장적요</th>
                    <td>
                      <div className="input">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder=""
                          value={dtlTradeMemo}
                          onChange={(e) => setDtlTradeMemo(e.target.value)}
                        />
                        <div className="input__utils">
                          <button 
                            type="button" 
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setDtlTradeMemo("")}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>

                    <th>상세메모</th>
                    <td>
                      <div className="input">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder=""
                          value={dtlDtlMemo}
                          onChange={(e) => setDtlDtlMemo(e.target.value)}
                        />
                        <div className="input__utils">
                          <button 
                            type="button" 
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setDtlDtlMemo("")}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="searchbox__btns container__btns">
              <button 
                  className="jsSearchboxBtn btn btn--light" 
                  type="button"
                  onClick={() => setIsDetailSearchOpen(false)}
                >
                  취소
                </button>
                <button 
                  className="btn btn--primary" 
                  type="button" 
                  onClick={() => {
                    handleDtlSearch();
                    setIsDetailSearchOpen(false);
                  }}
                >
                  <span className="ico ico--search"></span>검색
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">
          리스트<span>Total {pagination?.totalCount || carList?.length || 0}건</span>
        </h2>
        <div className="table-wrap__head table-wrap__title">
          <button
            type="button"
            className="btn btn--red btn--padding--r30"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.href = '#';
            }}
          >
            <span className="ico ico--add"></span>통장내역 불러오기
          </button>
          <div className="input-group">
            {/* 딜러명 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="거래일" />
              <button className="select__toggle" type="button">
                <span className="select__text">거래일</span>
                <img className="select__arrow" src="/images/ico-dropdown.svg" alt="" />
              </button>

              <ul className="select__menu">
                <li className="select__option select__option--selected" data-value="거래일">
                  거래일
                </li>
                <li className="select__option" data-value="">
                  계좌번호
                </li>
                <li className="select__option" data-value="">
                  거래항목
                </li>
              </ul>
            </div>

            {/* 정렬순서 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="desc" />
              <button className="select__toggle" type="button">
                <span className="select__text">내림차순</span>
                <img className="select__arrow" src="/images/ico-dropdown.svg" alt="" />
              </button>

              <ul className="select__menu">
                <li className="select__option select__option--selected" data-value="desc">
                  내림차순
                </li>
                <li className="select__option" data-value="asc">
                  오름차순
                </li>
              </ul>
            </div>

            {/* 건수 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="10" />
              <button className="select__toggle" type="button">
                <span className="select__text">10건씩</span>
                <img className="select__arrow" src="/images/ico-dropdown.svg" alt="" />
              </button>

              <ul className="select__menu">
                <li className="select__option select__option--selected" data-value="10">
                  10건씩
                </li>
                <li className="select__option" data-value="30">
                  30건씩
                </li>
                <li className="select__option" data-value="50">
                  50건씩
                </li>
              </ul>
            </div>

            <SimpleTableDownloadButton 
              data={carList}
              columns={excelColumns}
              numericColumns={numericColumns}
              filePrefix="통장시재리스트"
              className="btn btn--white"
              text="다운로드"
              sheetName="통장시재"
            />
          </div>
        </div>

        <table className="table">
          <colgroup><col style={{ width: '250px' }}/>
          <col style={{ width: '100px' }}/>
          <col style={{ width: '150px' }}/>
          <col style={{ width: 'auto' }}/>
          <col style={{ width: '150px' }}/>
          <col style={{ width: '150px' }}/>
          <col style={{ width: '150px' }}/>
          <col style={{ width: '150px' }}/>
          <col style={{ width: '150px' }}/>
          <col style={{ width: 'auto' }}/>
          <col style={{ width: '100px' }}/>
          </colgroup>
          <thead>
            <tr>
              <th>거래일시</th>
              <th>거래구분</th>
              <th>계좌번호</th>
              <th>차량정보</th>
              <th>거래항목</th>
              <th>입금액</th>
              <th>출금액</th>
              <th>잔액</th>
              <th>통장적요</th>
              <th>상세메모</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
          {carList && carList.length > 0 ? (
              carList.map((car, index) => (
            <tr key={`${car.CAR_REG_ID}-${index}`}>
              <td>{car.TRADE_DTIME}</td>
              <td>{car.TRADE_SCT_NM}</td>
              <td>{car.ACCT_NO}</td>
              <td>{car.CAR_INFO_NM}</td>
              <td>{car.TRADE_ITEM_NM}</td>
              <td>{car.IAMT?.toLocaleString()}</td>
              <td>{car.OAMT?.toLocaleString()}</td>
              <td>{car.BLNC?.toLocaleString()}</td>
              <td>{car.TRADE_MEMO}</td>
              <td>{car.DTL_MEMO}</td>
              <td>
              <button
                    type="button"
                    className="btn btn--light btn--sm"
                    onClick={e => e.stopPropagation()}
                  >
                  <Link
                    href={`/bank-account/edit/${car.ACCT_DTL_SEQ}`}
                    onClick={e => e.stopPropagation()}
                  >
                    상세등록
                  </Link>
                </button>
              </td>
            </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center">검색 결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">입출금 합계</h2>
        <table className="table">
          <thead>
            <tr>
              <th colSpan={2} className="col-half">
                입금
              </th>
              <th colSpan={2} className="col-half">
                출금
              </th>
            </tr>
            <tr>
              <th className="col-half">건수</th>
              <th className="col-half">금액</th>
              <th className="col-half">건수</th>
              <th className="col-half">금액</th>
            </tr>
          </thead>
          <tbody>
            {carAcctSummary && carAcctSummary.length > 0 ? (
              carAcctSummary.map((summary, index) => (
                <tr key={index}>
                <td className="text-red">{summary.I_CNT?.toLocaleString()}</td>
                <td className="text-red">{summary.IAMT?.toLocaleString()}</td>
                <td className="text-blue">{summary.O_CNT?.toLocaleString()}</td>
                <td className="text-blue">{summary.OAMT?.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">검색 결과가 없습니다.</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
