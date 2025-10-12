"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@/components/ui/pagination";
import SimpleTableDownloadButton from "@/components/utils/SimpleTableDownloadButton";
import CarSearchModal from "@/components/modal/CarSearchModal";
import Image from "next/image";
import { 
  getCashBillList, 
  getCashBillAmount, 
  getReceiptIssueList, 
  getReceiptIssueSummary 
} from "@/app/(main)/api/carApi";

export default function CashReceiptList(
props
) {
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
  const initialCarCashSummary = props.carSummary?.data || [];

  const [carList, setCarList] = useState(initialCarListData);
  const [pagination, setPagination] = useState(initialPagination);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages || 1);

  const [carCashSummary, setCarCashSummary] = useState(initialCarCashSummary);

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
  const [ordItem, setOrdItem] = useState("발행일");
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
  const [dtlNewCarNo, setDtlNewCarNo] = useState("");

  // 상세 검색 차량번호(구)
  const [dtlOldCarNo, setDtlOldCarNo] = useState("");

  // 상세 검색 고객명
  const [dtlCustomerName, setDtlCustomerName] = useState("");

  // 상세 검색 매출품명
  const [dtlSaleItem, setDtlSaleItem] = useState("");
  const [isDtlSaleItemSelectOpen, setIsDtlSaleItemSelectOpen] = useState(false);

  // 상세 검색 메모
  const [dtlMemo, setDtlMemo] = useState("");

  // 거래 처리 명
  const [dtlTradeProcNm, setDtlTradeProcNm] = useState("");

  // 거래 구분
  const [dtlTradeSctGubun, setDtlTradeSctGubun] = useState("");

  // 현금영수증 전송 상태
  const [dtlCrStat, setDtlCrStat] = useState([]);

  // 상세 검색 식별번호4
  const [dtlRcgnNo, setDtlRcgnNo] = useState("");

  // 상세 검색 문서번호
  const [dtlNtsConfNo, setDtlNtsConfNo] = useState("");

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
    setIsDtlSaleItemSelectOpen(false);
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
    dtlCustomerName: dtlCustomerName,
    dtlSaleItem: dtlSaleItem,
    dtlMemo: dtlMemo,
    dtlTradeProcNm: dtlTradeProcNm,
    dtlTradeSctGubun: dtlTradeSctGubun,
    dtlCrStat: dtlCrStat,
    dtlRcgnNo: dtlRcgnNo,
    dtlNtsConfNo: dtlNtsConfNo,
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

          console.log('응답 데이터:', {
            responseDataLength: result,
            paginationInfo,
            summaryData
          });

          setCarList(responseData);
          setPagination(paginationInfo);
          setCarCashSummary(summaryData);

          // 서버에서 제공하는 페이지네이션 정보 사용
          setTotalPages(paginationInfo.totalPages || 1);
          setCurrentPage(paginationInfo.currentPage || pageNum);
        } else {
          alert("검색 중 오류가 발생했습니다: " + (result?.error || "unknown"));
        }
      } else {
        // searchAction이 없을 때 carApi 사용
        const searchParamsWithPage = {
          ...getDefaultParams(pageNum),
          ...searchParams,
        };

        // 현금영수증 발행 리스트 조회
        const listResult = await getReceiptIssueList(searchParamsWithPage);
        const summaryResult = await getReceiptIssueSummary(searchParamsWithPage);

        if (listResult.success && summaryResult.success) {
          const responseData = listResult.data?.list || [];
          const paginationInfo = listResult.data?.pagination || {};
          const summaryData = summaryResult.data || [];

          console.log('응답 데이터:', {
            responseDataLength: responseData.length,
            paginationInfo,
            summaryData
          });

          setCarList(responseData);
          setPagination(paginationInfo);
          setCarCashSummary(summaryData);

          // 서버에서 제공하는 페이지네이션 정보 사용
          setTotalPages(paginationInfo.totalPages || 1);
          setCurrentPage(paginationInfo.currentPage || pageNum);
        } else {
          alert("검색 중 오류가 발생했습니다: " + (listResult?.error || summaryResult?.error || "unknown"));
        }
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

  // 현금영수증 인쇄 기능
  const handlePrintReceipt = async (item) => {
    try {
      const printData = {
        carAgent: props.session?.agentId,
        costSeq: item.COST_SEQ || item.CAR_REG_ID,
        ntsConfNo: item.NTS_CONF_NO,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/printCashReceipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(printData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 인쇄 팝업 열기
        window.open(result.data.printUrl, '_blank', 'width=800,height=600');
      } else {
        alert('인쇄 중 오류가 발생했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('인쇄 오류:', error);
      alert('인쇄 중 오류가 발생했습니다.');
    }
  };

  // 알림톡 전송 기능
  const handleSendAlimtalk = async (item) => {
    try {
      const alimtalkData = {
        carAgent: props.session?.agentId,
        costSeq: item.COST_SEQ || item.CAR_REG_ID,
        custNm: item.CUST_NM,
        custPhone: item.CUST_PHONE,
        tradeAmt: item.TRADE_AMT,
        ntsConfNo: item.NTS_CONF_NO,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sendCashReceiptAlimtalk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alimtalkData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('알림톡이 성공적으로 전송되었습니다.');
      } else {
        alert('알림톡 전송 중 오류가 발생했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('알림톡 전송 오류:', error);
      alert('알림톡 전송 중 오류가 발생했습니다.');
    }
  };

  // 메일 전송 기능
  const handleSendEmail = async (item) => {
    try {
      const emailData = {
        carAgent: props.session?.agentId,
        costSeq: item.COST_SEQ || item.CAR_REG_ID,
        custNm: item.CUST_NM,
        custEmail: item.CUST_EMAIL,
        tradeAmt: item.TRADE_AMT,
        ntsConfNo: item.NTS_CONF_NO,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sendCashReceiptEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('메일이 성공적으로 전송되었습니다.');
      } else {
        alert('메일 전송 중 오류가 발생했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('메일 전송 오류:', error);
      alert('메일 전송 중 오류가 발생했습니다.');
    }
  };

  // 취소발행 기능
  const handleCancelIssuance = async (item) => {
    if (!confirm('정말로 취소발행하시겠습니까?')) {
      return;
    }

    try {
      const cancelData = {
        carAgent: props.session?.agentId,
        costSeq: item.COST_SEQ || item.CAR_REG_ID,
        ntsConfNo: item.NTS_CONF_NO,
        usrId: props.session?.usrId,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cancelCashReceipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cancelData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('현금영수증이 성공적으로 취소되었습니다.');
        handleSearch(currentPage); // 목록 새로고침
      } else {
        alert('취소발행 중 오류가 발생했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('취소발행 오류:', error);
      alert('취소발행 중 오류가 발생했습니다.');
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
    setDtlCustomerName("");
    setDtlSaleItem("");
    setDtlMemo("");
    setDtlTradeProcNm("");
    setDtlTradeSctGubun("");
    setDtlCrStat([]);
    setDtlRcgnNo("");
    setDtlNtsConfNo("");

    // 정렬 옵션 초기화
    setOrdItem("발행일");
    setOrdAscDesc("desc");
    setListCount(10);
    setOrdItemDtl("발행일");
    setOrdAscDescDtl("desc");
    setListCountDtl(10);

    // 검색 버튼을 기본 검색으로 설정
    setSearchBtn(1);

    console.log("검색 조건이 초기화되었습니다.");
  };


  // 엑셀 다운로드용 컬럼 정의
  const excelColumns = [
    { accessorKey: "TRADE_SCT_NM", header: "문서" },
    { accessorKey: "TRADE_DT", header: "거래일시" },
    { accessorKey: "NTS_CONF_NO", header: "국세청승인번호" },
    { accessorKey: "TRADE_TP_NM", header: "거래구분" },
    { accessorKey: "RCGN_NO", header: "식별번호" },
    { accessorKey: "CUST_NM", header: "고객명" },
    { accessorKey: "DLR_NM", header: "담당딜러" },
    { accessorKey: "CAR_NM", header: "품명" },
    { accessorKey: "TRADE_AMT", header: "거래금액" },
    { accessorKey: "CR_TRNS_STAT_NM", header: "상태" }
  ];

  // 숫자 형식으로 처리할 컬럼들
  const numericColumns = ["TRADE_AMT"];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">현금영수증 리스트</h2>

        <div className="guidebox">
          <p className="guidebox__title">매도처리 후 매출증빙과 연계 필요(1:N)</p>
          <p className="guidebox__title">현금영수증 직접 발행 필요</p>
          <p className="guidebox__title">묶음발행기능(차량판매,성능,매도비)</p>
          <p className="guidebox__title">영수증 재전송 기능</p>
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

              {/* 정렬항목 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="ordItemHiddenInputDtl" defaultValue="거래일" />
                <button
                className="select__toggle"
                type="button"
                onClick={() => {
                  closeAllToggles();
                  setIsOrdItemSelectOpenDtl(!isOrdItemSelectOpenDtl);
                }}
              >
                  <span className="select__text">{ordItemDtl === "01" ? "발행일" : ordItemDtl}</span>
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
                    // handleSearch(1); // 자동 검색 비활성화
                  }}
                >
                  발행일
                </li>
                <li
                  className={`select__option ${ordItemDtl === "02" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItemDtl("02");
                    setIsOrdItemSelectOpenDtl(false);
                    // handleSearch(1); // 자동 검색 비활성화
                  }}
                >
                  담당딜러
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
                              className={`select__option ${dtlDtGubun === "상품화등록일" ? "select__option--selected" : ""}`}
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
                    <th>품명</th>
                    <td>
                      <div className="select">
                        <input className="select__input" type="hidden" name="dealer" defaultValue="선택" />
                        <button 
                          className="select__toggle" 
                          type="button"
                          onClick={() => {
                            closeAllToggles();
                            setIsDtlSaleItemSelectOpen(!isDtlSaleItemSelectOpen);
                          }}
                        >
                          <span className="select__text">{dtlSaleItem || "선택"}</span>
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
                          style={{ display: isDtlSaleItemSelectOpen ? "block" : "none" }}
                        >
                          <li
                            className={`select__option ${dtlSaleItem === "" ? "select__option--selected" : ""}`}
                            onClick={() => {
                              setDtlSaleItem("");
                              setIsDtlSaleItemSelectOpen(false);
                            }}
                          >
                            선택
                          </li>
                          {saleItemList.map((item) => (
                            <li
                              key={item.CD}
                              className={`select__option ${dtlSaleItem === item.CD ? "select__option--selected" : ""}`}
                              onClick={() => {
                                setDtlSaleItem(item.CD);
                                setIsDtlSaleItemSelectOpen(false);
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
                    <th>문서형태</th>
                    <td>
                      <div className="form-option-wrap">
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              checked={dtlTradeProcNm === ""} 
                              onChange={() => setDtlTradeProcNm("")}
                              name="group-type1" 
                            />
                            <span className="form-option__title">전체</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              checked={dtlTradeProcNm === "승인거래"}
                              onChange={() => setDtlTradeProcNm("승인거래")}
                              name="group-type1" 
                            />
                            <span className="form-option__title">승인거래</span>
                          </label>
                        </div>

                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              checked={dtlTradeProcNm === "취소거래"}
                              onChange={() => setDtlTradeProcNm("취소거래")}
                              name="group-type1" 
                            />
                            <span className="form-option__title">취소거래</span>
                          </label>
                        </div>
                      </div>
                    </td>
                    <th>거래래구분</th>
                    <td>
                      <div className="form-option-wrap">
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio" 
                              checked={dtlTradeSctGubun === ""}
                              onChange={() => setDtlTradeSctGubun("")}
                              name="group-type2" 
                            />
                            <span className="form-option__title">전체</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio"
                              checked={dtlTradeSctGubun === "소득공제"}
                              onChange={() => setDtlTradeSctGubun("소득공제")}
                              name="group-type2" 
                            />
                            <span className="form-option__title">소득공제</span>
                          </label>
                        </div>

                        <div className="form-option">
                          <label className="form-option__label">
                            <input 
                              type="radio"
                              checked={dtlTradeSctGubun === "지출증빙"}
                              onChange={() => setDtlTradeSctGubun("지출증빙")}
                              name="group-type2" 
                            />
                            <span className="form-option__title">지출증빙</span>
                          </label>
                        </div>
                      </div>
                    </td>

                    <th>상태</th>
                    <td>
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
                  </tr>
                  <tr>
                    <th>식별번호</th>
                    <td>
                      <div className="input">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder="휴대폰/주민등록/사업자/카드번호"
                          value={dtlRcgnNo}
                          onChange={(e) => setDtlRcgnNo(e.target.value)} 
                        />
                        <div className="input__utils">
                          <button 
                            type="button" 
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setDtlRcgnNo("")}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>

                    <th>관리번호</th>
                    <td>
                      <div className="input">
                        <input 
                          type="text" 
                          className="input__field" 
                          placeholder="문서번호/국세청승인번호"
                          value={dtlNtsConfNo}
                          onChange={(e) => setDtlNtsConfNo(e.target.value)}
                        />
                        <div className="input__utils">
                          <button 
                            type="button" 
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setDtlNtsConfNo("")}
                          >
                            삭제
                          </button>
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
                          <button 
                            type="button" 
                            className="jsInputClear input__clear ico ico--input-delete"
                            onClick={() => setDtlMemo("")}
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
          발행 리스트<span>Total {pagination?.totalCount || carList?.length || 0}건</span>
        </h2>
        <div className="table-wrap__head table-wrap__title">
          <button
            type="button"
            className="btn btn--red btn--padding--r30"
            onClick={() => {
              router.push('/cash-receipts/register');
            }}
          >
            <span className="ico ico--add"></span>건별 발행 등록
          </button>
          <div className="input-group">
            {/* 정렬 항목 */}
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
                <span className="select__text">{ordItem === "01" ? "발행일" : ordItem}</span>
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
                    handleSearch(1);
                  }}
                >
                  발행일
                </li>
                <li
                  className={`select__option ${ordItem === "02" ? "select__option--selected" : ""}`}
                  onClick={() => {
                    setOrdItem("02");
                    setIsOrdItemSelectOpen(false);
                    handleSearch(1);
                  }}
                >
                  담당딜러
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
              filePrefix="현금영수증리스트"
              className="btn btn--white"
              text="다운로드"
              sheetName="현금영수증"
            />
          </div>
        </div>

        <table className="table">
          <colgroup>
            <col style={{ width: "80px" }} />
            <col style={{ width: "200px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "auto" }} />
            {/*고객명*/}
            <col style={{ width: "130px" }} />
            <col style={{ width: "auto" }} />
            {/*고객명*/}
            <col style={{ width: "125px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>문서</th>
              <th>거래일시</th>
              <th>국세청승인번호</th>
              <th>거래구분</th>
              {/*소득공제/지출증빙*/}
              <th>식별번호</th>
              <th>고객명</th>
              <th>고객전화번호</th>
              <th>담당딜러</th>
              <th>품명</th>
              <th>거래금액</th>
              <th>상태</th>
              <th>바로가기</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
            {carList.map((car, index) => (
              <tr key={index}>
                <td>{car.TRADE_SCT_NM}</td>
                <td>{car.TRADE_DT}</td>
                <td>{car.NTS_CONF_NO}</td>
                <td>{car.TRADE_TP_NM}</td>
                <td>{car.RCGN_NO}</td>
                <td>{car.CUST_NM}</td>
                <td>{car.CUST_HP}</td>
                <td>{car.DLR_NM}</td>
                <td>{car.CAR_NM} {car.CAR_NO}<br/>{car.CR_TRNS_STAT_NM}</td>
                <td>{car.TRADE_AMT}</td>
                <td>{car.CR_TRNS_STAT_NM}</td>
                <td>
                  <div className="input-group input-group--sm input-group--center">
                    <div className="select select--utils">
                      <button type="button" className="select__toggle">더보기</button>

                      <ul className="select__menu">
                        <li className="select__option">
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePrintReceipt(car);
                            }}
                          >
                            영수증인쇄
                          </a>
                        </li>
                        <li className="select__option">
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSendAlimtalk(car);
                            }}
                          >
                            알림톡전송
                          </a>
                        </li>
                        <li className="select__option">
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSendEmail(car);
                            }}
                          >
                            메일전송
                          </a>
                        </li>
                        <li className="select__option">
                          <a href="#">Fax전송</a>
                        </li>
                        <li className="select__option">
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCancelIssuance(car);
                            }}
                          >
                            취소발행
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
                    onClick={() => router.push(`/detail/cash-receipts/${car.id}`)}
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
              <th>거래구분</th>
              <th>문서형태</th>
              <th>건수</th>
              <th>공급가액</th>
              <th>부가세</th>
              <th>거래금액</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan={2}>{carCashSummary?.[0]?.TRADE_TP_NM || '소득공제'}</td>
              <td>{carCashSummary?.[0]?.TRADE_PROC_NM || '승인'}</td>
              <td>{carCashSummary?.[0]?.CNT || 0}</td>
              <td>{carCashSummary?.[0]?.TRADE_AMT?.toLocaleString() || 0}</td>
              <td>{carCashSummary?.[0]?.SUP_PRC?.toLocaleString() || 0}</td>
              <td>{carCashSummary?.[0]?.VAT?.toLocaleString() || 0}</td>
            </tr>
            <tr>
              <td>{carCashSummary?.[1]?.TRADE_PROC_NM || '취소'}</td>
              <td>{carCashSummary?.[1]?.count || 0}</td>
              <td>{carCashSummary?.[1]?.supplyAmount?.toLocaleString() || 0}</td>
              <td>{carCashSummary?.[1]?.taxAmount?.toLocaleString() || 0}</td>
              <td>{carCashSummary?.[1]?.totalAmount?.toLocaleString() || 0}</td>
            </tr>
            <tr>
              <td rowSpan={2}>{carCashSummary?.[2]?.TRADE_TP_NM || '지출증빙'}</td>
              <td>{carCashSummary?.[2]?.TRADE_PROC_NM || '승인'}</td>
              <td>{carCashSummary?.[2]?.CNT || 0}</td>
              <td>{carCashSummary?.[2]?.TRADE_AMT?.toLocaleString() || 0}</td>
              <td>{carCashSummary?.[2]?.SUP_PRC?.toLocaleString() || 0}</td>
              <td>{carCashSummary?.[2]?.VAT?.toLocaleString() || 0}</td>
            </tr>
            <tr>
              <td>{carCashSummary?.[3]?.TRADE_PROC_NM || '취소'}</td>
              <td>{carCashSummary?.[3]?.count || 0}</td>
              <td>{carCashSummary?.[3]?.supplyAmount?.toLocaleString() || 0}</td>
              <td>{carCashSummary?.[3]?.taxAmount?.toLocaleString() || 0}</td>
              <td>{carCashSummary?.[3]?.totalAmount?.toLocaleString() || 0}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td rowSpan={2}>{carCashSummary?.[4]?.TRADE_TP_NM || '합계계'}</td>
              <td>{carCashSummary?.[4]?.TRADE_PROC_NM || '승인'}</td>
              <td>{carCashSummary?.[4]?.CNT || 0}</td>
              <td>{carCashSummary?.[4]?.TRADE_AMT?.toLocaleString() || 0}</td>
              <td>{carCashSummary?.[4]?.SUP_PRC?.toLocaleString() || 0}</td>
              <td>{carCashSummary?.[4]?.VAT?.toLocaleString() || 0}</td>
            </tr>
            <tr>
              <td>{carCashSummary?.[5]?.TRADE_PROC_NM || '취소'}</td>
              <td>{carCashSummary?.[5]?.count || 0}</td>
              <td>{carCashSummary?.[5]?.supplyAmount?.toLocaleString() || 0}</td>
              <td>{carCashSummary?.[5]?.taxAmount?.toLocaleString() || 0}</td>
              <td>{carCashSummary?.[5]?.totalAmount?.toLocaleString() || 0}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  );
}
