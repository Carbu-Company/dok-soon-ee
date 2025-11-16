"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@/components/ui/pagination";
import BrokerageRemoveModal from "@/components/modal/BrokerageRemoveModal";
import SimpleTableDownloadButton from "@/components/utils/SimpleTableDownloadButton";
import Image from "next/image";

export default function OtherDealerMediationSalesPage(props) {
  const router = useRouter();

  // setSearchBtn
  const [searchBtn, setSearchBtn] = useState(0);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 기본 검색 영역
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // props 값 가져오기
  const [loading, setLoading] = useState(false);

  // 초기 데이터: 서버에서 전달된 데이터 구조 처리
  const initialCarListData = props.carList?.data?.carlist || [];
  const initialPagination = props.carList?.data?.pagination || {};
  
  // Summary 데이터
  const initialCarBrkTradeSummary = props.carSummary?.data || [];

  const [carList, setCarList] = useState(initialCarListData);
  const [pagination, setPagination] = useState(initialPagination);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages || 1);

  const [carBrkTradeSummary, setCarBrkTradeSummary] = useState(initialCarBrkTradeSummary);

  const [dealerList, setDealerList] = useState(props.dealerList || []);
  const [saleItemList, setSaleItemList] = useState(props.saleItemList || []);
  const [crStatList, setCrStatList] = useState(props.crStatList || []);
  const [evdcCdList, setEvdcCdList] = useState(props.evdcCdList || []);

  
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

  // 알선 삭제 모달 관련 state
  const [isBrokerageRemoveModalOpen, setIsBrokerageRemoveModalOpen] = useState(false);
  const [selectedBrokerageForRemove, setSelectedBrokerageForRemove] = useState(null);

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

  const [dtlBrkTradeItemCd, setDtlBrkTradeItemCd] = useState("");
  const [isDtlBrkTradeItemCdSelectOpen, setIsDtlBrkTradeItemCdSelectOpen] = useState(false);

  // 상세 알선 거래처 명
  const [dtlBrkAgentNm, setDtlBrkAgentNm] = useState("");

  // 상세 알선 차량명
  const [dtlCarNm, setDtlCarNm] = useState("");

  // 상세 알선 고객명
  const [dtlCustNm, setDtlCustNm] = useState("");
  
  // 상세 검색 증빙종류
  const [dtlEvdcGubun, setDtlEvdcGubun] = useState("");
  const [isDtlEvdcGubunSelectOpen, setIsDtlEvdcGubunSelectOpen] = useState(false);

  // 상세 검색 메모
  const [dtlBrkMemo, setDtlBrkMemo] = useState("");

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
    setIsDtlEvdcGubunSelectOpen(false);
    setIsDtlBrkTradeItemCdSelectOpen(false);
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
    agentId: props.session?.agentId,
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
    dtlBrkTradeItemCd: dtlBrkTradeItemCd,
    dtlBrkAgentNm: dtlBrkAgentNm,
    dtlCarNm: dtlCarNm,
    dtlCustNm: dtlCustNm,
    dtlEvdcGubun: dtlEvdcGubun,
    dtlBrkMemo: dtlBrkMemo,
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
          setCarBrkTradeSummary(summaryData);

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

  // 상세 검색 버튼 클릭 핸들러
  const handleDtlSearch = () => {
    setSearchBtn(2);
    handleSearch(1);
  };

  
  // 알선 삭제 모달 관련 핸들러
  const handleBrokerageRemoveModalOpen = (brokerage) => {
    setSelectedBrokerageForRemove(brokerage);
    setIsBrokerageRemoveModalOpen(true);
  };

  const handleBrokerageRemoveModalClose = () => {
    setIsBrokerageRemoveModalOpen(false);
    setSelectedBrokerageForRemove(null);
  };

    const handleBrokerageRemoveConfirm = async () => {
      // TODO: 실제 알선 삭제 API 호출 구현
    console.log("알선 삭제 확인:", selectedBrokerageForRemove);
    // API 호출 후 성공하면 모달 닫기 및 목록 새로고침
    handleBrokerageRemoveModalClose();
    // handleSearch(currentPage); // 목록 새로고침
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

    setDtlBrkTradeItemCd("");
    setDtlBrkAgentNm("");
    setDtlCarNm("");
    setDtlCustNm("");
    setDtlEvdcGubun("");
    setDtlBrkMemo("");

    // 정렬 옵션 초기화
    setOrdItem("알선판매일");
    setOrdAscDesc("desc");
    setListCount(10);
    setOrdItemDtl("알선판매일");
    setOrdAscDescDtl("desc");
    setListCountDtl(10);

    // 검색 버튼을 기본 검색으로 설정
    setSearchBtn(1);

    console.log("검색 조건이 초기화되었습니다.");
  };


  // 엑셀 다운로드용 컬럼 정의
  const excelColumns = [
    { accessorKey: "CAR_NO", header: "차량번호" },
    { accessorKey: "BRK_SALE_DT", header: "알선판매일" },
    { accessorKey: "BRK_TRADE_ITEM_NM", header: "거래항목" },
    { accessorKey: "BRK_AMT", header: "금액" },
    { accessorKey: "DEDT_AMT", header: "공제금액" },
    { accessorKey: "TAX_AMT", header: "세액합계" },
    { accessorKey: "PAY_AMT", header: "지급액" },
    { accessorKey: "BRK_EVDC_NM", header: "증빙" },
    { accessorKey: "TXBL_ISSU_DT", header: "발행일" },
    { accessorKey: "OWNER_NM", header: "상사/고객명" }
  ];

  // 숫자 형식으로 처리할 컬럼들
  const numericColumns = ["BRK_AMT", "DEDT_AMT", "TAX_AMT", "PAY_AMT"];

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 
  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">타상사알선판매 관리</h2>

        <div className="guidebox">
          <p className="guidebox__title">매도처리 후 매출증빙과 연계 필요</p>
          <p className="guidebox__title">세금계산서 직접 발행 필요</p>
          <p className="guidebox__title">
            삭제 시 체크! (계산서 발행건 처리) 계산서 취소 발행 여부 확인 필요.
          </p>
          <p className="guidebox__title"> 
            타상사 차량을 알선 판매 후 알선수수료, 알선수익금에 대해 차주상사에서 정산하지 않고 알선상사에서 직접 정산(원천징수)을 해야 하는 경우 이용바랍니다.
          </p>
        </div>
      </div>

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
                        defaultValue="알선판매일"
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
                            ? "알선판매일"
                            : dtGubun === "02"
                              ? "등록일" 
                                : "알선판매일"}
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
                          알선판매일
                        </li>
                        <li
                          className={`select__option ${dtGubun === "02" ? "select__option--selected" : ""}`}
                          onClick={() => {
                            setDtGubun("02");
                            setIsDtGubunSelectOpen(false);
                          }}
                        >
                          등록일
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
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "auto" }} />
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "auto" }} />
                  <col style={{ width: "8%" }} />
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
                            defaultValue="알선판매일"
                          />
                          <button
                            className="select__toggle"
                            type="button"
                            onClick={() => {
                              closeAllToggles();
                              setIsDtlDtGubunSelectOpen(!isDtlDtGubunSelectOpen);
                            }}
                          >
                            <span className="select__text">
                              {dtlDtGubun === "01"
                                ? "알선판매일"
                                : dtlDtGubun === "02"
                                  ? "등록일"
                                    : "알선판매일"}
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
                            style={{ display: isDtlDtGubunSelectOpen ? "block" : "none" }}
                          >
                            <li
                              className={`select__option ${dtlDtGubun === "알선판매일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("01");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              알선판매일
                            </li>
                            <li
                              className={`select__option ${dtlDtGubun === "등록일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("02");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              등록일
                            </li>
                          </ul>
                        </div>

                        <div className="input w140">
                          <input 
                            type="date" 
                            className="input__field" 
                            placeholder="시작일" 
                            autoComplete="off"
                            onChange={(e) => setDtlStartDt(e.target.value)}
                            value={dtlStartDt || ''} 
                          />
                        </div>
                        <span className="input-group__dash">-</span>
                        <div className="input w140">
                          <input
                            type="date"
                            className="input__field"
                            placeholder="종료일"
                            autoComplete="off"
                            onChange={e => setDtlEndDt(e.target.value)}
                            value={dtlEndDt || ''} 
                          />
                        </div>
                      </div>
                    </td>                    
                  </tr>
                  <tr>
                    <th>거래항목</th>
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
                            setIsDtlBrkTradeItemCdSelectOpen(!isDtlBrkTradeItemCdSelectOpen);
                          }}
                        >
                          <span className="select__text">
                            {dtlBrkTradeItemCd === "001" 
                              ? "알선수수료"
                              : dtlBrkTradeItemCd === "002"
                                ? "알선수익금" 
                                : "선택"}
                          </span>
                          <Image
                            className="select__arrow"
                            src="/images/ico-dropdown.svg"
                            width={10}
                            height={10}
                            alt=""
                          />
                        </button>

                        <ul 
                          className="select__menu"
                          style={{ display: isDtlBrkTradeItemCdSelectOpen ? "block" : "none" }}
                        >
                          <li 
                            className={`select__option ${!dtlBrkTradeItemCd ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtlBrkTradeItemCd("");
                              setIsDtlBrkTradeItemCdSelectOpen(false);
                            }}
                          >
                            선택
                          </li>
                          <li 
                            className={`select__option ${dtlBrkTradeItemCd === "001" ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtlBrkTradeItemCd("001");
                              setIsDtlBrkTradeItemCdSelectOpen(false);
                            }}
                          >
                            알선수수료
                          </li>
                          <li 
                            className={`select__option ${dtlBrkTradeItemCd === "002" ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtlBrkTradeItemCd("002");
                              setIsDtlBrkTradeItemCdSelectOpen(false);
                            }}
                          >
                            알선수익금
                          </li>
                        </ul>
                      </div>
                    </td>
                    <th>상사명</th>
                    <td>
                      <div className="input">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder=""
                          value={dtlBrkAgentNm}
                          onChange={(e) => {
                            const value = e.target.value || '';
                            setDtlBrkAgentNm(value);
                          }}
                        />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setDtlBrkAgentNm("")}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
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
                  </tr>
                  <tr>
                    <th>고객명</th>
                    <td>
                      <div className="input">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder=""
                          value={dtlCustNm}
                          onChange={(e) => {
                            const value = e.target.value || '';
                            setDtlCustNm(value);
                          }}
                        />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setDtlCustNm("")}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                    <th>매출증빙</th>
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
                            setIsDtlEvdcGubunSelectOpen(!isDtlEvdcGubunSelectOpen);
                          }}
                        >
                          <span className="select__text">
                            {dtlEvdcGubun
                              ? evdcCdList.find(item => item.CD === dtlEvdcGubun)?.CD_NM
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
                          style={{ display: isDtlEvdcGubunSelectOpen ? "block" : "none" }}
                        >
                          <li
                            className={`select__option ${dtlEvdcGubun === "" ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtlEvdcGubun("");
                              setIsDtlEvdcGubunSelectOpen(false);
                            }}
                          >
                            선택
                          </li>
                          {evdcCdList.map(item => (
                            <li
                              key={item.CD}
                              className={`select__option ${dtlEvdcGubun === item.CD ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlEvdcGubun(item.CD);
                                setIsDtlEvdcGubunSelectOpen(false);
                              }}
                            >
                              {item.CD_NM}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                    <th>특이사항</th>
                    <td>
                      <div className="input">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder=""
                          value={dtlBrkMemo}
                          onChange={(e) => setDtlBrkMemo(e.target.value)}
                        />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setDtlBrkMemo("")}
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
              router.push("/car-brokerage/register");
            }}
          >
            <span className="ico ico--add"></span>알선매출 등록
          </button>
          <div className="input-group">
            {/* 딜러명 */}
            <div className="select select--dark w160">
              <input
                className="select__input"
                type="hidden"
                name="dealer"
                defaultValue="알선판매일"
              />
              <button className="select__toggle" type="button">
                <span className="select__text">알선판매일</span>
                <Image
                  className="select__arrow"
                  src="/images/ico-dropdown.svg"
                  alt=""
                  width={10}
                  height={10}
                />
              </button>

              <ul className="select__menu">
                <li className="select__option select__option--selected" data-value="발행일">
                  알선판매일
                </li>
                <li className="select__option" data-value="">
                  등록일
                </li>
              </ul>
            </div>

            {/* 정렬순서 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="desc" />
              <button className="select__toggle" type="button">
                <span className="select__text">내림차순</span>
                <Image
                  className="select__arrow"
                  src="/images/ico-dropdown.svg"
                  alt=""
                  width={10}
                  height={10}
                />
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
                <Image
                  className="select__arrow"
                  src="/images/ico-dropdown.svg"
                  alt=""
                  width={10}
                  height={10}
                />
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
              filePrefix="알선판매리스트"
              className="btn btn--white"
              text="다운로드"
              sheetName="알선판매"
            />
          </div>
        </div>

        <table className="table">
          <colgroup>
            <col style={{ width: "auto" }} />
            {/*거래처명*/}
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "auto" }} />
            {/*품목명*/}
            <col style={{ width: "100px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>
                차량정보
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>차량번호 / 담당딜러 / 차량명</p>
                  </div>
                </div>
              </th>
              <th>알선판매일</th>
              <th>거래항목</th>
              <th>금액</th>
              <th>공제금액</th>
              <th>세액합계</th>
              <th>지급액</th>
              <th>증빙</th>
              <th>발행일</th>
              <th>상사/고객명</th>
              <th>바로가기</th>
            </tr>
          </thead>
          <tbody>
            {carList && carList.length > 0 ? (
              carList.map((car, index) => (
            <tr key={`${car.BRK_TRADE_SEQ}-${index}`}>
              <td>{car.CAR_NO} / {car.SALE_DLR_NM} / {car.CAR_NM}</td>
              <td>{car.BRK_SALE_DT}</td>
              <td>{car.TRADE_ITEM_NM}</td>
              <td>{car.TRADE_AMT.toLocaleString()}</td>
              <td>{car.DEDT_AMT.toLocaleString()}</td>
              <td>{car.TAX_SUM_AMT.toLocaleString()}</td>
              <td>{car.DLR_PAY_AMT.toLocaleString()}</td>
              <td>{car.SALE_EVDC_NM}</td>
              <td>
                <button
                  type="button"
                  className="btn btn--light btn--sm"
                  onClick={() => {
                    if (typeof window !== "undefined") window.location.href = "#";
                  }}
                >
                  발행등록
                </button>
              </td>
              <td>{car.CUST_NM}</td>
              <td>
                <div className="input-group input-group--sm input-group--center">
                  <div className="select select--utils">
                    <button type="button" className="select__toggle">
                      더보기
                    </button>
                    <ul className="select__menu">
                      <li className="select__option">
                        <Link href={`/car-brokerage/edit/${car.BRK_TRADE_SEQ}`}>알선매출 수정</Link>
                      </li>
                      <li className="select__option">
                        <button
                          type="button"
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleBrokerageRemoveModalOpen(car);
                          }}
                          style={{
                            border: "none",
                            background: "none",
                            padding: 0,
                            color: "inherit",
                            cursor: "pointer",
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          알선매출 삭제
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
          ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center py-8 text-gray-500">
                데이터가 존재하지 않습니다.
              </td>
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
        <h2 className="table-wrap__title">합계표</h2>
        <table className="table">
          <thead>
            <tr>
              <th>거래항목</th>
              <th>건수</th>
              <th>합계금액</th>
              <th>공급가액</th>
              <th>세액</th>
              <th>공제금액</th>
              <th>지급액</th>
            </tr>
          </thead>
          <tbody>
              {carBrkTradeSummary?.map((item, index) => (
                index < 2 && (
                  <tr key={index}>
                    <td>{item.BRK_TRADE_ITEM_NM || '-'}</td>
                    <td>{item.CNT?.toLocaleString() || 0}</td>
                    <td>{item.TRADE_AMT?.toLocaleString() || 0}</td>
                    <td>{item.TRADE_SUP_PRC?.toLocaleString() || 0}</td>
                    <td>{item.TRADE_VAT?.toLocaleString() || 0}</td>
                    <td>{item.DEDT_AMT?.toLocaleString() || 0}</td>
                    <td>{item.DLR_PAY_AMT?.toLocaleString() || 0}</td>
                  </tr>
                )
              ))}
          </tbody>
          <tfoot>
            {carBrkTradeSummary?.map((item, index) => (
              index === 2 && (
                <tr key={index}>
                  <td>{item.BRK_TRADE_ITEM_NM || '-'}</td>
                  <td>{item.CNT?.toLocaleString() || 0}</td>
                  <td>{item.TRADE_AMT?.toLocaleString() || 0}</td>
                  <td>{item.TRADE_SUP_PRC?.toLocaleString() || 0}</td>
                  <td>{item.TRADE_VAT?.toLocaleString() || 0}</td>
                  <td>{item.DEDT_AMT?.toLocaleString() || 0}</td>
                  <td>{item.DLR_PAY_AMT?.toLocaleString() || 0}</td>
                </tr>
              )
            ))}
          </tfoot>
        </table>
      </div>

      {/* 매입취소/삭제 모달 */}
      <BrokerageRemoveModal
        brokerage={selectedBrokerageForRemove}
        open={isBrokerageRemoveModalOpen}
        onClose={handleBrokerageRemoveModalClose}
        onConfirm={handleBrokerageRemoveConfirm}
      />
    </main>
  );
}
