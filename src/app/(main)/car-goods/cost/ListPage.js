"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Pagination from "@/components/ui/pagination";
import CarSearchModal from "@/components/modal/CarSearchModal";
import SimpleTableDownloadButton from "@/components/utils/SimpleTableDownloadButton";
import Image from "next/image";

export default function ProductCostList(props) {
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
  const initialGoodsFeeCarSummary = props.carSummary?.data || [];

  const [carList, setCarList] = useState(initialCarListData);
  const [pagination, setPagination] = useState(initialPagination);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages || 1);

  const [goodsFeeCarSummary, setGoodsFeeCarSummary] = useState(initialGoodsFeeCarSummary);

  const [dealerList, setDealerList] = useState(props.dealerList || []);
  const [expdItemList, setExpdItemList] = useState(props.expdItemList || []);
  const [expdEvdcList, setExpdEvdcList] = useState(props.expdEvdcList || []);
  
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
  const [isGoodsFeeCarRemoveModalOpen, setIsGoodsFeeCarRemoveModalOpen] = useState(false);
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
    // handleSearch(1); // 자동 검색 비활성화
    console.log("pageSize", pageSize);
    console.log("listCount", listCount);
  }, [ordItem, ordAscDesc, listCount]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 상세 검색 영역
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
    // handleSearch(1); // 자동 검색 비활성화
    console.log("pageSize", pageSize);
    console.log("listCount", listCountDtl);
  }, [ordItemDtl, ordAscDescDtl, listCountDtl]);

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

  // 상세 검색 차량번호(신)
  const [dtlNewCarNo, setDtlNewCarNo] = useState("");

  // 상세 검색 차량번호(구)
  const [dtlOldCarNo, setDtlOldCarNo] = useState("");

  // 과세 구분
  const [dtlTaxGubun, setDtlTaxGubun] = useState("");
  const [isDtlTaxGubunSelectOpen, setIsDtlTaxGubunSelectOpen] = useState(false);

  // 상세 검색 지출항목
  const [dtlExpdItem, setDtlExpdItem] = useState("");
  const [isDtlExpdItemSelectOpen, setIsDtlExpdItemSelectOpen] = useState(false);

  // 상세 검색 과세/면세 구분
  const [dtlExpdEvdc, setDtlExpdEvdc] = useState("");
  const [isDtlExpdEvdcSelectOpen, setIsDtlExpdEvdcSelectOpen] = useState(false);

  // 상세 검색 지출구분
  const [dtlExpdGubun, setDtlExpdGubun] = useState("");

  // 상세 검색 비고/지출처
  const [dtlRmrk, setDtlRmrk] = useState("");

  // 상세 검색 반영/제외 구분
  const [dtlAdjInclusYN, setDtlAdjInclusYN] = useState("");

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
    setIsDtlTaxGubunSelectOpen(false);
    setIsDtlExpdItemSelectOpen(false);
    setIsDtlExpdEvdcSelectOpen(false);
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
    dtlOldCarNo: dtlOldCarNo,
    dtlNewCarNo: dtlNewCarNo,
    dtlExpdItem: dtlExpdItem,
    dtlTaxGubun: dtlTaxGubun,
    dtlExpdGubun: dtlExpdGubun,
    dtlExpdEvdc: dtlExpdEvdc,
    dtlRmrk: dtlRmrk,
    dtlAdjInclusYN: dtlAdjInclusYN,
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
          setGoodsFeeCarSummary(summaryData);

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

  /**
   * 페이지 처리
   */
  const handlePageChange = async page => {
    await handleSearch(page);
  };


  // 엑셀 다운로드용 컬럼 정의
  const excelColumns = [
    { accessorKey: "CAR_NO", header: "차량번호" },
    { accessorKey: "DLR_NM", header: "담당딜러" },
    { accessorKey: "CAR_NM", header: "차량명" },
    { accessorKey: "CAR_PUR_DT", header: "매입일" },
    { accessorKey: "PUR_AMT", header: "매입금액" },

    { accessorKey: "TAX_SCT_NM", header: "비용항목" },
    { accessorKey: "EXPD_SCT_NM", header: "지출구분" },
    { accessorKey: "TAX_SCT_NM", header: "과세구분" },


    { accessorKey: "EXPD_AMT", header: "금액" },
    { accessorKey: "EXPD_SUP_PRC", header: "공급가" },
    { accessorKey: "EXPD_VAT", header: "부가세" },
    { accessorKey: "ADJ_INCLUS_YN", header: "정산반영" },
    { accessorKey: "EXPD_DT", header: "결제일" },
    { accessorKey: "EXPD_EVDC_NM", header: "지출증빙" }
  ];

  // 숫자 형식으로 처리할 컬럼들
  const numericColumns = ["EXPD_AMT", "EXPD_SUP_PRC", "EXPD_VAT"];


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">상품화비용 리스트(비용별)</h2>

        <div className="guidebox">
          <p className="guidebox__title">차량 : 상품화항목 = 1 : N</p>
          <p className="guidebox__desc">※ 상품화비용을 차량별, 상품화 비용건별 확인이 가능합니다.</p>
          <p className="guidebox__desc">
            ※ 상품화 비용은 일반적으로 상사 매입 자료로 비용 처리하여 세무상 반영할 수 있습니다. 다만, 적격 증빙 여부 등 구체적인 사항은 세무사 사무실에 확인하시기 바랍니다.
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
                  <input type="text" className="input__field" placeholder="차량번호(매입전/후)" value={carNo} onChange={e => setCarNo(e.target.value)} />
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
                    onClick={() => setIsDealerSelectOpen(!isDealerSelectOpen)}
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
                            ? "상품화등록일"
                            : dtGubun === "03"
                              ? "매도(판매)일"
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
                        className={`select__option ${dtGubun === "상품화등록일" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("02");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        상품화등록일
                      </li>
                      <li
                        className={`select__option ${dtGubun === "매도(판매)일" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("03");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        매도(판매)일
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
              <button className="btn btn--white" type="button">
                <span className="ico ico--reset"></span>선택 초기화
              </button>

            {/* 항목 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="제시(매입)일" />
              <button
                className="select__toggle"
                type="button"
                onClick={() => {
                  closeAllToggles();
                  setIsOrdItemSelectOpenDtl(!isOrdItemSelectOpenDtl);
                }}
              >
                <span className="select__text">{ordItemDtl || "제시(매입)일"}</span>
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
                  className={`select__option ${ordItemDtl === "제시(매입)일" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItemDtl("제시(매입)일");
                    setIsOrdItemSelectOpenDtl(false);
                    // handleSearch(1); // 자동 검색 비활성화
                  }}
                >
                  제시(매입)일
                </li>
                <li
                  className={`select__option ${ordItemDtl === "차량번호" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItemDtl("차량번호");
                    setIsOrdItemSelectOpenDtl(false);
                    // handleSearch(1); // 자동 검색 비활성화
                  }}
                >
                  차량번호
                </li>
                <li
                  className={`select__option ${ordItemDtl === "상품화등록일" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItemDtl("상품화등록일");
                    setIsOrdItemSelectOpenDtl(false);
                    // handleSearch(1); // 자동 검색 비활성화
                  }}
                >
                  상품화등록일
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
                    // handleSearch(1); // 자동 검색 비활성화
                  }}
                >
                  내림차순
                </li>
                <li
                  className={`select__option ${ordAscDescDtl === "asc" ? "select__option--selected" : ordAscDescDtl === "desc" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdAscDescDtl("asc");
                    setIsOrdAscDescSelectOpenDtl(false);
                    // handleSearch(1); // 자동 검색 비활성화
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
                          placeholder="차량번호(신)"
                          value={dtlNewCarNo}
                          onChange={e => setDtlNewCarNo(e.target.value)}
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
                              className={`select__option ${dtlDtGubun === "상품화등록일일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("02");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              상품화등록일
                            </li>
                            <li
                              className={`select__option ${dtlDtGubun === "매도(판매)일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("03");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              매도(판매)일
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
                    <th>차량번호(구)</th>
                    <td>
                      <div className="input">
                        <input
                          type="text"
                          className="input__field"
                          placeholder="차량번호(구)"
                          value={dtlOldCarNo}
                          onChange={e => setDtlOldCarNo(e.target.value)}
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

                    <th>비용항목</th>
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
                            setIsDtlExpdItemSelectOpen(!isDtlExpdItemSelectOpen);
                          }}
                        >
                          <span className="select__text">
                            {dtlExpdItem 
                              ? expdItemList.find(c => c.CD === dtlExpdItem)?.CD_NM || "선택"
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
                          style={{ display: isDtlExpdItemSelectOpen ? "block" : "none" }}
                        >
                          <li 
                            className={`select__option ${!dtlExpdItem ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtlExpdItem("");
                              setIsDtlExpdItemSelectOpen(false);
                            }}
                          >
                            선택
                          </li>
                          {expdItemList.map((code) => (
                            <li
                              key={code.CD}
                              className={`select__option ${dtlExpdItem === code.CD ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlExpdItem(code.CD);
                                setIsDtlExpdItemSelectOpen(false);
                              }}
                            >
                              {code.CD_NM}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>

                    <th>과세구분</th>
                    <td>
                      <div className="form-option-wrap">
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              checked={dtlTaxGubun === ""} 
                              onChange={() => setDtlTaxGubun("")}
                              name="group-type2" 
                            />
                            <span className="form-option__title">전체</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              checked={dtlTaxGubun === "1"}
                              onChange={() => setDtlTaxGubun("1")}
                              name="group-type2" 
                            />
                            <span className="form-option__title">과세</span>
                          </label>
                        </div>

                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              checked={dtlTaxGubun === "2"}
                              onChange={() => setDtlTaxGubun("2")}
                              name="group-type2" 
                            />
                            <span className="form-option__title">면세</span>
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>지출구분</th>
                    <td>
                      <div className="form-option-wrap">
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              checked={dtlExpdGubun === ""} 
                              onChange={() => setDtlExpdGubun("")}
                              name="group-type" 
                            />
                            <span className="form-option__title">전체</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio"
                              checked={dtlExpdGubun === "1"}
                              onChange={() => setDtlExpdGubun("1")} 
                              name="group-type" 
                            />
                            <span className="form-option__title">상사지출</span>
                          </label>
                        </div>

                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio"
                              checked={dtlExpdGubun === "2"}
                              onChange={() => setDtlExpdGubun("2")}
                              name="group-type" 
                            />
                            <span className="form-option__title">딜러지출</span>
                          </label>
                        </div>
                      </div>
                    </td>
                    <th>지출증빙</th>
                    <td>
                      <div className="select">
                        <input
                          className="select__input"
                          type="hidden"
                          name="expdEvdc"
                          value={dtlExpdEvdc}
                          onChange={(e) => setDtlExpdEvdc(e.target.value)}
                        />
                        <button 
                          className="select__toggle" 
                          type="button"
                          onClick={() => {
                            closeAllToggles();
                            setIsDtlExpdEvdcSelectOpen(!isDtlExpdEvdcSelectOpen);
                          }}
                        >
                          <span className="select__text">
                            {dtlExpdEvdc ? expdEvdcList.find(item => item.CD === dtlExpdEvdc)?.CD_NM : '선택'}
                          </span>
                          <img
                            className="select__arrow"
                            src="/images/ico-dropdown.svg"
                            alt=""
                          />
                        </button>

                        <ul className={`select__menu ${isDtlExpdEvdcSelectOpen ? 'active' : ''}`}>
                          <li
                            className={`select__option ${!dtlExpdEvdc ? 'select__option--selected' : ''}`}
                            onClick={() => {
                              setDtlExpdEvdc('');
                              setIsDtlExpdEvdcSelectOpen(false);
                            }}
                          >
                            선택
                          </li>
                          {expdEvdcList.map((item) => (
                            <li 
                              key={item.CD}
                              className={`select__option ${dtlExpdEvdc === item.CD ? 'select__option--selected' : ''}`}
                              onClick={() => {
                                setDtlExpdEvdc(item.CD);
                                setIsDtlExpdEvdcSelectOpen(false);
                              }}
                            >
                              {item.CD_NM} 
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                    <th>비고/지출처</th>
                    <td>
                      <div className="input">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder=""
                          value={dtlRmrk}
                          onChange={(e) => setDtlRmrk(e.target.value)}
                        />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setDtlRmrk('')}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>정산반영여부</th>
                    <td>
                      <div className="form-option-wrap">
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              checked={dtlAdjInclusYN === ""} 
                              onChange={() => setDtlAdjInclusYN("")}
                              name="group-type3" 
                            />
                            <span className="form-option__title">전체</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              checked={dtlAdjInclusYN === "Y"}
                              onChange={() => setDtlAdjInclusYN("Y")}
                              name="group-type3" 
                            />
                            <span className="form-option__title">반영</span>
                          </label>
                        </div>

                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              checked={dtlAdjInclusYN === "N"}
                              onChange={() => setDtlAdjInclusYN("N")}
                              name="group-type3" 
                            />
                            <span className="form-option__title">제외</span>
                          </label>
                        </div>
                      </div>
                    </td>
                    <th></th>
                    <td></td>
                    <th></th>
                    <td></td>
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
                <button className="jsSearchboxBtn btn btn--light" type="button">
                  취소
                </button>
                <button   
                  className="btn btn--primary" type="button" 
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
              router.push("/car-goods/register");
            }}
          >
            <span className="ico ico--add"></span>상품화비용 등록
          </button>
          <div className="input-group">
            {/* 정렬 항목 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue={ordItem} />
              <button
                className="select__toggle"
                type="button"
                onClick={() => {
                  closeAllToggles();
                  setIsOrdItemSelectOpen(!isOrdItemSelectOpen);
                }}
              >
                <span className="select__text">
                  {ordItem === "01" ? "등록일" : 
                   ordItem === "02" ? "결제일" :
                   ordItem === "03" ? "지출구분" :
                   ordItem === "04" ? "과세구분" : "등록일"}
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
                style={{ display: isOrdItemSelectOpen ? "block" : "none" }}
              >
                <li
                  className={`select__option ${ordItem === "01" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("01");
                    setIsOrdItemSelectOpen(false);
                    // handleSearch(1); // 자동 검색 비활성화
                  }}
                >
                  등록일
                </li>
                <li
                  className={`select__option ${ordItem === "02" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("02");
                    setIsOrdItemSelectOpen(false);
                    // handleSearch(1); // 자동 검색 비활성화
                  }}
                >
                  결제일
                </li>
                <li
                  className={`select__option ${ordItem === "03" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("03");
                    setIsOrdItemSelectOpen(false);
                    // handleSearch(1); // 자동 검색 비활성화
                  }}
                >
                  지출구분
                </li>
                <li
                  className={`select__option ${ordItem === "04" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("04");
                    setIsOrdItemSelectOpen(false);
                    // handleSearch(1); // 자동 검색 비활성화
                  }}
                >
                  과세구분
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
                    // handleSearch(1); // 자동 검색 비활성화
                  }}
                >
                  내림차순
                </li>
                <li
                  className={`select__option ${ordAscDesc === "asc" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdAscDesc("asc");
                    setIsOrdAscDescSelectOpen(false);
                    // handleSearch(1); // 자동 검색 비활성화
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
              filePrefix="상품화비용(비용별)리스트"
              className="btn btn--white"
              text="다운로드"
              sheetName="상품화비용"
            />
          </div>
        </div>

        {/* 차량별 리스트 s */}
        <table className="table">
          <colgroup>
            <col style={{ width: "auto" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>
                차량정보
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico"><span className="ico ico--help">보기</span></button>
                  <div className="tooltip__box">
                    <p>차량번호 / 담당딜러 / 차량명 / 매입일 / 매입금액</p>
                  </div>
                </div>
              </th>

              <th>비용항목</th>
              <th>지출구분</th>
              <th>과세구분</th>

              <th>금액</th>
              <th>공급가</th>
              <th>부가세</th>
              <th>정산반영</th>
              <th>결제일</th>
              <th>지출증빙</th>

              <th>바로가기</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
            {carList.map((car, index) => (
              <tr key={index}>
                <td>{car.CAR_NO} / {car.DLR_NM} / {car.CAR_NM} / {car.CAR_PUR_DT} / {car.PUR_AMT.toLocaleString()}</td>

                <td>{car.TAX_SCT_NM}</td>
                <td>{car.EXPD_SCT_NM}</td>
                <td>{car.TAX_SCT_NM}</td>

                <td>{car.EXPD_AMT.toLocaleString()}</td>
                <td>{car.EXPD_SUP_PRC.toLocaleString()}</td>
                <td>{car.EXPD_VAT.toLocaleString()}</td>

                <td>{car.ADJ_INCLUS_YN}</td>
                <td>{car.EXPD_DT.toLocaleString()}</td>
                <td>{car.EXPD_EVDC_NM}</td>

                <td>
                  <div className="input-group input-group--sm input-group--center">
                    <div className="select select--utils">
                      <button type="button" className="select__toggle">더보기</button>

                      <ul className="select__menu">
                        <li className="select__option">
                          <a href="m2.jsp">상품화비용 수정</a>
                        </li>

                        <li className="select__option">
                          <a href="javascript:openModal('2');">상품화비용 삭제</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn--light btn--sm"
                    onClick={() => router.push(`/detail/car-goods/${car.id}`)}
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 차량별 리스트 e */}

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
              <th rowSpan={2}>구분</th>
              <th rowSpan={2}>건수</th>
              <th colSpan={3} className="col-half">
                상품화비용
              </th>
            </tr>
            <tr>
              <th className="col-half">합계금액</th>
              <th className="col-half">공급가</th>
              <th className="col-half">부가세</th>
            </tr>
          </thead>
          <tbody>
            {goodsFeeCarSummary && goodsFeeCarSummary.length > 0 ? (
              goodsFeeCarSummary.map((summary, index) => (
                <tr key={index}>
                  <td>{summary.TAX_SCT_NM}</td>
                  <td>{summary.CNT.toLocaleString()}</td>
                  <td>{summary.EXPD_AMT.toLocaleString()}</td>
                  <td>{summary.EXPD_SUP_PRC.toLocaleString()}</td>
                  <td>{summary.EXPD_VAT.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  데이터가 존재하지 않습니다.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            {goodsFeeCarSummary && goodsFeeCarSummary.length > 0 && (
              <tr>
                <th>합계</th>
                <th>{goodsFeeCarSummary.reduce((sum, item) => sum + item.CNT, 0).toLocaleString()}</th>
                <th>{goodsFeeCarSummary.reduce((sum, item) => sum + item.EXPD_AMT, 0).toLocaleString()}</th>
                <th>{goodsFeeCarSummary.reduce((sum, item) => sum + item.EXPD_SUP_PRC, 0).toLocaleString()}</th>
                <th>{goodsFeeCarSummary.reduce((sum, item) => sum + item.EXPD_VAT, 0).toLocaleString()}</th>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </main>
  );
}
