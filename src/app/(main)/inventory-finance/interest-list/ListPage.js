"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Pagination from "@/components/ui/pagination";

export default function InventoryFinanceInterestList( props ) {
  const router = useRouter();
  const openModal = id => {
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
  const initialCarListData = props.carList?.data?.loanList || [];
  const initialPagination = props.carList?.data?.pagination || {};

  // Summary 데이터
  const initialCarLoanSummary = props.carSummary?.data || [];

  const [carList, setCarList] = useState(initialCarListData);
  const [pagination, setPagination] = useState(initialPagination);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages || 1);

  const [carLoanSummary, setCarLoanSummary] = useState(initialCarLoanSummary);

  const [dealerList, setDealerList] = useState(props.dealerList || []);
  const [capitalList, setCapitalList] = useState(props.capitalList || []);
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
    if (searchBtn === 1 || searchBtn === 2) handleSearch(1); // 자동 검색 비활성화
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
    // handleSearch(1); // 자동 검색 비활성화
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


  // 상세 검색 차량번호(신)
  const [dtlNewCarNo, setDtlNewCarNo] = useState("");

  // 상세 검색 차량번호(구)
  const [dtlOldCarNo, setDtlOldCarNo] = useState("");

  // 상세 검색 캐피탈사
  const [dtlCapital, setDtlCapital] = useState("");
  const [isDtlCapitalSelectOpen, setIsDtlCapitalSelectOpen] = useState(false);

  // 상세 검색 특이사항
  const [dtlLoanMemo, setDtlLoanMemo] = useState("");

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
    setIsDtlCapitalSelectOpen(false);
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
    dtlNewCarNo: dtlNewCarNo,
    dtlOldCarNo: dtlOldCarNo,
    dtlCapital: dtlCapital,
    dtlLoanMemo: dtlLoanMemo,
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
          const responseData = result.data?.list?.loanList || [];
          const paginationInfo = result.data?.list?.pagination || {};
          const summaryData = result.data?.summary || [];

          // console.log('응답 데이터:', {
          //   responseDataLength: responseData.length,
          //   paginationInfo,
          //   summaryData
          // });

          setCarList(responseData);
          setPagination(paginationInfo);
          setCarLoanSummary(summaryData);  

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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">재고금융 리스트(이자납입)</h2>

        <div className="guidebox">
          <p className="guidebox__title">재고금융 : 이자납입 = 1 : N</p>
          <p className="guidebox__title">
            하나의 재고금융 등록시 자동으로 이자테이블 1row 추가(최소 1row~N)
          </p>
          {/*<p className="guidebox__desc">※ 이자계산, 신규/연장/추가처리</p>*/}
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
                      defaultValue="대출실행일"
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
                          ? "대출실행일"
                          : dtGubun === "02"
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
                        className={`select__option ${dtGubun === "대출실행일" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("01");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        대출실행일
                      </li>
                      <li
                        className={`select__option ${dtGubun === "제시(매입)일" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("02");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        제시(매입)일
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
              <button className="btn btn--white" type="button">
                <span className="ico ico--reset"></span>선택 초기화
              </button>

              {/* 검색기간 */}
              <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="제시일" />
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
                  className={`select__option ${ordItemDtl === "대출실행일" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItemDtl("대출실행일");
                    setIsOrdItemSelectOpenDtl(false);
                    // handleSearch(1); // 자동 검색 비활성화
                  }}
                >
                  대출실행일
                </li>
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
                                ? "대출실행일"
                                : dtlDtGubun === "02"
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
                              className={`select__option ${dtlDtGubun === "대출실행일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("01");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              대출실행일
                            </li>
                            <li
                              className={`select__option ${dtlDtGubun === "제시(매입)일" ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlDtGubun("02");
                                setIsDtlDtGubunSelectOpen(false);
                              }}
                            >
                              제시(매입)일
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
                    <th>캐피탈사</th>
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
                            setIsDtlCapitalSelectOpen(!isDtlCapitalSelectOpen);
                          }}
                        >
                          <span className="select__text">
                            {dtlCapital
                              ? capitalList.find(c => c.CD === dtlCapital)?.CD_NM || "선택"
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
                          style={{ display: isDtlCapitalSelectOpen ? "block" : "none" }}
                        >
                          <li 
                            className={`select__option ${!dtlCapital ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtlCapital("");
                              setIsDtlCapitalSelectOpen(false);
                            }}
                          >
                            선택
                          </li>
                          {capitalList.map((capital) => (
                            <li
                              key={capital.CD}
                              className={`select__option ${dtlCapital === capital.CD ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlCapital(capital.CD);
                                setIsDtlCapitalSelectOpen(false);
                              }}
                            >
                              {capital.CD_NM}
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
                          placeholder="특이사항"
                          value={dtlLoanMemo}
                          onChange={e => setDtlLoanMemo(e.target.value)}
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
              router.push("/inventory-finance/register?showModal=true");
            }}
          >
            <span className="ico ico--add"></span>재고금융 등록
          </button>
          <div className="input-group">
            {/* 딜러명 */}
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
                  {ordItem === "01" ? "실행일" : 
                   ordItem === "02" ? "결제일" : 
                   ordItem === "03" ? "이자납입일" : "실행일"}
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
                  }}
                >
                  실행일
                </li>
                <li 
                  className={`select__option ${ordItem === "02" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("02"); 
                    setIsOrdItemSelectOpen(false);
                  }}
                >
                  결제일
                </li>
                <li 
                  className={`select__option ${ordItem === "03" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("03");
                    setIsOrdItemSelectOpen(false);
                  }}
                >
                  이자납입일
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

            <button className="btn btn--white btn--padding--r30" type="button">
              <span className="ico ico--download"></span>다운로드
            </button>
          </div>
        </div>

        {/* 이자납 리스트 s */}
        <table className="table">
          <colgroup>
            <col style={{ width: "250px" }} />
            <col style={{ width: "auto" }} />
            {/*캐피탈사*/}
            <col style={{ width: "130px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "130px" }} />
            {/*이자납입일*/}
            <col style={{ width: "110px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "80px" }} />
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
                    <p>담당딜러, 차량번호, 차량명, 매입금액, 매입일</p>
                  </div>
                </div>
              </th>
              <th>캐피탈사</th>
              <th>대출금액</th>
              <th>실행일</th>
              <th>대출기간</th>
              <th>딜러이율</th>
              <th>월이자</th>
              <th>총이자</th>
              <th>납입이자</th>
              <th>이자납일</th>
              <th>총납입이자</th>
              <th>진행상태</th>
              <th>바로가기</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
            {carList.map((car, index) => (
              <tr key={index}>
              <td>{car.DLR_NM} / {car.DLR_NM} / {car.CAR_NO} / {car.CAR_NM} / {car.PUR_AMT.toLocaleString()} / {car.CAR_PUR_DT}</td>
              <td>{car.LOAN_CORP_NM}</td>
              <td>{car.LOAN_AMT.toLocaleString()}</td>
              <td>{car.LOAN_DT}</td>
              <td>{car.LOAN_MM_CNT}개월</td>
              <td>{car.DLR_APLY_INTR_RT}</td>
              <td>{car.MM_INTR_AMT?.toLocaleString()}</td>
              <td>{car.TOT_INTR_AMT?.toLocaleString()}</td>
              <td>
                <span className="text-red">{car.INTR_PAY_AMT?.toLocaleString()}</span>
              </td>
              <td>
                <span className="text-red">{car.INTR_PAY_DT}</span>
              </td>
              <td>{car.TOT_PAY_INTR_AMT?.toLocaleString()}</td>
              <td>{car.LOAN_STAT_NM}</td>
              <td>
                <div className="input-group input-group--sm input-group--center">
                  <div className="select select--utils">
                    <button type="button" className="select__toggle">
                      더보기
                    </button>

                    <ul className="select__menu">
                      <li className="select__option">
                        <a href="#">이자납 수정(등록동일)</a>
                      </li>
                      <li className="select__option">
                        <a
                          href="#"
                          onClick={e => {
                            e.preventDefault();
                            openModal("2");
                          }}
                        >
                          이자납 삭제
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
                  onClick={() => router.push(`/detail/inventory-finance/${car.CAR_REG_ID}`)}
                >
                  상세보기
                </button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
        {/* 이자납 리스트 e */}

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
              <th rowSpan={2}>캐피탈사</th>
              <th rowSpan={2}>총한도</th>
              <th rowSpan={2}>이용금액</th>
              <th rowSpan={2}>잔여한도</th>
              <th rowSpan={2}>이자납입일</th>
              <th rowSpan={2}>사용률</th>
              <th rowSpan={2}>유효건수</th>
              <th colSpan={4} className="col-half">
                최근이용차량
              </th>
            </tr>
            <tr>
              <th className="col-half">차량번호</th>
              <th className="col-half">담당딜러</th>
              <th className="col-half">차량명</th>
              <th className="col-half">실행일</th>
            </tr>
          </thead>
          <tbody>
            {carLoanSummary && carLoanSummary.length > 0 ? (
              carLoanSummary.map((summary, index) => (
                <tr key={index}>
                  <td>{summary.LOAN_CORP_NM}</td>
                  <td>{summary.TOT_LMT_AMT.toLocaleString()}</td>
                  <td>{summary.TOT_LOAN_AMT.toLocaleString()}</td>
                  <td>{summary.LMT_AMT.toLocaleString()}</td>
                  <td>{summary.RT}일</td>
                  <td>{summary.RT}%</td>
                  <td>{summary.TOT_CNT}건</td>
                  <td>{summary.CAR_NO}</td>
                  <td>{summary.DLR_NM}</td>
                  <td>{summary.CAR_NM}</td>
                  <td>{summary.LOAN_DT}</td>
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

          <tfoot>
            {carLoanSummary && carLoanSummary.length > 0 && (
              <tr>
                <th>합계</th>
                <th>{carLoanSummary.reduce((sum, item) => sum + item.TOT_LMT_AMT, 0).toLocaleString()}</th>
                <th>{carLoanSummary.reduce((sum, item) => sum + item.TOT_LOAN_AMT, 0).toLocaleString()}</th>
                <th>{carLoanSummary.reduce((sum, item) => sum + item.LMT_AMT, 0).toLocaleString()}</th>
                <th>-</th>
                <th>{(carLoanSummary.reduce((sum, item) => sum + item.RT, 0) / carLoanSummary.length).toFixed(1)}%</th>
                <th>{carLoanSummary.reduce((sum, item) => sum + item.TOT_CNT, 0)}건</th>
                <th>-</th>
                <th>-</th>
                <th>-</th>
                <th>-</th>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </main>
  );
}
