"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@/components/ui/pagination";

export default function AgentList(props) {
  
  const router = useRouter();

  // setSearchBtn
  const [searchBtn, setSearchBtn] = useState(0);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 기본 검색 영역
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // props 값 가져오기
  const [loading, setLoading] = useState(false);

  // 초기 데이터: 서버에서 전달된 데이터 구조 처리
  const initialAgentListData = props.agentList?.data?.agentlist || [];
  const initialPagination = props.agentList?.data?.pagination || {};

  const [agentList, setAgentList] = useState(initialAgentListData);




  console.log('agentList*******************:', agentList);
  const [pagination, setPagination] = useState(initialPagination);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages || 1);


  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage || 1);
  const [pageSize, setPageSize] = useState(initialPagination.pageSize || 10);

  const searchAction = props.searchAction;

  const [cmbtCdList, setCmbtCdList] = useState(props.cmbtCdList || []);

  // 상사명
  const [agentNm, setAgentNm] = useState("");

  // 조합코드
  const [cmbtCd, setCmbtCd] = useState("");
  const [isCmbtCdSelectOpen, setIsCmbtCdSelectOpen] = useState(false);

  // 검색 기간
  const [startDt, setStartDt] = useState("");
  const [endDt, setEndDt] = useState("");

  // 검색 기간 구분
  const [dtGubun, setDtGubun] = useState("");
  const [isDtGubunSelectOpen, setIsDtGubunSelectOpen] = useState(false);

  // 건수 - pageSize
  const [listCount, setListCount] = useState(10);
  const [isListCountSelectOpen, setIsListCountSelectOpen] = useState(false);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 상세 검색 영역
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 페이지네이션 영역
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 페이지 정렬 순서 항목


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
    if (searchBtn === 1 || searchBtn === 2) handleSearch(1);
    console.log("pageSize", pageSize);
    console.log("listCount", listCountDtl);
  }, [listCountDtl]);


  // 모든 토글을 닫는 함수
  const closeAllToggles = () => {
    setIsCmbtCdSelectOpen(false);
    setIsDtGubunSelectOpen(false);
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
    agentNm: searchBtn === 1 ? agentNm : '',
    cmbtCd: searchBtn === 1 ? cmbtCd : '',
    dtGubun: searchBtn === 1 ? dtGubun : '',
    startDt: searchBtn === 1 ? startDt : '',
    endDt: searchBtn === 1 ? endDt : '',
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
          const responseData = result.data?.list?.agentlist || [];
          const paginationInfo = result.data?.list?.pagination || {};

          setAgentList(responseData);
          setPagination(paginationInfo);

          // 서버에서 제공하는 페이지네이션 정보 사용
          setTotalPages(paginationInfo.totalPages || 1);
          setCurrentPage(paginationInfo.currentPage || pageNum);
        } else {
          alert("검색 중 오류가 발생했습니다: " + (result?.error || "unknown"));
        }
      } else {
        // searchAction이 없으면 /api/purchases 엔드포인트 호출 시도
        const res = await fetch(`/api/agents?page=${pageNum}&pageSize=${pageSize}`);
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

  /**
   * 페이지 처리
   */
  const handlePageChange = async page => {
    await handleSearch(page);
  };

  // 선택 초기화 함수
  const handleResetSearch = () => {

    // 기본 검색 필드 초기화
    setAgentNm("");
    setCmbtCd("");
    setDtGubun("");
    setStartDt("");
    setEndDt("");  

    // 검색 버튼을 기본 검색으로 설정
    setSearchBtn(1);

    console.log("검색 조건이 초기화되었습니다.");
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">상사 리스트 [관리자]</h2>
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
            <th>상사명</th>
              <td>
                <div className="input">
                  <input
                    type="text"
                    className="input__field"
                    placeholder="상사명"
                    value={agentNm}
                    onChange={e => setAgentNm(e.target.value)}
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
              <th>조합코드</th>
              <td>
                <div className="select">
                  <input
                    className="select__input"
                    type="hidden"
                    name="cmbtCd"
                    defaultValue="선택1"
                  />
                  <button
                    className="select__toggle"
                    type="button"
                    onClick={() => {
                      closeAllToggles();
                      setIsCmbtCdSelectOpen(!isCmbtCdSelectOpen);
                    }}
                  >
                    <span className="select__text">
                      {cmbtCd
                        ? cmbtCdList.find(c => c.CD_ID === cmbtCd)?.CD_NM || "선택"
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
                    style={{ display: isCmbtCdSelectOpen ? "block" : "none" }}
                  >
                    <li
                      className={`select__option ${!cmbtCd ? "select__option--selected" : ""}`}
                      onClick={() => {
                        setCmbtCd("");
                        setIsCmbtCdSelectOpen(false);
                      }}
                    >
                      선택
                    </li>
                    {cmbtCdList.map((cmbtCd, index) => (
                      <li
                        key={index}
                        className={`select__option ${cmbtCd === cmbtCd.CD_ID ? "select__option--selected" : ""}`}
                        data-value={cmbtCd.CD_ID}
                        onClick={() => {
                          setCmbtCd(cmbtCd.CD_ID);
                          setIsCmbtCdSelectOpen(false);
                        }}
                      >
                        {cmbtCd.CD_NM}
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
                      name="dtGubun"
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
                          ? "등록일"
                          : dtGubun === "02"
                            ? "개업일"
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
                        등록일
                      </li>
                      <li
                        className={`select__option ${dtGubun === "02" ? "select__option--selected" : ""}`}
                        onClick={() => {
                          setDtGubun("02");
                          setIsDtGubunSelectOpen(false);
                        }}
                      >
                        개업일
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
                    <span className="ico ico--search"></span>상사 검색
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">
          리스트<span>Total {pagination?.totalCount || agentList?.length || 0}건</span>
        </h2>


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
          </colgroup>
          <thead>
            <tr>
              <th>상사명</th>
              <th>등록일</th>
              <th>사업자번호</th>
              <th>대표자명</th>
              <th>조합명</th>
              <th>담당자명</th>
              <th>담당자연락처</th>
              <th>회사연락처</th>
              <th>주소</th>
              <th>상태</th>
              <th>상태</th>
              <th>수정하기</th>
            </tr>
          </thead>
          <tbody>
            {agentList.map((agent, index) => (
            <tr key={index}>
              <td>{agent.COMNAME}</td>
              <td>{agent.REGDATE}</td>
              <td>{agent.BRNO}</td>
              <td>{agent.PRES_NM}</td>
              <td>{agent.CMBT_NM}</td>
              <td>{agent.AEMP_NM}</td>
              <td>{agent.AEMP_PHON}</td>
              <td>{agent.PHON}</td>
              <td>{agent.AGENT_EMAIL}</td>
              <td>{agent.AGENT_ADDR}</td>
              <td>{agent.AGENT_STAT_CD_NM}</td>
              <td>
                <button
                  type="button"
                  className="btn btn--light btn--sm"
                  onClick={() => router.push(`/sys-admin/use-req/edit/${agent.AGENT_ID}`)}
                >
                  수정하기
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

    </main>
  );
}
