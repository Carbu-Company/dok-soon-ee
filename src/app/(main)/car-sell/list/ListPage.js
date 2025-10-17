"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@/components/ui/pagination";
import SimpleTableDownloadButton from "@/components/utils/SimpleTableDownloadButton";

export default function SalesVehicleList(props) {
  const router = useRouter();
  const openModal = (id) => {
    if (typeof window !== "undefined" && window.openModal) {
      window.openModal(id);
    } else {
      console.log("openModal stub:", id);
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 기본 검색 영역
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // props 값 가져오기
  const [loading, setLoading] = useState(false);

  // 초기 데이터: 서버에서 전달된 데이터 구조 처리
  const initialCarListData = props.carList?.data?.carlist || [];
  const initialPagination = props.carList?.data?.pagination || {};

  // Summary 데이터
  const initialCarSellSummary = props.carSellSummary?.data || [];

  const [carList, setCarList] = useState(initialCarListData);
  const [pagination, setPagination] = useState(initialPagination);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages || 1);

  const [carSellSummary, setCarSellSummary] = useState(initialCarSellSummary);

  const [dealerList, setDealerList] = useState(props.dealerList || []);
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
  const [dtGubun, setDtGubun] = useState("");
  const [isDtGubunSelectOpen, setIsDtGubunSelectOpen] = useState(false);

  // 검색 기간
  const [startDt, setStartDt] = useState("");
  const [endDt, setEndDt] = useState("");

  // 매입취소/삭제 모달 관련 state
  const [isPurchaseRemoveModalOpen, setIsPurchaseRemoveModalOpen] = useState(false);
  const [selectedCarForRemove, setSelectedCarForRemove] = useState(null);
  const [selectedCarTypeForRemove, setSelectedCarTypeForRemove] = useState(null);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //console.log(carList);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 페이지네이션 영역
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 페이지 정렬 순서 항목

  // 정렬순서 항목
  const [ordItem, setOrdItem] = useState("제시일");
  const [isOrdItemSelectOpen, setIsOrdItemSelectOpen] = useState(false);

  // 정렬순서
  const [ordAscDesc, setOrdAscDesc] = useState("desc");
  const [isOrdAscDescSelectOpen, setIsOrdAscDescSelectOpen] = useState(false);

  // 건수 - pageSize
  const [listCount, setListCount] = useState(10);
  const [isListCountSelectOpen, setIsListCountSelectOpen] = useState(false);

  // listCount가 변경될 때 pageSize 업데이트하고 첫 페이지로 이동
  // 자동 검색 비활성화
  useEffect(() => {
    setPageSize(listCount);
    if (searchBtn === 1 || searchBtn === 2) handleSearch(1);
    console.log("pageSize", pageSize);
    console.log("listCount", listCount);
  }, [ordItem, ordAscDesc, listCount]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 상세 검색 영역
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 페이지네이션 영역
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 페이지 정렬 순서 항목

  // 정렬순서 항목
  const [ordItemDtl, setOrdItemDtl] = useState("제시일");
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

  // listCount가 변경될 때 pageSize 업데이트하고 첫 페이지로 이동
  // 자동 검색 비활성화
  useEffect(() => {
    setPageSize(listCountDtl);
    handleSearch(1);
    console.log("pageSize", pageSize);
    console.log("listCount", listCountDtl);
  }, [ordItemDtl, ordAscDescDtl, listCountDtl]);



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

  // 상세 검색 고객명
  const [dtlCustomerName, setDtlCustomerName] = useState("");

  // 상세 검색 고객구분
  const [dtlCustGubun, setDtlCustGubun] = useState("");
  const [isDtlCustGubunSelectOpen, setIsDtlCustGubunSelectOpen] = useState(false);

  // 상세 검색 증빙종류
  const [dtlEvdcGubun, setDtlEvdcGubun] = useState("");
  const [isDtlEvdcGubunSelectOpen, setIsDtlEvdcGubunSelectOpen] = useState(false);

  // 상세 검색 제시구분분
  const [dtlPrsnGubun, setDtlPrsnGubun] = useState("");
  const [isDtlPrsnGubunSelectOpen, setIsDtlPrsnGubunSelectOpen] = useState(false);

  // 상세 검색 사업자등록번호
  const [dtlOwnerBrno, setDtlOwnerBrno] = useState("");

  // 상세 검색 주민(법인)등록번호
  const [dtlOwnerSsn, setDtlOwnerSsn] = useState("");

  // 상세 검색 계약서번호
  const [dtlCtshNo, setDtlCtshNo] = useState("");

  // 상세 검색 차량번호(매입전)
  const [dtlCarNoBefore, setDtlCarNoBefore] = useState("");

  // 매입 상태 구분
  const [dtlPurStatGubun, setDtlPurStatGubun] = useState("");

  // setSearchBtn
  const [searchBtn, setSearchBtn] = useState(1);

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
    setIsDtlCustGubunSelectOpen(false);
    setIsDtlEvdcGubunSelectOpen(false);
    setIsDtlPrsnGubunSelectOpen(false);
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
    dtlCustomerName: dtlCustomerName,
    dtlCustGubun: dtlCustGubun,
    dtlEvdcGubun: dtlEvdcGubun,
    dtlPrsnGubun: dtlPrsnGubun,
    dtlOwnerBrno: dtlOwnerBrno,
    dtlOwnerSsn: dtlOwnerSsn,
    dtlCtshNo: dtlCtshNo,
    dtlCarNoBefore: dtlCarNoBefore,
    dtlPurStatGubun: dtlPurStatGubun,
    orderItem: ordItem,
    ordAscDesc: ordAscDesc,
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = async (pageNum = 1) => {
    console.log("검색 버튼 클릭", { pageNum, pageSize });

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
          setCarSellSummary(summaryData);

          // 서버에서 제공하는 페이지네이션 정보 사용
          setTotalPages(paginationInfo.totalPages || 1);
          setCurrentPage(paginationInfo.currentPage || pageNum);
        } else {
          alert("검색 중 오류가 발생했습니다: " + (result?.error || "unknown"));
        }
      } else {
        // searchAction이 없으면 /api/purchases 엔드포인트 호출 시도
        const res = await fetch(`/api/purchases?page=${pageNum}&pageSize=${pageSize}`);
        if (!res.ok) throw new Error("서버 응답 에러");
        const json = await res.json();
        const dataArr = Array.isArray(json) ? json : json.data || [];
        setCarList(dataArr);
        setTotalPages(json.totalPages || Math.ceil(dataArr.length / pageSize) || 1);
        setCurrentPage(pageNum);
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

  // 매입취소/삭제 모달 관련 핸들러
  const handlePurchaseRemoveModalOpen = (car, type) => {
    setSelectedCarForRemove(car);
    setSelectedCarTypeForRemove(type);
    setIsPurchaseRemoveModalOpen(true);
  };

  const handlePurchaseRemoveModalClose = () => {
    setIsPurchaseRemoveModalOpen(false);
    setSelectedCarForRemove(null);
  };

  const handlePurchaseRemoveConfirm = async () => {
    // TODO: 실제 매입취소/삭제 API 호출 구현
    console.log("매입취소/삭제 확인:", selectedCarForRemove);
    // API 호출 후 성공하면 모달 닫기 및 목록 새로고침
    handlePurchaseRemoveModalClose();
    // handleSearch(currentPage); // 목록 새로고침
  };

  /**
   * 페이지 처리
   */
  const handlePageChange = async page => {
    await handleSearch(page);
  };

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

    setDtlCustomerName("");
    setDtlCustGubun("");
    setDtlEvdcGubun("");
    setDtlPrsnGubun("");
    setDtlOwnerBrno("");
    setDtlOwnerSsn("");
    setDtlCtshNo("");
    setDtlCarNoBefore("");

    // 정렬 옵션 초기화
    setOrdItem("매도(판매)일");
    setOrdAscDesc("desc");
    setListCount(10);
    setOrdItemDtl("매도(판매)일");
    setOrdAscDescDtl("desc");
    setListCountDtl(10);

    // 검색 버튼을 기본 검색으로 설정
    setSearchBtn(1);

    console.log("검색 조건이 초기화되었습니다.");
  };


  // 엑셀 다운로드용 컬럼 정의
  const excelColumns = [
    { accessorKey: "CAR_NO", header: "차량번호" },
    { accessorKey: "DLR_NM", header: "담당딜러" },
    { accessorKey: "CAR_NM", header: "차량명" },
    { accessorKey: "CAR_PUR_DT", header: "매입일" },
    { accessorKey: "PUR_AMT", header: "매입금액" },

    { accessorKey: "CAR_STAT_NM", header: "제시구분" },
    { accessorKey: "SALE_TP_NM", header: "매도유형" },
    { accessorKey: "SEL_DLR_NM", header: "판매딜러" },
    { accessorKey: "BUYER_NM", header: "고객명" },
    { accessorKey: "SALE_AMT", header: "판매금액" },
    { accessorKey: "PERF_INFE_AMT", header: "성능보험료" },
    { accessorKey: "AGENT_SEL_COST", header: "상사매도비" },
    { accessorKey: "CAR_SALE_DT", header: "판매일" },
    { accessorKey: "SALE_REG_DT", header: "매출등록일" },
    { accessorKey: "ADJ_FIN_DT", header: "정산일" }
  ];

  // 숫자 형식으로 처리할 컬럼들
  const numericColumns = ["PUR_AMT", "SALE_AMT", "PERF_INFE_AMT", "AGENT_SEL_COST"];

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">판매차량 리스트</h2>

        <div className="guidebox">
          <p className="guidebox__title">매출(현금영수증,세금계산서,카드)등록 화면구성</p>
          <p className="guidebox__title">매도차량 1대당 매출증빙유형 복수개 저장(검색시 필요)</p>
          <p className="guidebox__title">정산처리 화면구성</p>
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
                    placeholder="차량번호(매입전/후)"
                    value={carNo}
                    onChange={e => setCarNo(e.target.value)}
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
                      name="dealer"
                      defaultValue="01"
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
                            ? "매출발행일"
                            : dtGubun === "03"
                              ? "정산처리일"
                              : dtGubun === "04"
                                ? "제시(매입)일"
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
                      style={{ display: isDtGubunSelectOpen ? "block" : "none" }}
                    >
                      <li
                        className={`select__option ${!dtGubun ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        선택
                      </li>
                      <li
                        className={`select__option ${dtGubun === "01" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("01");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        매도(판매)일
                      </li>
                      <li
                        className={`select__option ${dtGubun === "02" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("02");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        매출발행일
                      </li>
                      <li
                        className={`select__option ${dtGubun === "03" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("03");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        정산처리일
                      </li>
                      <li
                        className={`select__option ${dtGubun === "04" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("04");
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

                  {/* disabled 속성 제거 시, 활성화 상태 적용 */}
                  <button
                    type="button"
                    className="btn btn--type03"
                    onClick={() => {
                      setSearchBtn(1);
                      handleSearch();
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

            {/* 정렬 항목 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="매도(판매)일" />
              <button
                className="select__toggle"
                type="button"
                onClick={() => {
                  closeAllToggles();
                  setIsOrdItemSelectOpenDtl(!isOrdItemSelectOpenDtl);
                }}
              >
                <span className="select__text">{ordItemDtl || "제시일"}</span>
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
                style={{ display: isOrdItemSelectOpenDtl ? "block" : "none" }}
                >
                <li
                  className={`select__option ${ordItemDtl === "제시일" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItemDtl("매도(판매)일");
                    setIsOrdItemSelectOpenDtl(false);
                    handleSearch(1);
                  }}
                >
                  매도(판매)일
                </li>
                <li
                  className={`select__option ${ordItemDtl === "제시(매입)일" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItemDtl("제시(매입)일");
                    setIsOrdItemSelectOpenDtl(false);
                    handleSearch(1);
                  }}
                >
                  제시(매입)일
                </li>
              </ul>
            </div>

            {/* 정렬순서 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="desc" />
              <button
                className="select__toggle"
                type="button"
                onClick={() => {
                  closeAllToggles();
                  setIsOrdAscDescSelectOpenDtl(!isOrdAscDescSelectOpenDtl);
                }}
              >
                <span className="select__text">
                  {ordAscDescDtl === "desc" ? "내림차순" : ordAscDescDtl === "asc" ? "오름차순" : "선택"}
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
                style={{ display: isOrdAscDescSelectOpenDtl ? "block" : "none" }}
              >
                <li
                  className={`select__option ${ordAscDescDtl === "desc" ? "select__option--selected" : ordAscDescDtl === "asc" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdAscDescDtl("desc");
                    setIsOrdAscDescSelectOpenDtl(false);
                    handleSearch(1);
                  }}
                >
                  내림차순
                </li>
                <li
                  className={`select__option ${ordAscDescDtl === "asc" ? "select__option--selected" : ordAscDescDtl === "desc" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdAscDescDtl("asc");
                    setIsOrdAscDescSelectOpenDtl(false);
                    handleSearch(1);
                  }}
                >
                  오름차순
                </li>
              </ul>
            </div>

            {/* 건수 */}
            <div className="select select--dark w160">
              <input
                className="select__input"
                type="hidden"
                name="dealer"
                defaultValue={listCountDtl}
              />
              <button
                className="select__toggle"
                type="button"
                onClick={() => {
                  closeAllToggles();
                  setIsListCountSelectOpenDtl(!isListCountSelectOpenDtl);
                }}
              >
                <span className="select__text">{listCountDtl}건씩</span>
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
                style={{ display: isListCountSelectOpenDtl ? "block" : "none" }}
              >
                <li
                  className={`select__option ${listCountDtl === 10 ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setListCountDtl(10);
                    setIsListCountSelectOpenDtl(false);
                  }}
                >
                  10건씩
                </li>
                <li
                  className={`select__option ${listCountDtl === 30 ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setListCountDtl(30);
                    setIsListCountSelectOpenDtl(false);
                  }}
                >
                  30건씩
                </li>
                <li
                  className={`select__option ${listCountDtl === 50 ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setListCountDtl(50);
                    setIsListCountSelectOpenDtl(false);
                  }}
                >
                  50건씩
                </li>
              </ul>
            </div>
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
                    <th>차량번호(신)</th>
                    <td>
                      <div className="input">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder=""
                          value={dtlCarNo}
                          onChange={e => setDtlCarNo(e.target.value)} 
                        />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">
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
                            name="dealer"
                            defaultValue="매도(판매)일"
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
                                ? "매도(판매)일"
                                : dtlDtGubun === "02"
                                  ? "매출발행일"
                                   : dtlDtGubun === "03"
                                    ? "정산처리일"
                                    : dtlDtGubun === "04"
                                      ? "제시(매입)일"
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
                            style={{ display: isDtlDtGubunSelectOpen ? "block" : "none" }}
                          >
                            <li
                              className={`select__option ${dtlDtGubun === "매도(판매)일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("01");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              매도(판매)일
                            </li>
                            <li
                              className={`select__option ${dtlDtGubun === "매출발행일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("02");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              매출발행일
                            </li>
                            <li
                              className={`select__option ${dtlDtGubun === "정산처리일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("03");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              정산처리일
                            </li>
                            <li
                              className={`select__option ${dtlDtGubun === "제시(매입)일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("04");
                                setIsDtlDtGubunSelectOpen(false);
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
                    <th>차량번호(구)</th>
                    <td>
                      <div className="input">
                        <input
                          type="text"
                          className="input__field"
                          placeholder="차량번호(구)"
                          value={dtlCarNoBefore}
                          onChange={e => setDtlCarNoBefore(e.target.value)}
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
                    <th>고객명</th>
                    <td>
                      <div className="input">
                        <input
                          type="text"
                          className="input__field"
                          placeholder="고객명"
                          value={dtlCustomerName}
                          onChange={e => setDtlCustomerName(e.target.value)}
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
                    <th>고객구분</th>
                    <td>
                      <div className="form-option-wrap">
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              name="group-type1" 
                              checked={dtlCustGubun === ""}
                              onChange={() => setDtlCustGubun("")}
                            />
                            <span className="form-option__title">전체</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              name="group-type1"
                              checked={dtlCustGubun === "001"}
                              onChange={() => setDtlCustGubun("001")}
                            />
                            <span className="form-option__title">개인</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              name="group-type1"
                              checked={dtlCustGubun === "002"} 
                              onChange={() => setDtlCustGubun("002")}
                            />
                            <span className="form-option__title">법인</span>
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>매출증빙</th>
                    <td>
                      <div className="form-option-wrap">
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="checkbox"
                              checked={dtlEvdcGubun.includes("1")}
                              onChange={(e) => {
                                if(e.target.checked) {
                                  setDtlEvdcGubun([...dtlEvdcGubun, "1"])
                                } else {
                                  setDtlEvdcGubun(dtlEvdcGubun.filter(item => item !== "1"))
                                }
                              }}
                            />
                            <span className="form-option__title">현금영수증</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="checkbox"
                              checked={dtlEvdcGubun.includes("2")}
                              onChange={(e) => {
                                if(e.target.checked) {
                                  setDtlEvdcGubun([...dtlEvdcGubun, "2"])
                                } else {
                                  setDtlEvdcGubun(dtlEvdcGubun.filter(item => item !== "2"))
                                }
                              }}
                            />
                            <span className="form-option__title">전자세금계산서</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="checkbox"
                              checked={dtlEvdcGubun.includes("3")}
                              onChange={(e) => {
                                if(e.target.checked) {
                                  setDtlEvdcGubun([...dtlEvdcGubun, "3"])
                                } else {
                                  setDtlEvdcGubun(dtlEvdcGubun.filter(item => item !== "3"))
                                }
                              }}
                            />
                            <span className="form-option__title">카드영수증</span>
                          </label>
                        </div>
                      </div>
                    </td>

                    <th>주민(법인)등록번호</th>
                    <td>
                      <div className="input">
                        <input
                          type="text"
                          className="input__field"
                          placeholder="주민(법인)등록번호"
                          value={dtlOwnerSsn}
                          onChange={e => setDtlOwnerSsn(e.target.value)}
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

                    <th>계약서번호</th>
                    <td>
                      <div className="input">
                        <input
                          type="text"
                          className="input__field"
                          placeholder="계약서번호"
                          value={dtlCtshNo}
                          onChange={e => setDtlCtshNo(e.target.value)}
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
                    <th>제시구분</th>
                    <td>
                      <div className="form-option-wrap">
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              name="group-type2" 
                              checked={dtlPrsnGubun === ""}
                              onChange={() => setDtlPrsnGubun("")}
                            />
                            <span className="form-option__title">전체</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              name="group-type2"
                              checked={dtlPrsnGubun === "1"} 
                              onChange={() => setDtlPrsnGubun("1")}
                            />
                            <span className="form-option__title">상사매입</span>
                          </label>
                        </div>

                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              name="group-type2"
                              checked={dtlPrsnGubun === "2"}
                              onChange={() => setDtlPrsnGubun("2")}
                            />
                            <span className="form-option__title">고객위탁</span>
                          </label>
                        </div>
                      </div>
                    </td>
                    <th>사업자등록번호</th>
                    <td>
                      <div className="input">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder="'-' 없이 입력"
                          value={dtlOwnerBrno}
                          onChange={e => setDtlOwnerBrno(e.target.value)}
                        />
                        <div className="input__utils">
                          <button 
                            type="button" 
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setDtlOwnerBrno("")}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                    <th>상태</th>
                    <td>
                      <div className="form-option-wrap">
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              name="group-type"
                              checked={dtlPurStatGubun === "N"}
                              onChange={() => setDtlPurStatGubun("N")}
                            />
                            <span className="form-option__title">정상제시</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              name="group-type"
                              checked={dtlPurStatGubun === "Y"}
                              onChange={() => setDtlPurStatGubun("Y")}
                            />
                            <span className="form-option__title">제시취소(반환)</span>
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {/*
                  <tr>
                    <th>기타 검색</th>
                    <td colSpan={5}>
                      <div className="input-group">
                        <div className="select w200">
                          <input className="select__input" type="hidden" name="dealer" defaultValue="1" />
                          <button className="select__toggle" type="button">
                            <span className="select__text">선택</span>
                            <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                          </button>

                          <ul className="select__menu">
                            <li className="select__option select__option--selected" data-value="1">선택</li>
                            <li className="select__option" data-value="2">선택2</li>
                            <li className="select__option" data-value="2">선택3</li>
                          </ul>
                        </div>

                        <div className="input w200">
                          <input type="text" className="input__field" placeholder="Input" />
                          <div className="input__utils">
                            <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  */}
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
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              router.push("/car-sell/register");
            }}
          >
            <span className="ico ico--add"></span>판매차량 등록
          </button>
          <div className="input-group">
            {/* 딜러명 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="매출발행일" />
              <button
                className="select__toggle"
                type="button"
                onClick={() => {
                  closeAllToggles();
                  setIsOrdItemSelectOpen(!isOrdItemSelectOpen);
                }}
              >
                <span className="select__text">{ordItem || "매출발행일"}</span>
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
                style={{ display: isOrdItemSelectOpen ? "block" : "none" }}
              >
                <li
                  className={`select__option ${ordItem === "매출발행일" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("매출발행일");
                    setIsOrdItemSelectOpen(false);
                    handleSearch(1);
                  }}
                >
                  매출발행일
                </li>
                <li
                  className={`select__option ${ordItem === "판매일" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("판매일");
                    setIsOrdItemSelectOpen(false);
                    handleSearch(1);
                  }}
                >
                  판매일
                </li>
                <li
                  className={`select__option ${ordItem === "정산일" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("정산일");
                    setIsOrdItemSelectOpen(false);
                    handleSearch(1);
                  }}
                >
                  정산일
                </li>
              </ul>
            </div>

            {/* 정렬순서 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="desc" />
              <button
                className="select__toggle"
                type="button"
                onClick={() => {
                  closeAllToggles();
                  setIsOrdAscDescSelectOpen(!isOrdAscDescSelectOpen);
                }}
              >
                <span className="select__text">
                  {ordAscDesc === "desc" ? "내림차순" : "오름차순"}
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
                style={{ display: isOrdAscDescSelectOpen ? "block" : "none" }}
              >
                <li
                  className={`select__option ${ordAscDesc === "desc" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdAscDesc("desc");
                    setIsOrdAscDescSelectOpen(false);
                    handleSearch(1);
                  }}
                >
                  내림차순
                </li>
                <li
                  className={`select__option ${ordAscDesc === "asc" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdAscDesc("asc");
                    setIsOrdAscDescSelectOpen(false);
                    handleSearch(1);
                  }}
                >
                  오름차순
                </li>
              </ul>
            </div>

            {/* 건수 */}
            <div className="select select--dark w160">
              <input
                className="select__input"
                type="hidden"
                name="dealer"
                defaultValue={listCount}
              />
              <button
                className="select__toggle"
                type="button"
                onClick={() => {
                  closeAllToggles();
                  setIsListCountSelectOpen(!isListCountSelectOpen);
                }}
              >
                <span className="select__text">{listCount}건씩</span>
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
                style={{ display: isListCountSelectOpen ? "block" : "none" }}
              >
                <li
                  className={`select__option ${listCount === 10 ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setListCount(10);
                    setIsListCountSelectOpen(false);
                  }}
                >
                  10건씩
                </li>
                <li
                  className={`select__option ${listCount === 30 ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setListCount(30);
                    setIsListCountSelectOpen(false);
                  }}
                >
                  30건씩
                </li>
                <li
                  className={`select__option ${listCount === 50 ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setListCount(50);
                    setIsListCountSelectOpen(false);
                  }}
                >
                  50건씩
                </li>
              </ul>
            </div>

            <SimpleTableDownloadButton 
              data={carList}
              columns={excelColumns}
              numericColumns={numericColumns}
              filePrefix="판매리스트"
              className="btn btn--white"
              text="다운로드"
              sheetName="판매"
            />
          </div>
        </div>

        <table className="table">
          <colgroup>
            <col style={{ width: "auto" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "auto" }} />
            {/*고객명*/}
            <col style={{ width: "130px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "125px" }} />
            {/*매도일*/}
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
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
                    <p>차량번호 / 담당딜러 / 차량명 / 매입일 / 매입금액</p>
                  </div>
                </div>
              </th>
              <th>제시구분</th>
              <th>매도유형</th>
              <th>판매딜러</th>
              <th>고객명</th>
              <th>판매금액</th>
              <th>성능보험료</th>
              <th>상사매도비</th>
              <th>판매일</th>
              <th>바로가기</th>
              <th>매출등록일</th>
              <th>정산일</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
            {carList.map((item, index) => (
            <tr key={index}>
              <td>{item.CAR_NO} / {item.DLR_NM} / {item.CAR_NM} / {item.CAR_PUR_DT} / {item.PUR_AMT.toLocaleString()}</td>
              <td>{item.CAR_STAT_NM}</td>
              <td>{item.SALE_TP_NM}</td>
              <td>{item.SEL_DLR_NM}</td>
              <td>{item.BUYER_NM}</td>
              <td>{item.SALE_AMT.toLocaleString()}</td>
              <td>{item.PERF_INFE_AMT.toLocaleString()}</td>
              <td>{item.AGENT_SEL_COST.toLocaleString()}</td>
              <td>{item.CAR_SALE_DT}</td> 

              <td>
                <div className="input-group input-group--sm input-group--center">
                  <div className="select select--utils">
                    <button type="button" className="select__toggle">더보기</button>

                    <ul className="select__menu">
                      <li className="select__option">
                      <Link href={`/purchases/edit/${item.CAR_REG_ID}`}>매입 수정</Link>
                      </li>
                      <li className="select__option">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openModal("1");
                          }}
                        >
                          판매 취소
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn--light btn--sm"
                  onClick={() => {
                    window.location.href = "#";
                  }}
                >
                  매출등록
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn--light btn--sm"
                  onClick={() => {
                    window.location.href = "#";
                  }}
                >
                  정산처리
                </button>
              </td>

              <td>
                <button
                  type="button"
                  className="btn btn--light btn--sm"
                  onClick={() => router.push("/detail/car-sell/1")}
                >
                  상세보기
                </button>
              </td>
            </tr>
            ))}
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
              <th>구분</th>
              <th>건수</th>
              <th>매입금액</th>
              <th>재고금융</th>
              <th>판매금액</th>
              <th>성능보험료</th>
              <th>상사매도비</th>
            </tr>
          </thead>
          <tbody>
          {carSellSummary?.map((item, index) => (
                index < 2 && (
                  <tr key={index}>
                    <td>{item.PRSN_SCT_NM}</td>
                    <td>{item.CNT.toLocaleString()}</td>
                    <td>{item.PUR_AMT.toLocaleString()}</td>
                    <td>{item.CAR_LOAN_AMT.toLocaleString()}</td>
                    <td>{item.SALE_AMT.toLocaleString()}</td>
                    <td>{item.AGENT_SEL_COST.toLocaleString()}</td>
                    <td>{item.PERF_INFE_AMT.toLocaleString()}</td>
                  </tr>
                )
              ))}
          </tbody>
          <tfoot>
            {carSellSummary?.map((item, index) => (
              index === 2 && (
                <tr key={index}>
                  <th>{item.PRSN_SCT_NM}</th>
                  <th>{item.CNT.toLocaleString()}</th>
                  <th>{item.PUR_AMT.toLocaleString()}</th>
                  <th>{item.CAR_LOAN_AMT.toLocaleString()}</th>
                  <th>{item.SALE_AMT.toLocaleString()}</th>
                  <th>{item.AGENT_SEL_COST.toLocaleString()}</th>
                  <th>{item.PERF_INFE_AMT.toLocaleString()}</th>
                </tr>
              )
            ))}
          </tfoot>
        </table>
      </div>
    </main>
  );
}
