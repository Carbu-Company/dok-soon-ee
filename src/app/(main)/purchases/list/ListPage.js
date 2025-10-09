"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PurchaseRemoveModal from "@/components/modal/PurchaseRemoveModal";
import Pagination from "@/components/ui/pagination";
import SimpleTableDownloadButton from "@/components/utils/SimpleTableDownloadButton";
import { useRouter } from "next/navigation";

export default function ListPage(props) {
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
  const initialPurchasesSummary = props.purchasesSummary?.data || [];

  const [carList, setCarList] = useState(initialCarListData);
  const [pagination, setPagination] = useState(initialPagination);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages || 1);

  const [purchasesSummary, setPurchasesSummary] = useState(initialPurchasesSummary);

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
    handleSearch(1);
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
          setPurchasesSummary(summaryData);

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

  // 파라미터를 받아서 검색하는 함수
  const handleSearchWithParams = async (pageNum = 1, customParams = null) => {
    console.log("파라미터 검색 실행", { pageNum, customParams });

    try {
      setLoading(true);

      if (typeof searchAction === "function") {
        const searchParamsWithPage = {
          ...getDefaultParams(pageNum),
          ...(customParams || searchParams),
        };

        console.log('서버 액션 호출 파라미터:', searchParamsWithPage);
        const result = await searchAction(searchParamsWithPage);
        console.log('서버 액션 응답:', result);

        if (result && result.success) {
          const responseData = result.data?.list?.carlist || [];
          const paginationInfo = result.data?.list?.pagination || {};
          const summaryData = result.data?.summary || [];

          setCarList(responseData);
          setPagination(paginationInfo);
          setPurchasesSummary(summaryData);

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
  const handleDtlSearch = async () => {
    setSearchBtn(2);
    
    // 상세 검색 파라미터를 직접 구성하여 검색
    const detailSearchParams = {
      carNo: dtlCarNo,
      dealer: dtlDealer,
      dtGubun: dtlDtGubun,
      startDt: dtlStartDt,
      endDt: dtlEndDt,
      dtlCustomerName: dtlCustomerName,
      dtlCustGubun: dtlCustGubun,
      dtlEvdcGubun: dtlEvdcGubun,
      dtlPrsnGubun: dtlPrsnGubun,
      dtlOwnerBrno: dtlOwnerBrno,
      dtlOwnerSsn: dtlOwnerSsn,
      dtlCtshNo: dtlCtshNo,
      dtlCarNoBefore: dtlCarNoBefore,
      orderItem: ordItem,
      ordAscDesc: ordAscDesc,
    };

    await handleSearchWithParams(1, detailSearchParams);
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
    setOrdItem("제시일");
    setOrdAscDesc("desc");
    setListCount(10);
    setOrdItemDtl("제시일");
    setOrdAscDescDtl("desc");
    setListCountDtl(10);

    // 검색 버튼을 기본 검색으로 설정
    setSearchBtn(1);

    console.log("검색 조건이 초기화되었습니다.");
  };

  // 엑셀 다운로드용 컬럼 정의
  const excelColumns = [
    { accessorKey: "CAR_PUR_DT", header: "제시일" },
    { accessorKey: "PRSN_SCT_CD", header: "구분" },
    { accessorKey: "CAR_NO", header: "차량번호" },
    { accessorKey: "CAR_NM", header: "차명" },
    { accessorKey: "PUR_AMT", header: "제시금액" },
    { accessorKey: "DLR_NM", header: "담당딜러" },
    { accessorKey: "CAR_LOAN_AMT", header: "재고금융" },
    { accessorKey: "TOT_CMRC_COST_FEE", header: "상품화비용" },
    { accessorKey: "AGENT_PUR_CST", header: "상사매입비" },
    { accessorKey: "TXBL_ISSU_DT", header: "조합매도일" }
  ];

  // 숫자 형식으로 처리할 컬럼들
  const numericColumns = ["PUR_AMT", "CAR_LOAN_AMT", "TOT_CMRC_COST_FEE", "AGENT_PUR_CST"];


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">매입차량 리스트</h2>
        <div className="guidebox">
          <p className="guidebox__title">이용안내</p>
          <p className="guidebox__desc">
            ※ 신규 제시 등록 및 현재 제시 상태의 차량을 관리할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">매입차량 검색</h2>
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
                    defaultValue="선택"
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
                      defaultValue="제시(매입)일"
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
                          ? "제시(매입)일"
                          : dtGubun === "02"
                            ? "이전일"
                            : dtGubun === "03"
                              ? "똑순이등록일"
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
                        className={`select__option ${dtGubun === "제시(매입)일" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("01");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        제시(매입)일
                      </li>
                      <li
                        className={`select__option ${dtGubun === "이전일" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("02");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        이전일
                      </li>
                      <li
                        className={`select__option ${dtGubun === "똑순이등록일" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("03");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        똑순이등록일
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
                <input className="select__input" type="hidden" name="ordItemDtl" defaultValue="제시일" />
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
                      setOrdItemDtl("제시일");
                      setIsOrdItemSelectOpenDtl(false);
                      handleSearch(1);
                    }}
                  >
                    제시일
                  </li>
                  <li
                    className={`select__option ${ordItemDtl === "담당딜러" ? "select__option--selected" : ""}`}
                    onClick={() => {
                      setOrdItemDtl("담당딜러");
                      setIsOrdItemSelectOpenDtl(false);
                      handleSearch(1);
                    }}
                  >
                    담당딜러
                  </li>
                  <li
                    className={`select__option ${ordItemDtl === "제시구분" ? "select__option--selected" : ""}`}
                    onClick={() => {
                      setOrdItemDtl("제시구분");
                      setIsOrdItemSelectOpenDtl(false);
                      handleSearch(1);
                    }}
                  >
                    제시구분
                  </li>
                  <li
                    className={`select__option ${ordItemDtl === "고객유형" ? "select__option--selected" : ""}`}
                    onClick={() => {
                      setOrdItemDtl("고객유형");
                      setIsOrdItemSelectOpenDtl(false);
                      handleSearch(1);
                    }}
                  >
                    고객유형
                  </li>
                </ul>
              </div>

              {/* 정렬순서 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="ordAscDescDtl" defaultValue="desc" />
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
                  name="listCountDtl"
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
                    <th>차량번호(매입후)</th>
                    <td>
                      <div className="input">
                        <input
                          type="text"
                          className="input__field"
                          placeholder="차량번호(매입후)"
                          value={dtlCarNo}
                          onChange={e => setDtlCarNo(e.target.value)}
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
                            defaultValue="제시(매입)일"
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
                                ? "제시(매입)일"
                                : dtlDtGubun === "02"
                                  ? "이전일"
                                  : dtlDtGubun === "03"
                                    ? "똑순이등록일"
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
                              className={`select__option ${dtlDtGubun === "제시(매입)일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("01");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              제시(매입)일
                            </li>
                            <li
                              className={`select__option ${dtlDtGubun === "이전일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("02");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              이전일
                            </li>
                            <li
                              className={`select__option ${dtlDtGubun === "똑순이등록일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("03");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              똑순이등록일
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
                    <th>차량번호(매입전)</th>
                    <td>
                      <div className="input">
                        <input
                          type="text"
                          className="input__field"
                          placeholder="차량번호(매입전)"
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
                            setIsDtlCustGubunSelectOpen(!isDtlCustGubunSelectOpen);
                          }}
                        >
                          <span className="select__text">
                            {dtlCustGubun === "01"
                              ? "개인"
                              : dtlCustGubun === "02"
                                ? "법인"
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
                          style={{ display: isDtlCustGubunSelectOpen ? "block" : "none" }}
                        >
                          <li
                            className={`select__option ${dtlCustGubun === "" ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtlCustGubun("");
                              setIsDtlCustGubunSelectOpen(false);
                            }}
                          >
                            선택
                          </li>
                          <li
                            className={`select__option ${dtlCustGubun === "01" ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtlCustGubun("01");
                              setIsDtlCustGubunSelectOpen(false);
                            }}
                          >
                            개인
                          </li>
                          <li
                            className={`select__option ${dtlCustGubun === "02" ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtlCustGubun("02");
                              setIsDtlCustGubunSelectOpen(false);
                            }}
                          >
                            법인
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th>증빙종류</th>
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
                              checked={dtlPrsnGubun === ""}
                              name="group-type"
                              onChange={() => setDtlPrsnGubun("")}
                            />
                            <span className="form-option__title">전체</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input
                              type="radio"
                              name="group-type"
                              checked={dtlPrsnGubun === "01"}
                              onChange={() => setDtlPrsnGubun("01")}
                            />
                            <span className="form-option__title">상사매입</span>
                          </label>
                        </div>

                        <div className="form-option">
                          <label className="form-option__label">
                            <input
                              type="radio"
                              name="group-type"
                              checked={dtlPrsnGubun === "02"}
                              onChange={() => setDtlPrsnGubun("02")}
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
                          placeholder="사업자등록번호"
                          value={dtlOwnerBrno}
                          onChange={e => setDtlOwnerBrno(e.target.value)}
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
                    <th></th>
                    <td></td>
                  </tr>

                  {/* 기타 검색 (주석 처리) */}
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
          매입차량 리스트<span>Total {pagination?.totalCount || carList?.length || 0}건</span>
        </h2>
        <div className="table-wrap__head table-wrap__title">
          <button
            type="button"
            className="btn btn--red"
            onClick={() => (window.location.href = "/purchases/register")}
          >
            <span className="ico ico--add"></span>매입차량 직접등록
          </button>
          <div className="input-group">
            {/* 딜러명 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="제시일" />
              <button
                className="select__toggle"
                type="button"
                onClick={() => {
                  closeAllToggles();
                  setIsOrdItemSelectOpen(!isOrdItemSelectOpen);
                }}
              >
                <span className="select__text">{ordItem || "제시일"}</span>
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
                  className={`select__option ${ordItem === "제시일" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("제시일");
                    setIsOrdItemSelectOpen(false);
                    handleSearch(1);
                  }}
                >
                  제시일
                </li>
                <li
                  className={`select__option ${ordItem === "담당딜러" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("담당딜러");
                    setIsOrdItemSelectOpen(false);
                    handleSearch(1);
                  }}
                >
                  담당딜러
                </li>
                <li
                  className={`select__option ${ordItem === "제시구분" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("제시구분");
                    setIsOrdItemSelectOpen(false);
                    handleSearch(1);
                  }}
                >
                  제시구분
                </li>
                <li
                  className={`select__option ${ordItem === "고객유형" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("고객유형");
                    setIsOrdItemSelectOpen(false);
                    handleSearch(1);
                  }}
                >
                  고객유형
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
              filePrefix="매입리스트"
              className="btn btn--white"
              text="다운로드"
              sheetName="매입리스트"
            />
          </div>
        </div>

        <table className="table">
          <colgroup>
            <col style={{ width: "150px" }} />
            <col style={{ width: "70px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>제시일</th>
              <th>구분</th>
              <th>차량번호</th>
              <th>차명</th>
              <th>제시금액</th>
              <th>담당딜러</th>
              <th>재고금융</th>
              <th>상품화비용</th>
              <th>상사매입비</th>
              <th>조합매도일</th>
              <th>바로가기</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
            {carList && carList.length > 0 ? (
              carList.map((car, index) => (
                <tr
                  key={`${car.CAR_REG_ID}-${index}`}
                  className="hover:bg-purple-900/10 cursor-pointer"
                >
                  <td>{car.CAR_PUR_DT}</td>
                  <td>
                    {car.PRSN_SCT_CD === "0" ? "상사" : <span style={{ color: "red" }}>고객</span>}
                  </td>
                  <td>{car.CAR_NO}</td>
                  <td>{car.CAR_NM}</td>
                  <td>{car.PUR_AMT.toLocaleString()}</td>
                  <td>{car.DLR_NM}</td>
                  <td>{car.CAR_LOAN_AMT.toLocaleString()}</td>
                  <td>{car.TOT_CMRC_COST_FEE.toLocaleString()}</td>
                  <td>{car.AGENT_PUR_CST.toLocaleString()}</td>
                  <td>{car.TXBL_ISSU_DT}</td>
                  <td>
                    <div className="input-group input-group--sm input-group--center">
                      <div className="select select--utils">
                        <button
                          type="button"
                          className="select__toggle"
                          onClick={e => e.stopPropagation()}
                        >
                          더보기
                        </button>

                        <ul className="select__menu">
                          <li className="select__option">
                            <button
                              type="button"
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(
                                  `/car-goods/register?carId=${car.CAR_REG_ID}&openModal=true`
                                );
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
                              상품화비용 등록
                            </button>
                          </li>
                          <li className="select__option">
                            <Link href="/inventory-finance/inventory-list">재고금융 등록</Link>
                          </li>
                          <li className="select__option">
                            <Link href="#">판매 처리</Link>
                          </li>
                          <li className="select__option">
                            <Link href={`/purchases/edit/${car.CAR_REG_ID}`}>매입 수정</Link>
                          </li>
                          <li className="select__option">
                            <button
                              type="button"
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePurchaseRemoveModalOpen(car, "cancel");
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
                              매입 취소
                            </button>
                          </li>
                          <li className="select__option">
                            <button
                              type="button"
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePurchaseRemoveModalOpen(car, "delete");
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
                              매입 삭제
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--light btn--sm"
                      onClick={e => e.stopPropagation()}
                    >
                      <Link
                        href={`/detail/purchases/${car.CAR_REG_ID}`}
                        onClick={e => e.stopPropagation()}
                      >
                        상세보기
                      </Link>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center py-8 text-gray-500">
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
        <h2 className="table-wrap__title">제시(매입)차량 현황</h2>
        <table className="table">
          <thead>
            <tr>
              <th rowSpan={2}>구분</th>
              <th rowSpan={2}>건수</th>
              <th colSpan={3} className="col-half">
                매입금액
              </th>
              <th rowSpan={2}>재고금융</th>
              <th rowSpan={2}>매입비</th>
            </tr>
            <tr>
              <th className="col-half">공급가</th>
              <th className="col-half">부가세</th>
              <th className="col-half">합계금액</th>
            </tr>
          </thead>
          <tbody>
            {purchasesSummary && purchasesSummary.length > 0 ? (
              purchasesSummary.map((carSummary, index) => (
                <tr key={index}>
                  <td>{carSummary.PRSN_SCT_CD}</td>
                  <td>{carSummary.CNT.toLocaleString()}</td>
                  <td>{carSummary.PUR_AMT.toLocaleString()}</td>
                  <td>{carSummary.PUR_SUP_PRC.toLocaleString()}</td>
                  <td>{carSummary.PUR_VAT.toLocaleString()}</td>
                  <td className={carSummary.CAR_LOAN_AMT < 0 ? "text-red" : ""}>
                    {carSummary.CAR_LOAN_AMT.toLocaleString()}
                  </td>
                  <td>
                    <span className={carSummary.AGENT_PUR_CST < 0 ? "text-point" : ""}>
                      {carSummary.AGENT_PUR_CST}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  데이터가 존재하지 않습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 매입취소/삭제 모달 */}
      <PurchaseRemoveModal
        car={selectedCarForRemove}
        flagType={selectedCarTypeForRemove}
        open={isPurchaseRemoveModalOpen}
        onClose={handlePurchaseRemoveModalClose}
        onConfirm={handlePurchaseRemoveConfirm}
      />
    </main>
  );
}
