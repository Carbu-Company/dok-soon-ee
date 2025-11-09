'use client'
import { ServerInsertedHTMLContext, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@/components/ui/pagination";
import Image from "next/image";
import SimpleTableDownloadButton from "@/components/utils/SimpleTableDownloadButton";

/**
 * 리스트 항목 변경하기. 2025.10.28
 * 선택	차량명	차량번호	해당딜러	매출항목	거래금액	주문자명	연락처	사업자등록번호	매출일	홈택스처리	발행하기
 */

export default function ElectronicTaxInvoicePage(props) {
  
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
  const initialCarTaxSummary = props.carSummary?.data || [];

  const [carList, setCarList] = useState(initialCarListData);
    
  const [selectedItems, setSelectedItems] = useState([]);
  const [pagination, setPagination] = useState(initialPagination);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages || 1);

  const [carTaxSummary, setCarTaxSummary] = useState(initialCarTaxSummary);

  const [dealerList, setDealerList] = useState(props.dealerList || []);
  const [saleItemList, setSaleItemList] = useState(props.saleItemList || []);
  const [crStatList, setCrStatList] = useState(props.crStatList || []);
  
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

  // 상세 검색 차량번호(신)
  // const [dtlNewCarNo, setDtlNewCarNo] = useState("");

  // 상세 검색 차량번호(구)
  const [dtlOldCarNo, setDtlOldCarNo] = useState("");

  // 상세 검색 거래처/고객명
  const [dtlNmNoGubun, setDtlNmNoGubun] = useState("");
  const [isDtlNmNoGubunSelectOpen, setIsDtlNmNoGubunSelectOpen] = useState(false);

  // 상세 검색 거래처/고객명
  const [dtlNmNoValue, setDtlNmNoValue] = useState("");

  // 과세 대상 유형 명
  const [dtlTaxTargetTpNm, setDtlTaxTargetTpNm] = useState("");
  const [isDtlTaxTargetTpNmSelectOpen, setIsDtlTaxTargetTpNmSelectOpen] = useState(false);

  // 상세 검색 메모
  const [dtlMemo, setDtlMemo] = useState("");

  // 현금영수증 전송 상태
  const [dtlCrStat, setDtlCrStat] = useState([]);

  // 작성 유형 (똑순이, 홈택스)
  const [dtlWriteTpNm, setDtlWriteTpNm] = useState("");
  const [isDtlWriteTpNmSelectOpen, setIsDtlWriteTpNmSelectOpen] = useState(false);

  // 상세 검색 문서번호
  const [dtlNtsNo, setDtlNtsNo] = useState("");

  
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
    setIsDtlNmNoGubunSelectOpen(false);
    setIsDtlTaxTargetTpNmSelectOpen(false);
    setIsDtlWriteTpNmSelectOpen(false);
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
    dtlOldCarNo: dtlOldCarNo,    
    dtlTaxTargetTpNm: dtlTaxTargetTpNm,
    dtlNmNoGubun: dtlNmNoGubun,
    dtlNmNoValue: dtlNmNoValue,
    dtlCrStat: dtlCrStat,    
    dtlWriteTpNm: dtlWriteTpNm,
    dtlNtsNo: dtlNtsNo,
    dtlMemo: dtlMemo,
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
          setCarTaxSummary(summaryData);

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


  const openModal = (id) => {
    if (typeof window !== "undefined" && window.openModal) {
      window.openModal(id);
    } else {
      console.log("openModal stub:", id);
    }
  };

    // listCount가 변경될 때 pageSize 업데이트하고 첫 페이지로 이동
  // // 자동 검색 비활성화
  // useEffect(() => {
  //   setPageSize(listCount);
  //   // handleSearch(1); // 자동 검색 비활성화
  //   console.log("pageSize", pageSize);
  //   console.log("listCount", listCount);
  // }, [ordItem, ordAscDesc, listCount]);

  // listCount가 변경될 때 pageSize 업데이트하고 첫 페이지로 이동
  // 자동 검색 비활성화
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

    setDtlOldCarNo("");
    setDtlNmNoGubun("");
    setDtlNmNoValue("");
    setDtlTaxTargetTpNm("");
    setDtlMemo("");
    setDtlCrStat([]);
    setDtlWriteTpNm("");
    setDtlNtsNo("");

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
    { accessorKey: "CAR_NO", header: "차량번호" },
    { accessorKey: "DLR_NM", header: "담당딜러" },
    { accessorKey: "CAR_NM", header: "차량명" },
    { accessorKey: "CAR_PUR_DT", header: "매입일" },
    { accessorKey: "PUR_AMT", header: "매입금액" },

    { accessorKey: "DLR_NM", header: "문서" },                // 컬럼 지정 필요요
    { accessorKey: "MK_DT", header: "작성일자" },
    { accessorKey: "TRADE_DTIME", header: "발행일자" },
    { accessorKey: "BUYR_MTL_NM", header: "거래처" },
    { accessorKey: "BUYR_BRNO", header: "등록번호" },
    { accessorKey: "SEL_DLR_NM", header: "판매딜러" },
    { accessorKey: "ITEM_NM", header: "품목명" },
    { accessorKey: "TOT_SUP_PRC", header: "공급가액" },
    { accessorKey: "TOT_VAT", header: "세액" },
    { accessorKey: "TOT_AMT", header: "합계금액" },
    { accessorKey: "TXBL_TRNS_STAT_NM", header: "상태" }

  ];

  // 숫자 형식으로 처리할 컬럼들
  const numericColumns = ["PUR_AMT", "TOT_SUP_PRC", "TOT_VAT", "TOT_AMT"];

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    return (
      <main className="container container--page">
        <div className="container__head">
          <h2 className="container__title">전자세금계산서 발행</h2>
  
          <div className="guidebox">
            <p className="guidebox__title">매도처리 후 매출증빙과 연계 필요(1:1)</p>
            <p className="guidebox__title">세금계산서 직접 발행(팝빌 등록 화면 호출) 가능?</p>
            <p className="guidebox__title">발행시 즉시전송(상사별 환경설정)</p>
            <p className="guidebox__title">계산서 재전송 기능</p>
            <p className="guidebox__title">똑순이, 홈택스 발행건(API) 같이 조회</p>
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
                          defaultValue="작성일"
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
                              ? "작성일"
                              : dtGubun === "02"
                                ? "발행일" 
                                : dtGubun === "03"
                                  ? "매도(판매)일" 
                                  : dtGubun === "04"
                                    ? "제시(매입)일"
                                    : "작성일"}
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
                            작성일
                          </li>
                          <li
                            className={`select__option ${dtGubun === "02" ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtGubun("02");
                              setIsDtGubunSelectOpen(false);
                            }}
                          >
                            발행일
                          </li>
                          <li
                            className={`select__option ${dtGubun === "03" ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtGubun("03");
                              setIsDtGubunSelectOpen(false);
                            }}
                          >
                            매도(판매)일
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
                        handleSearch(1);
                      }}
                      disabled={loading}
                    >
                      <span className="ico ico--search"></span>차량검색
                    </button>
                    <button type="button" 
                      className="jsSearchboxBtn btn btn--type02"
                      onClick={() => setIsDetailSearchOpen(!isDetailSearchOpen)}
                    >
                      <span className="ico ico--search_detail"></span>상세조건검색
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
                  <input className="select__input" type="hidden" name="ordItemDtl" defaultValue="거래일" />
                  <button
                    className="select__toggle"
                    type="button"
                    onClick={() => {
                      closeAllToggles();
                      setIsOrdItemSelectOpenDtl(!isOrdItemSelectOpenDtl);
                    }}
                  >
                    <span className="select__text">{ordItemDtl === "01" ? "거래일" : ordItemDtl === "02" ? "작성일일" : "선택"}</span>
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
                    className={`select__option ${ordItemDtl === "01" ? "select__option--selected" : ""}`}
                    onClick={() => {
                      setOrdItemDtl("01");
                      setIsOrdItemSelectOpenDtl(false);
                    }}
                  >
                    거래일
                  </li>
                  <li
                    className={`select__option ${ordItemDtl === "02" ? "select__option--selected" : ""}`}
                    onClick={() => {
                      setOrdItemDtl("02");
                      setIsOrdItemSelectOpenDtl(false);
                    }}
                  >
                    발행일
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
                      <th>차량번호(신)</th>
                      <td>
                        <div className="input">
                            <input
                              type="text"
                              className="input__field"
                              placeholder="차량번호(신)"
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
                            name="dtlDtGubun"
                            defaultValue="작성일"
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
                              ? "작성일"
                              : dtlDtGubun === "02"
                                ? "발행일" 
                                : dtlDtGubun === "03"
                                  ? "매도(판매)일" 
                                  : dtlDtGubun === "04"
                                    ? "제시(매입)일"
                                    : "작성일"}
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
                              className={`select__option ${dtlDtGubun === "01" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("01");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              작성일
                            </li>
                            <li
                              className={`select__option ${dtlDtGubun === "02" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("02");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              발행일
                            </li>
                            <li
                              className={`select__option ${dtlDtGubun === "03" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("03");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              매도(판매)일
                            </li>
                            <li
                              className={`select__option ${dtlDtGubun === "04" ? "select__option--selected" : ""}`}
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
  
                      <th>거래처유형</th>
                      <td>
                        <div className="form-option-wrap">
                          <div className="form-option">
                            <label className="form-option__label">
                              <input 
                                type="radio" 
                                name="dtlTaxTargetTpNm" 
                                checked={dtlTaxTargetTpNm === ""}
                                onChange={() => setDtlTaxTargetTpNm("")}
                              />
                              <span className="form-option__title">전체</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input 
                                type="radio" 
                                name="dtlTaxTargetTpNm"
                                checked={dtlTaxTargetTpNm === "01"}
                                onChange={() => setDtlTaxTargetTpNm("01")}
                              />
                              <span className="form-option__title">사업자(사업자번호)</span>
                            </label>
                          </div>
  
                          <div className="form-option">
                            <label className="form-option__label">
                              <input 
                                type="radio" 
                                name="dtlTaxTargetTpNm"
                                checked={dtlTaxTargetTpNm === "02"} 
                                onChange={() => setDtlTaxTargetTpNm("02")}
                              />
                              <span className="form-option__title">개인(주민등록번호)</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input 
                                type="radio" 
                                name="dtlTaxTargetTpNm"
                                checked={dtlTaxTargetTpNm === "03"}
                                onChange={() => setDtlTaxTargetTpNm("03")}
                              />
                              <span className="form-option__title">외국인</span>
                            </label>
                          </div>
                        </div>
                      </td>
  
                      <th>거래처</th>
                      <td>
                        <div className="input-group input-group--sm">
                          <div className="select w140">
                            <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                            <button 
                              className="select__toggle" 
                              type="button"
                              onClick={() => {
                                closeAllToggles();
                                setIsDtlNmNoGubunSelectOpen(!isDtlNmNoGubunSelectOpen);
                              }}
                            >
                              <span className="select__text">
                                {dtlNmNoGubun === "01" ? "거래처/고객명" : dtlNmNoGubun === "02" ? "사업자/주민등록번호" : "선택"}
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
                              style={{ display: isDtlNmNoGubunSelectOpen ? "block" : "none" }}
                            >
                              <li
                                className={`select__option ${dtlNmNoGubun === "01" ? "select__option--selected" : ""}`}
                                onClick={() => {
                                  setDtlNmNoGubun("01");
                                  setIsDtlNmNoGubunSelectOpen(false);
                                }}
                              >
                                거래처/고객명
                              </li>
                              <li
                                className={`select__option ${dtlNmNoGubun === "02" ? "select__option--selected" : ""}`}
                                onClick={() => {
                                  setDtlNmNoGubun("02"); 
                                  setIsDtlNmNoGubunSelectOpen(false);
                                }}
                              >
                                사업자/주민등록번호
                              </li>
                            </ul>
                          </div>
  
                          <div className="input">
                            <input 
                              type="text" 
                              className="input__field" 
                              placeholder=""
                              value={dtlNmNoValue}
                              onChange={e => setDtlNmNoValue(e.target.value)} 
                            />
                            <div className="input__utils">
                              <button 
                                type="button" 
                                className="jsInputClear input__clear ico ico--input-delete"
                                onClick={() => setDtlNmNoValue("")}
                              >삭제</button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>상태</th>
                      <td colSpan={3}>
                      <div className="form-option-wrap">
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="checkbox"
                              checked={dtlCrStat.length === 0}
                              onChange={() => setDtlCrStat([])}
                            />
                            <span className="form-option__title">전체</span>
                          </label>
                        </div>
                        {crStatList.map((stat) => (
                          <div className="form-option" key={stat.CD}>
                            <label className="form-option__label">
                              <input 
                                type="checkbox"
                                checked={dtlCrStat.includes(stat.CD)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setDtlCrStat([...dtlCrStat, stat.CD]);
                                  } else {
                                    setDtlCrStat(dtlCrStat.filter(cd => cd !== stat.CD));
                                  }
                                }}
                              />
                              <span className="form-option__title">{stat.CD_NM}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                      </td>
                      <th>작성유형</th>
                      <td>
                        <div className="form-option-wrap">
                          <div className="form-option">
                            <label className="form-option__label">
                              <input 
                                type="checkbox"
                                checked={dtlWriteTpNm.includes('똑순이')}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setDtlWriteTpNm([...dtlWriteTpNm, '똑순이']);
                                  } else {
                                    setDtlWriteTpNm(dtlWriteTpNm.filter(tp => tp !== '똑순이'));
                                  }
                                }}
                              />
                              <span className="form-option__title">똑순이</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input 
                                type="checkbox"
                                checked={dtlWriteTpNm.includes('홈택스')}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setDtlWriteTpNm([...dtlWriteTpNm, '홈택스']);
                                  } else {
                                    setDtlWriteTpNm(dtlWriteTpNm.filter(tp => tp !== '홈택스'));
                                  }
                                }}
                              />
                              <span className="form-option__title">홈택스</span>
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>관리번호</th>
                      <td>
                        <div className="input">
                          <input 
                            type="text" 
                            className="input__field" 
                            placeholder="문서번호/국세청승인번호"
                            value={dtlNtsNo}
                            onChange={(e) => setDtlNtsNo(e.target.value)}
                          />
                          <div className="input__utils">
                            <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                          </div>
                        </div>
                      </td>
                      <th>비고</th>
                      <td>
                        <div className="input">
                          <input 
                            type="text" 
                            className="input__field" 
                            placeholder=""
                            value={dtlMemo}
                            onChange={(e) => setDtlMemo(e.target.value)}
                          />
                          <div className="input__utils">
                            <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                          </div>
                        </div>
                      </td>
                      <th></th>
                      <td></td>
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
          <h2 className="table-wrap__title">발행대상 리스트<span>Total {pagination?.totalCount || carList?.length || 0}건</span></h2>
          <div className="table-wrap__head table-wrap__title">
            <button
              type="button"
              className="btn btn--red btn--padding--r30"
              onClick={() => (window.location.href = '#')}
            >
              <span className="ico ico--add"></span>건별 발행 등록
            </button>
            <div className="input-group">
              {/* 정렬 항목 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="ordItem" defaultValue={ordItem} />
                <button 
                  className="select__toggle" 
                  type="button"
                  onClick={() => {
                    closeAllToggles();
                    setIsOrdItemSelectOpen(!isOrdItemSelectOpen);
                  }}
                >
                  <span className="select__text">{ordItem === "01" ? "발행일" : "담당딜러"}</span>
                  <img className="select__arrow" src="/images/ico-dropdown.svg" alt="" />
                </button>
  
                <ul className={`select__menu ${isOrdItemSelectOpen ? "active" : ""}`}>
                  <li 
                    className={`select__option ${ordItem === "01" ? "select__option--selected" : ""}`} 
                    data-value="01"
                    onClick={() => {
                      setOrdItem("01");
                      setIsOrdItemSelectOpen(false);
                    }}
                  >발행일</li>
                  <li 
                    className={`select__option ${ordItem === "02" ? "select__option--selected" : ""}`} 
                    data-value="02"
                    onClick={() => {
                      setOrdItem("02");
                      setIsOrdItemSelectOpen(false);
                    }}
                  >담당딜러</li>
                </ul>
              </div>
  
              {/* 정렬순서 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="ordAscDesc" defaultValue={ordAscDesc} />
                <button 
                  className="select__toggle" 
                  type="button"
                  onClick={() => {
                    closeAllToggles();
                    setIsOrdAscDescSelectOpen(!isOrdAscDescSelectOpen);
                  }}
                >
                  <span className="select__text">{ordAscDesc === "desc" ? "내림차순" : "오름차순"}</span>
                  <img className="select__arrow" src="/images/ico-dropdown.svg" alt="" />
                </button>

                <ul className={`select__menu ${isOrdAscDescSelectOpen ? "active" : ""}`}>
                  <li 
                    className={`select__option ${ordAscDesc === "desc" ? "select__option--selected" : ""}`}
                    data-value="desc"
                    onClick={() => {
                      setOrdAscDesc("desc");
                      setIsOrdAscDescSelectOpen(false);
                    }}
                  >내림차순</li>
                  <li 
                    className={`select__option ${ordAscDesc === "asc" ? "select__option--selected" : ""}`}
                    data-value="asc" 
                    onClick={() => {
                      setOrdAscDesc("asc");
                      setIsOrdAscDescSelectOpen(false);
                    }}
                  >오름차순</li>
                </ul>
              </div>
  
              {/* 건수 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="listCount" defaultValue={listCount} />
                <button 
                  className="select__toggle" 
                  type="button"
                  onClick={() => {
                    closeAllToggles();
                    setIsListCountSelectOpen(!isListCountSelectOpen);
                  }}
                >
                  <span className="select__text">{listCount}건씩</span>
                  <img className="select__arrow" src="/images/ico-dropdown.svg" alt="" />
                </button>

                <ul className={`select__menu ${isListCountSelectOpen ? "active" : ""}`}>
                  <li 
                    className={`select__option ${listCount === 10 ? "select__option--selected" : ""}`}
                    data-value="10"
                    onClick={() => {
                      setListCount(10);
                      setIsListCountSelectOpen(false);
                    }}
                  >10건씩</li>
                  <li 
                    className={`select__option ${listCount === 30 ? "select__option--selected" : ""}`}
                    data-value="30"
                    onClick={() => {
                      setListCount(30);
                      setIsListCountSelectOpen(false);
                    }}
                  >30건씩</li>
                  <li 
                    className={`select__option ${listCount === 50 ? "select__option--selected" : ""}`}
                    data-value="50"
                    onClick={() => {
                      setListCount(50);
                      setIsListCountSelectOpen(false);
                    }}
                  >50건씩</li>
                </ul>
              </div>
  
              <SimpleTableDownloadButton 
              data={carList}
              columns={excelColumns}
              numericColumns={numericColumns}
              filePrefix="전자세금계산서리스트"
              className="btn btn--white"
              text="다운로드"
              sheetName="전자세금계산서"
            />
            </div>
          </div>
  
          <table className="table">
            <colgroup>
            <col style={{ width: "50px" }} />
            <col style={{ width: "50px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>선택</th>
                <th>차량명</th>
                <th>차량번호</th>
                <th>해당딜러</th>
                <th>매출항목</th>
                <th>거래금액</th>
                <th>주문자명</th>
                <th>연락처</th>
                <th>사업자등록번호</th>
                <th>매출일</th>
                <th>홈택스처리</th>
                <th>발행하기</th>
              </tr>
            </thead>
            <tbody>
            {carList.map((item, index) => {
              const isSelected = selectedItems.some(selected => selected.index === index);
              return (
                <tr key={item.TRADE_SEQ} className={isSelected ? 'table__row--selected' : ''}>
                  <td>{index + 1}</td>
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
                  <td>{item.CAR_NM}</td>
                  <td>{item.CAR_NO}</td>
                  <td>{item.DLR_NM}</td>
                  <td>{item.TRADE_ITEM_NM}</td>
                  <td>{item.TRADE_ITEM_AMT?.toLocaleString()}</td>
                  <td>{item.CUST_NM}</td>
                  <td>{item.CUST_PHON}</td>
                  <td>{item.CUST_BRNO}</td>
                  <td>{item.CAR_DT}</td>
                  <td><button className="btn btn--primary">제외하기</button></td>
                  <td>
                    <button className="btn btn--primary" onClick={e => e.stopPropagation()}>
                      <Link href={`/electronic-tax-invoice/newIssue/${item.TRADE_SEQ}`}>
                        발행하기
                      </Link>
                    </button>
                  </td>
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
  
        <div className="table-wrap">
          <h2 className="table-wrap__title">합계표</h2>
          <table className="table">
            <thead>
              <tr>
                <th>거래구분</th>
                <th>매출처수</th>
                <th>매수</th>
                <th>합계금액</th>
                <th>공급가액</th>
                <th>세액</th>
              </tr>
            </thead>
            <tbody>
              {carTaxSummary?.map((item, index) => (
                index < 2 && (
                  <tr key={index}>
                    <td>{item.TRADE_TP_NM || '-'}</td>
                    <td>{item.TAX_CNT?.toLocaleString() || 0}</td>
                    <td>{item.BUYR_CNT?.toLocaleString() || 0}</td>
                    <td>{item.TRADE_AMT?.toLocaleString() || 0}</td>
                    <td>{item.SUP_PRC?.toLocaleString() || 0}</td>
                    <td>{item.VAT?.toLocaleString() || 0}</td>
                  </tr>
                )
              ))}
            </tbody>
            <tfoot>
              {carTaxSummary?.map((item, index) => (
                index === 2 && (
                  <tr key={index}>
                    <th>{item.TRADE_TP_NM || '합계'}</th>
                    <th>{item.TAX_CNT?.toLocaleString() || 0}</th>
                    <th>{item.BUYR_CNT?.toLocaleString() || 0}</th>
                    <th>{item.TRADE_AMT?.toLocaleString() || 0}</th>
                    <th>{item.SUP_PRC?.toLocaleString() || 0}</th>
                    <th>{item.VAT?.toLocaleString() || 0}</th>
                  </tr>
                )
              ))}
            </tfoot>
          </table>
        </div>
      </main>
    );
  }
  