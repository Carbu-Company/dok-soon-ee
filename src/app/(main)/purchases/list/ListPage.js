"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PaginationComponent from '@/components/utils/PaginationComponent';

export default function ListPage(props) {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 기본 검색 영역
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // props 값 가져오기
    const [loading, setLoading] = useState(false);
    const [carList, setCarList] = useState(props.carList?.data || []);
    const [dealerList, setDealerList] = useState(props.dealerList || []);
    const [currentPage, setCurrentPage] = useState(props.page || 1);
    const [pageSize, setPageSize] = useState(props.pageSize || 10);
    const searchAction = props.searchAction;
    const [totalPages, setTotalPages] = useState(props.carList?.pagination?.totalPages || 2);

    //console.log(props.carList);

    // 차량번호
    const [carNo, setCarNo] = useState('');
    
    // 담당 딜러
    const [selectedDealer, setSelectedDealer] = useState('');
    const [isDealerSelectOpen, setIsDealerSelectOpen] = useState(false);

    // 검색 구분 항목
    const [dtGubun, setDtGubun] = useState('01');
    const [isDtGubunSelectOpen, setIsDtGubunSelectOpen] = useState(false);

    // 검색 기간
    const [startDt, setStartDt] = useState('');
    const [endDt, setEndDt] = useState('');


    // 현재 페이지 데이터는 서버에서 받아온 데이터를 그대로 사용
    const currentPageData = carList;

    //console.log(currentPageData);
    // currentPageData가 존재하면 map으로 데이터 로그 출력
    //carList && carList.map((item, index) => {
    //  console.log(`[${index}] 차량정보:`, item);
    //});

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 페이지네이션 영역
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // 페이지 정렬 순서 항목 

    // 정렬순서 항목
    const [ordItem, setOrdItem] = useState('제시일');
    const [isOrdItemSelectOpen, setIsOrdItemSelectOpen] = useState(false);

    // 정렬순서
    const [ordAscDesc, setOrdAscDesc] = useState('desc');
    const [isOrdAscDescSelectOpen, setIsOrdAscDescSelectOpen] = useState(false);

    // 건수 - pageSize 
    const [listCount, setListCount] = useState(10);
    const [isListCountSelectOpen, setIsListCountSelectOpen] = useState(false);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 상세 검색 영역
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 상세 검색 차량번호
    const [dtlCarNo, setDtlCarNo] = useState(carNo);
    // 상세 검색 담당 딜러
    const [dtlDealer, setDtlDealer] = useState(selectedDealer);
    const [isDtlDealerSelectOpen, setIsDtlDealerSelectOpen] = useState(false);

    // 상세 검색 검색기간 구분
    const [dtlDtGubun, setDtlDtGubun] = useState(dtGubun);
    const [isDtlDtGubunSelectOpen, setIsDtlDtGubunSelectOpen] = useState(false);

    // 상세 검색 검색기간 
    const [dtlStartDt, setDtlStartDt] = useState(startDt);
    const [dtlEndDt, setDtlEndDt] = useState(endDt);

    // 상세 검색 고객명
    const [dtlCustomerName, setDtlCustomerName] = useState('');

    // 상세 검색 고객구분
    const [dtlCustGubun, setDtlCustGubun] = useState('01');
    const [isDtlCustGubunSelectOpen, setIsDtlCustGubunSelectOpen] = useState(false);
    
    // 상세 검색 증빙종류
    const [dtlEvdcGubun, setDtlEvdcGubun] = useState('01');
    const [isDtlEvdcGubunSelectOpen, setIsDtlEvdcGubunSelectOpen] = useState(false);

    // 상세 검색 제시구분분
    const [dtlPrsnGubun, setDtlPrsnGubun] = useState('01');
    const [isDtlPrsnGubunSelectOpen, setIsDtlPrsnGubunSelectOpen] = useState(false);

    // 상세 검색 사업자등록번호
    const [dtlOwnerBrno, setDtlOwnerBrno] = useState('');

    // 상세 검색 주민(법인)등록번호
    const [dtlOwnerSsn, setDtlOwnerSsn] = useState('');

    // 상세 검색 계약서번호
    const [dtlCtshNo, setDtlCtshNo] = useState('');

    // 상세 검색 차량번호(매입전)
    const [dtlCarNoBefore, setDtlCarNoBefore] = useState('');

    // 상세 검색 정렬순서
    const [dtlSortGubun, setDtlSortGubun] = useState('desc');

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 검색 영역
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 기본 파라미터
    const defaultParams = {
      carAgent: props.session?.agentId,
      page: currentPage,
      pageSize: pageSize
    };

    // 검색 파라미터
    const [searchParams, setSearchParams] = useState({
      carNo: carNo,  
      dealer: selectedDealer,  
      dtGubun: dtGubun,  
      startDt: startDt,  
      endDt: endDt  
    });


    // 검색 버튼 클릭 핸들러
    const handleSearch = async (pageNum = 1) => {
      console.log('검색 버튼 클릭');

      try {
        setLoading(true);
        const searchParamsWithPage = {
          ...defaultParams,
          ...searchParams
        };
  
        const result = await searchAction(searchParamsWithPage);
        
        if (result.success) {
            setCarList(result.data || []);
            setTotalPages(result.totalPages || 1);
            setCurrentPage(pageNum);
        } else {
            alert('검색 중 오류가 발생했습니다: ' + result.error);
        }
      } catch (error) {
          alert('검색 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    // 상세 검색 버튼 클릭 핸들러
    const handleDtlSearch = () => {
      console.log('상세 검색 버튼 클릭');
    };
    

    /**
     * 페이지 처리
     */
    const handlePageChange = async (page) => {
          await handleSearch(page);
    };
    

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
                      onChange={(e) => setCarNo(e.target.value)}
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
                    <button className="select__toggle" type="button" onClick={() => setIsDealerSelectOpen(!isDealerSelectOpen)}>
                      <span className="select__text">{selectedDealer ? dealerList.find(d => d.USR_ID === selectedDealer)?.USR_NM || '선택' : '선택'}</span>
                      <Image
                        className="select__arrow"
                        src="/images/ico-dropdown.svg"
                        alt=""
                        width={10}
                        height={10}
                      />
                    </button>

                    <ul className="select__menu" style={{ display: isDealerSelectOpen ? 'block' : 'none' }}>
                      <li
                        className={`select__option ${!selectedDealer ? 'select__option--selected' : ''}`}
                        onClick={() => {
                          setSelectedDealer('');
                          setIsDealerSelectOpen(false);
                        }}
                      >
                        선택
                      </li>
                      {dealerList.map((dealer, index) => (
                        <li
                          key={index}
                          className={`select__option ${selectedDealer === dealer.USR_ID ? 'select__option--selected' : ''}`}
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
                      <button className="select__toggle" type="button" onClick={() => setIsDtGubunSelectOpen(!isDtGubunSelectOpen)}>
                        <span className="select__text">선택</span>
                        <Image
                          className="select__arrow"
                          src="/images/ico-dropdown.svg"
                          alt=""
                          width={10}
                          height={10}
                        />
                      </button>

                      <ul className="select__menu" style={{ display: isDtGubunSelectOpen ? 'block' : 'none' }}>
                        <li
                          className={`select__option ${dtGubun === '제시(매입)일' ? 'select__option--selected' : ''}`} 
                          onClick={() => {
                            setDtGubun('01');
                            setIsDtGubunSelectOpen(false);
                          }}>
                          제시(매입)일
                        </li>
                        <li 
                          className={`select__option ${dtGubun === '이전일' ? 'select__option--selected' : ''}`}
                          onClick={() => {
                            setDtGubun('02');
                            setIsDtGubunSelectOpen(false);
                          }}>
                          이전일
                        </li>
                        <li 
                          className={`select__option ${dtGubun === '똑순이등록일' ? 'select__option--selected' : ''}`}
                          onClick={() => {
                            setDtGubun('03');
                            setIsDtGubunSelectOpen(false);
                          }}>
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
                        onChange={(e) => setStartDt(e.target.value)}
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
                        onChange={(e) => setEndDt(e.target.value)}
                      />
                    </div>

                    {/* disabled 속성 제거 시, 활성화 상태 적용 */}
                    <button type="button" className="btn btn--type03" onClick={handleSearch} disabled={loading}>
                      <span className="ico ico--search"></span>차량검색
                    </button>
                    <button
                      type="button"
                      className="jsSearchboxBtn btn btn--type02"
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
          <div className="jsSearchbox searchbox">
            <div className="searchbox__head">
              <h3 className="searchbox__title">상세검색</h3>

              <div className="input-group">
                <button className="btn btn--white" type="button">
                  <span className="ico ico--reset"></span>선택 초기화
                </button>

                {/* 딜러명 */}
                <div className="select select--dark w160">
                  <input
                    className="select__input"
                    type="hidden"
                    name="dealer"
                    defaultValue="선택"
                  />
                  <button className="select__toggle" type="button">
                    <span className="select__text">선택</span>
                    <Image
                          className="select__arrow"
                          src="/images/ico-dropdown.svg"
                          alt=""
                          width={10}
                          height={10}
                        />
                  </button>

                  <ul className="select__menu">
                    <li
                      className="select__option select__option--selected"
                      data-value="딜러명1"
                    >
                      딜러명1
                    </li>
                    <li className="select__option" data-value="딜러명2">
                      딜러명2
                    </li>
                    <li className="select__option" data-value="딜러명3">
                      딜러명3
                    </li>
                    <li className="select__option" data-value="딜러명4">
                      딜러명4
                    </li>
                  </ul>
                </div>

                {/* 정렬순서 */}
                <div className="select select--dark w160">
                  <input
                    className="select__input"
                    type="hidden"
                    name="dealer"
                    defaultValue="desc"
                  />
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
                    <li
                      className="select__option select__option--selected"
                      data-value="desc"
                    >
                      내림차순
                    </li>
                    <li className="select__option" data-value="asc">
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
                    defaultValue="10"
                  />
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
                    <li
                      className="select__option select__option--selected"
                      data-value="10"
                    >
                      10건씩
                    </li>
                    <li className="select__option" data-value="20">
                      20건씩
                    </li>
                    <li className="select__option" data-value="30">
                      30건씩
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
                            onChange={(e) => setDtlCarNo(e.target.value)}
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
                          <button className="select__toggle" type="button" onClick={() => setIsDtlDealerSelectOpen(!isDtlDealerSelectOpen)}>
                            <span className="select__text">{dtlDealer ? dealerList.find(d => d.USR_ID === dtlDealer)?.USR_NM || '선택' : '선택'}</span>
                            <Image
                              className="select__arrow"
                              src="/images/ico-dropdown.svg"
                              alt=""
                              width={10}
                              height={10}
                            />
                          </button>

                          <ul className="select__menu" style={{ display: isDtlDealerSelectOpen ? 'block' : 'none' }}>
                            <li
                              className={`select__option ${!dtlDealer ? 'select__option--selected' : ''}`}
                              onClick={() => {
                                setDtlDealer('');
                                setIsDtlDealerSelectOpen(false);
                              }}
                            >
                              선택
                            </li>
                            {dealerList.map((dealer, index) => (
                              <li
                                key={index}
                                className={`select__option ${dtlDealer === dealer.USR_ID ? 'select__option--selected' : ''}`}
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
                            <button className="select__toggle" type="button" onClick={() => setIsDtlDtGubunSelectOpen(!isDtlDtGubunSelectOpen)}>
                              <span className="select__text">{dtlDtGubun || '선택'}</span>
                              <Image
                                className="select__arrow"
                                src="/images/ico-dropdown.svg"
                                alt=""
                                width={10}
                                height={10}
                              />
                            </button>

                            <ul className="select__menu" style={{ display: isDtlDtGubunSelectOpen ? 'block' : 'none' }}>
                              <li
                                className={`select__option ${dtlDtGubun === '제시(매입)일' ? 'select__option--selected' : ''}`}
                                onClick={() => {
                                  setDtlDtGubun('01');
                                  setIsDtlDtGubunSelectOpen(false);
                                }}>
                                제시(매입)일
                              </li>
                              <li
                                className={`select__option ${dtlDtGubun === '이전일' ? 'select__option--selected' : ''}`}
                                onClick={() => {
                                  setDtlDtGubun('02');
                                  setIsDtlDtGubunSelectOpen(false);
                                }}>
                                이전일
                              </li>
                              <li
                                className={`select__option ${dtlDtGubun === '똑순이등록일' ? 'select__option--selected' : ''}`}
                                onClick={() => {
                                  setDtlDtGubun('03');
                                  setIsDtlDtGubunSelectOpen(false);
                                }}>
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
                              onChange={(e) => setDtlStartDt(e.target.value)}
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
                              onChange={(e) => setDtlEndDt(e.target.value)}
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
                            onChange={(e) => setDtlCarNoBefore(e.target.value)}
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
                            onChange={(e) => setDtlCustomerName(e.target.value)}
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
                            defaultValue="01"
                          />
                          <button className="select__toggle" type="button" onClick={() => setIsDtlCustGubunSelectOpen(!isDtlCustGubunSelectOpen)}>
                            <span className="select__text">{dtlCustGubun === '01' ? '개인' : dtlCustGubun === '02' ? '법인' : '선택'}</span>
                            <Image
                              className="select__arrow"
                              src="/images/ico-dropdown.svg"
                              alt=""
                              width={10}
                              height={10}
                            />
                          </button>

                          <ul className="select__menu" style={{ display: isDtlCustGubunSelectOpen ? 'block' : 'none' }}>
                            <li
                              className={`select__option ${dtlCustGubun === '01' ? 'select__option--selected' : ''}`}
                              onClick={() => {
                                setDtlCustGubun('01');
                                setIsDtlCustGubunSelectOpen(false);
                              }}
                            >
                              개인
                            </li>
                            <li 
                              className={`select__option ${dtlCustGubun === '02' ? 'select__option--selected' : ''}`}
                              onClick={() => {
                                setDtlCustGubun('02');
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
                            defaultValue="01"
                          />
                          <button className="select__toggle" type="button" onClick={() => setIsDtlEvdcGubunSelectOpen(!isDtlEvdcGubunSelectOpen)}>
                            <span className="select__text">{dtlEvdcGubun === '01' ? '의제매입' : dtlEvdcGubun === '02' ? '세금계산서' : dtlEvdcGubun === '03' ? '계산서' : '선택'}</span>
                            <Image
                                className="select__arrow"
                                src="/images/ico-dropdown.svg"
                                alt=""
                                width={10}
                                height={10}
                            />
                          </button>

                          <ul className="select__menu" style={{ display: isDtlEvdcGubunSelectOpen ? 'block' : 'none' }}>
                            <li
                              className={`select__option ${dtlEvdcGubun === '01' ? 'select__option--selected' : ''}`}
                              onClick={() => {
                                setDtlEvdcGubun('01');
                                setIsDtlEvdcGubunSelectOpen(false);
                              }}
                            >
                              의제매입
                            </li>
                            <li 
                              className={`select__option ${dtlEvdcGubun === '02' ? 'select__option--selected' : ''}`}
                              onClick={() => {
                                setDtlEvdcGubun('02');
                                setIsDtlEvdcGubunSelectOpen(false);
                              }}
                            >
                              세금계산서
                            </li>
                            <li 
                              className={`select__option ${dtlEvdcGubun === '03' ? 'select__option--selected' : ''}`}
                              onClick={() => {
                                setDtlEvdcGubun('03');
                                setIsDtlEvdcGubunSelectOpen(false);
                              }}
                            >
                              계산서
                            </li>
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
                            onChange={(e) => setDtlOwnerSsn(e.target.value)}                            
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
                            onChange={(e) => setDtlCtshNo(e.target.value)}
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
                                checked={dtlPrsnGubun === ''}
                                name="group-type"
                                onChange={() => setDtlPrsnGubun('')}
                              />
                              <span className="form-option__title">전체</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input 
                                type="radio" 
                                name="group-type"
                                checked={dtlPrsnGubun === '01'}
                                onChange={() => setDtlPrsnGubun('01')}
                              />
                              <span className="form-option__title">
                                상사매입
                              </span>
                            </label>
                          </div>

                          <div className="form-option">
                            <label className="form-option__label">
                              <input 
                                type="radio" 
                                name="group-type"
                                checked={dtlPrsnGubun === '02'} 
                                onChange={() => setDtlPrsnGubun('02')}
                              />
                              <span className="form-option__title">
                                고객위탁
                              </span>
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
                            onChange={(e) => setDtlOwnerBrno(e.target.value)}
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
                  >
                    취소
                  </button>
                  <button className="btn btn--primary" type="button" onClick={handleDtlSearch}>
                    <span className="ico ico--search"></span>검색
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="table-wrap">
          <h2 className="table-wrap__title">
            매입차량 리스트<span>Total 100건</span>
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
                <input
                  className="select__input"
                  type="hidden"
                  name="dealer"
                  defaultValue="제시일"
                />
                <button className="select__toggle" type="button" onClick={() => setIsOrdItemSelectOpen(!isOrdItemSelectOpen)}>
                  <span className="select__text">{ordItem || '제시일'}</span>
                  <Image
                          className="select__arrow"
                          src="/images/ico-dropdown.svg"
                          alt=""
                          width={10}
                          height={10}
                        />
                </button>

                <ul className="select__menu" style={{ display: isOrdItemSelectOpen ? 'block' : 'none' }}>
                  <li
                    className={`select__option ${ordItem === '제시일' ? 'select__option--selected' : ''}`}
                    onClick={() => {
                      setOrdItem('제시일');
                      setIsOrdItemSelectOpen(false);
                    }}
                  >
                    제시일
                  </li>
                  <li 
                    className={`select__option ${ordItem === '담당딜러' ? 'select__option--selected' : ''}`}
                    onClick={() => {
                      setOrdItem('담당딜러');
                      setIsOrdItemSelectOpen(false);
                    }}
                  >
                    담당딜러
                  </li>
                  <li 
                    className={`select__option ${ordItem === '제시구분' ? 'select__option--selected' : ''}`}
                    onClick={() => {
                      setOrdItem('제시구분');
                      setIsOrdItemSelectOpen(false);
                    }}
                  >
                    제시구분
                  </li>
                  <li 
                    className={`select__option ${ordItem === '고객유형' ? 'select__option--selected' : ''}`}
                    onClick={() => {
                      setOrdItem('고객유형');
                      setIsOrdItemSelectOpen(false);
                    }}
                  >
                    고객유형
                  </li>
                </ul>
              </div>

              {/* 정렬순서 */}
              <div className="select select--dark w160">
                <input
                  className="select__input"
                  type="hidden"
                  name="dealer"
                  defaultValue="desc"
                />
                <button className="select__toggle" type="button" onClick={() => setIsOrdAscDescSelectOpen(!isOrdAscDescSelectOpen)}>
                  <span className="select__text">{ordAscDesc === 'desc' ? '내림차순' : '오름차순'}</span>
                  <Image
                          className="select__arrow"
                          src="/images/ico-dropdown.svg"
                          alt=""
                          width={10}
                          height={10}
                        />
                </button>

                <ul className="select__menu" style={{ display: isOrdAscDescSelectOpen ? 'block' : 'none' }}>
                  <li
                    className={`select__option ${ordAscDesc === 'desc' ? 'select__option--selected' : ''}`}
                    onClick={() => {
                      setOrdAscDesc('desc');
                      setIsOrdAscDescSelectOpen(false);
                    }}
                  >
                    내림차순
                  </li>
                  <li 
                    className={`select__option ${ordAscDesc === 'asc' ? 'select__option--selected' : ''}`}
                    onClick={() => {
                      setOrdAscDesc('asc');
                      setIsOrdAscDescSelectOpen(false);
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
                <button className="select__toggle" type="button" onClick={() => setIsListCountSelectOpen(!isListCountSelectOpen)}>
                  <span className="select__text">{listCount}건씩</span>
                  <Image
                          className="select__arrow"
                          src="/images/ico-dropdown.svg"
                          alt=""
                          width={10}
                          height={10}
                        />
                </button>

                <ul className="select__menu" style={{ display: isListCountSelectOpen ? 'block' : 'none' }}>
                  <li
                    className={`select__option ${listCount === 10 ? 'select__option--selected' : ''}`}
                    onClick={() => {
                      setListCount(10);
                      setPageSize(10);
                      setIsListCountSelectOpen(false);
                    }}
                  >
                    10건씩
                  </li>
                  <li 
                    className={`select__option ${listCount === 30 ? 'select__option--selected' : ''}`}
                    onClick={() => {
                      setListCount(30);
                      setPageSize(30);
                      setIsListCountSelectOpen(false);
                    }}
                  >
                    30건씩
                  </li>
                  <li 
                    className={`select__option ${listCount === 50 ? 'select__option--selected' : ''}`}
                    onClick={() => {
                      setListCount(50);
                      setPageSize(50);
                      setIsListCountSelectOpen(false);
                    }}
                  >
                    50건씩
                  </li>
                </ul>
              </div>

              <button className="btn btn--white" type="button">
                <span className="ico ico--download"></span>다운로드
              </button>
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
            {currentPageData && currentPageData.length > 0 ? (
              currentPageData.map((car, index) => (
                <tr key={`${car.CAR_REGID}-${index}`} className="hover:bg-purple-900/10 cursor-pointer" onClick={() => window.location.href = `/car/sugg/detail/${car.CAR_REGID}`}>
                  <td>{car.CAR_REG_DT}</td>
                  <td>상사</td>
                  <td>{car.CAR_NO}</td>
                  <td>쏘나타</td>
                  <td>100,000,000</td>
                  <td>나딜러</td>
                  <td>100,000,000</td>
                  <td>1,500,000</td>
                  <td>165,000</td>
                  <td></td>

                  <td>
                    <div className="input-group input-group--sm input-group--center">
                      <div className="select select--utils">
                        <button type="button" className="select__toggle">
                          더보기
                        </button>

                        <ul className="select__menu">
                          <li className="select__option">
                            <Link href="#">상품화비용 등록</Link>
                          </li>
                          <li className="select__option">
                            <Link href="#">재고금융 등록</Link>
                          </li>
                          <li className="select__option">
                            <Link href="#">판매 처리</Link>
                          </li>
                          <li className="select__option">
                            <Link href="/purchases/editor">매입 수정</Link>
                          </li>
                          <li className="select__option">
                            <Link href="#">매입 취소</Link>
                          </li>
                          <li className="select__option">
                            <Link href="#">매입 삭제</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button type="button" className="btn btn--light btn--sm">
                      <Link href={`/car/sugg/detail/${car.CAR_REGID}`}>상세보기</Link>
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

          {/* 페이지네이션 */}
          {currentPageData && currentPageData.length > 0 && (
          <div className="pagination">
            
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                show={totalPages > 1}
            />

          </div>
          )}
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
              <tr>
                <td>상사</td>
                <td>100</td>
                <td>1,000,000</td>
                <td>100,000</td>
                <td>1,100,000</td>
                <td className="text-red">500,000</td>
                <td>
                  <span className="text-point">165,000</span>
                </td>
              </tr>
              <tr>
                <td>고객위탁</td>
                <td>100</td>
                <td>1,000,000</td>
                <td>100,000</td>
                <td>1,100,000</td>
                <td>500,000</td>
                <td>165,000</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>합계</th>
                <th>100</th>
                <th>1,000,000</th>
                <th>100,000</th>
                <th>1,100,000</th>
                <th>500,000</th>
                <th>165,000</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
    )
}