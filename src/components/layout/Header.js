"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { getCarSearchList } from "../../app/(main)/api/carApi";

export default function Header({ session }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1); // 초기에는 포커스된 항목 없음
  const [selectedCarIndex, setSelectedCarIndex] = useState(-1); // 초기에는 선택된 차량 없음
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  
  
  // session에서 agentId 가져오기, 없으면 기본값 사용
  const agentId = session?.agentId;

  // 차량 검색 API 호출 함수
  const searchCars = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getCarSearchList(agentId, query);
      if (response.success && response.data && response.data.carlist) {
        // API 응답 데이터를 UI 형식에 맞게 변환하고 최대 10개로 제한
        const formattedResults = response.data.carlist.slice(0, 10).map((car, index) => ({
          id: car.CAR_REG_ID || index,
          carNumber: car.CAR_NO || '',
          model: car.CAR_NM || '',
          dealer: car.DLR_NM || '',
          status: car.CAR_STAT_NM || '매입',
          statusType: getStatusType(car.CAR_STAT_NM),
          lastUpdated: formatLastUpdated(car.MOD_DTIME),
          carRegId: car.CAR_REG_ID,
          carRegDt: car.CAR_REG_DT,
          carStatCd: car.CAR_STAT_CD,
          dlrId: car.DLR_ID,
          carKndCd: car.CAR_KND_CD,
          carKndNm: car.CAR_KND_NM,
          purBefCarNo: car.PUR_BEF_CAR_NO
        }));
        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('차량 검색 오류:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  // 상태 타입 변환 함수
  const getStatusType = (status) => {
    switch (status) {
      case '판매완료': return 'green';
      case '정산대기': return 'normal';
      case '매입': return 'primary';
      case '재고': return 'primary';
      default: return 'primary';
    }
  };

  // 업데이트 시간 포맷 함수
  const formatLastUpdated = (dateString) => {
    if (!dateString) return '업데이트 정보 없음';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '오늘 업데이트';
    if (diffDays === 2) return '1일 전 업데이트';
    if (diffDays <= 7) return `${diffDays - 1}일 전 업데이트`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}주 전 업데이트`;
    return `${Math.floor(diffDays / 30)}개월 전 업데이트`;
  };

  // 검색어 하이라이팅 함수
  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  };

  // 키보드 네비게이션 핸들러
  const handleKeyDown = (e) => {
    if (!isSearchOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev === -1 ? 0 : (prev < searchResults.length - 1 ? prev + 1 : 0)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev === -1 ? searchResults.length - 1 : (prev > 0 ? prev - 1 : searchResults.length - 1)
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex !== -1) {
          setSelectedCarIndex(focusedIndex);
          handleCarSelect(searchResults[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
        break;
    }
  };

  // 차량 선택 핸들러
  const handleCarSelect = (car) => {
    console.log('선택된 차량:', car);
    setSelectedCarIndex(searchResults.findIndex(result => result.id === car.id));
    // 실제 구현에서는 차량 상세 페이지로 이동하거나 다른 작업 수행
  };

  // 빠른 작업 핸들러
  const handleQuickAction = (actionType) => {
    if (selectedCarIndex === -1) {
      alert('차량을 먼저 선택해주세요.');
      return;
    }
    
    const selectedCar = searchResults[selectedCarIndex];
    
    if (!selectedCar) {
      alert('선택된 차량 정보를 찾을 수 없습니다.');
      return;
    }

    // 선택된 차량의 CAR_REG_ID를 사용하여 각 작업 페이지로 이동
    const carRegId = selectedCar.carRegId || selectedCar.id;
    
    if (!carRegId) {
      alert('차량 등록 ID를 찾을 수 없습니다.');
      return;
    }

    let targetUrl = '';
    
    switch (actionType) {
      case 'product-cost':
        targetUrl = `/car-goods/register?carRegId=${carRegId}`;
        break;
      case 'sale':
        targetUrl = `/car-sell/register?carRegId=${carRegId}`;
        break;
      case 'cash-receipt':
        targetUrl = `/cash-receipts/register?carRegId=${carRegId}`;
        break;
      case 'tax-invoice':
        targetUrl = `/electronic-tax-invoice/register?carRegId=${carRegId}`;
        break;
      case 'settlement':
        targetUrl = `/car-sell/edit?carRegId=${carRegId}`;
        break;
      default:
        console.error('알 수 없는 작업 타입:', actionType);
        return;
    }

    // 드롭다운 닫기
    setIsSearchOpen(false);
    
    // 페이지 이동 (Next.js 라우터 사용으로 검색어 유지)
    router.push(targetUrl);
  };

  // 검색 입력 핸들러 (디바운싱 적용)
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // 이전 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (value.length > 0) {
      setIsSearchOpen(true);
      setFocusedIndex(-1); // 검색 시 포커스 초기화
      
      // 300ms 후에 API 호출 (디바운싱)
      debounceTimerRef.current = setTimeout(() => {
        searchCars(value);
      }, 300);
    } else {
      setIsSearchOpen(false);
      setSearchResults([]);
    }
  };

  // 검색 필드 클릭 핸들러
  const handleSearchClick = () => {
    if (searchQuery.length > 0) {
      setIsSearchOpen(true);
      // 기존 검색어로 다시 검색
      searchCars(searchQuery);
    }
  };

  // 외부 클릭으로 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.closest('.header-search').contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  // 쿠키에서 CSRF 토큰 가져오기
  const getCsrfToken = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "csrf") {
        return value;
      }
    }
    return null;
  };

  const handleLogout = async () => {
    try {
      const csrfToken = getCsrfToken();

      if (!csrfToken) {
        console.warn("CSRF 토큰을 찾을 수 없습니다.");
        // CSRF 토큰이 없어도 로그아웃 진행
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
      });

      if (!response.ok) {
        console.error("로그아웃 요청 실패:", response.status);
      }
    } catch (e) {
      console.error("로그아웃 에러:", e);
    }

    // 성공/실패 여부와 관계없이 로그인 페이지로 이동
    window.location.href = "/login";
  };

  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__title">자동차매매상사관리프로그램</h1>

        {/* 긴급 공지 */}
        <div className="header__msg">
          긴급 공지 내용 안내입니다. 긴급 공지 내용 안내입니다. 긴급 공지 내용 안내입니다.
        </div>

        <nav className="header__nav">
          {/* MEMO: <a>에 .on 추가 시 selected 상태 */}
          <a className="header__nav-menu user" href="#">
            <span>로그인상사명</span>
          </a>
          <Link className="header__nav-menu setting" href="/settings">
            <span>환경설정</span>
          </Link>
          <a className="header__nav-menu remote" href="#">
            <span>원격지원</span>
          </a>
          {/* JSP로 이동하는 하드링크 대신, 기존 로그아웃 로직 유지 */}
          <a
            className="header__nav-menu logout"
            href="/login"
            onClick={e => {
              e.preventDefault();
              handleLogout();
            }}
          >
            <span>로그아웃</span>
          </a>
          {/* <a className="header__nav-menu login on" href="#"><span>로그인</span></a> */}
        </nav>
      </div>

      <div className="header__main-wrap">
        <div className="header__main">
          <h2 className="header__logo">
            <Image src="/images/logo_155100.png" alt="똑순이 2.0" width={155} height={100} />
          </h2>

          {/* 검색바 */}
          <div className={`header-search ${isSearchOpen ? 'header-search--open' : ''} ${searchQuery ? 'header-search--typing' : ''}`}>
            <div className="header-search__inner">
              <span className="header-search__icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="header-search__field"
                placeholder="차량 번호로 검색하세요."
                value={searchQuery}
                onChange={handleSearchInput}
                onClick={handleSearchClick}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
              <button 
                type="button" 
                className="header-search__clear ico ico--input-delete"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                  searchInputRef.current?.focus();
                }}
                style={{ display: searchQuery ? 'block' : 'none' }}
              >
                삭제
              </button>
              <button 
                type="button" 
                className="header-search__toggle"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Image
                  className="select__arrow"
                  src="/images/ico-dropdown.svg"
                  alt=""
                  width={10}
                  height={10}
                />
              </button>
            </div>

            {/* 드롭다운 (자동완성/검색결과) */}
            <div className="header-search__dropdown">
              {/* 검색 결과 정보 헤더 */}
              <div className="header-search__result-info">
                <span className="result-count">
                  {isLoading ? '검색 중...' : `${searchResults.length}개 차량 검색됨`}
                </span>
              </div>
              
              <ul className="header-search__list" role="listbox">
                {searchResults.length === 0 && !isLoading && searchQuery && (
                  <li className="header-search__no-results">
                    <div className="no-results-message">
                      <span>'{searchQuery}'에 대한 검색 결과가 없습니다.</span>
                    </div>
                  </li>
                )}
                {searchResults.map((result, index) => (
                  <li 
                    key={result.id}
                    className={`header-search__option ${
                      selectedCarIndex !== -1 && index === selectedCarIndex ? 'header-search__option--selected' : ''
                    } ${
                      index === focusedIndex ? 'header-search__option--focused' : ''
                    }`}
                    role="option" 
                    aria-selected={index === selectedCarIndex}
                    data-car-number={result.carNumber}
                    data-model={result.model}
                    data-dealer={result.dealer}
                    onClick={() => handleCarSelect(result)}
                  >
                    <div className="search-result-item">
                      <div className="car-info">
                        <div className="car-numbers">
                          <span 
                            className="car-number current"
                            dangerouslySetInnerHTML={{
                              __html: highlightSearchTerm(result.carNumber, searchQuery)
                            }}
                          />
                          {result.purBefCarNo && (
                            <span 
                              className="car-number previous"
                              dangerouslySetInnerHTML={{
                                __html: `(이전번호: ${highlightSearchTerm(result.purBefCarNo, searchQuery)})`
                              }}
                            />
                          )}
                        </div>
                        <span className="car-model">{result.model}</span>
                        <span className="dealer-name">{result.dealer}</span>
                      </div>
                      <div className="car-status">
                        <span className={`badge badge--${result.statusType}`}>{result.status}</span>
                        <span className="last-updated">{result.lastUpdated}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* 빠른 작업 버튼 - 선택된 차량에 따라 활성화 */}
              <div className="header-search__actions">
                <div className="actions-header">
                  <span className="selected-car">
                    {selectedCarIndex !== -1 
                      ? `${searchResults[selectedCarIndex]?.carNumber} ${searchResults[selectedCarIndex]?.model}`
                      : '차량을 선택해주세요'
                    }
                  </span>
                  <span className="actions-label">빠른 작업</span>
                </div>
                <div className="actions-buttons">
                  <button 
                    className={`btn btn--quick-action btn--light ${selectedCarIndex === -1 ? 'disabled' : ''}`}
                    type="button" 
                    title={selectedCarIndex === -1 ? '차량을 먼저 선택해주세요' : '상품화비 등록'}
                    data-action="product-cost"
                    onClick={() => handleQuickAction('product-cost')}
                    disabled={selectedCarIndex === -1}
                  >
                    <span className="ico ico--pay" />
                    <span className="action-text">상품화비</span>
                  </button>
                  <button 
                    className={`btn btn--quick-action btn--light ${selectedCarIndex === -1 ? 'disabled' : ''}`}
                    type="button" 
                    title={selectedCarIndex === -1 ? '차량을 먼저 선택해주세요' : '판매 처리'}
                    data-action="sale"
                    onClick={() => handleQuickAction('sale')}
                    disabled={selectedCarIndex === -1}
                  >
                    <span className="ico ico--shopping" />
                    <span className="action-text">판매처리</span>
                  </button>
                  <button 
                    className={`btn btn--quick-action btn--light ${selectedCarIndex === -1 ? 'disabled' : ''}`}
                    type="button" 
                    title={selectedCarIndex === -1 ? '차량을 먼저 선택해주세요' : '현금 영수증'}
                    data-action="cash-receipt"
                    onClick={() => handleQuickAction('cash-receipt')}
                    disabled={selectedCarIndex === -1}
                  >
                    <span className="ico ico--receipt" />
                    <span className="action-text">현금영수증</span>
                  </button>
                  <button 
                    className={`btn btn--quick-action btn--light ${selectedCarIndex === -1 ? 'disabled' : ''}`}
                    type="button" 
                    title={selectedCarIndex === -1 ? '차량을 먼저 선택해주세요' : '세금 계산서'}
                    data-action="tax-invoice"
                    onClick={() => handleQuickAction('tax-invoice')}
                    disabled={selectedCarIndex === -1}
                  >
                    <span className="ico ico--invoice" />
                    <span className="action-text">세금계산서</span>
                  </button>
                  <button 
                    className={`btn btn--quick-action btn--light ${selectedCarIndex === -1 ? 'disabled' : ''}`}
                    type="button" 
                    title={selectedCarIndex === -1 ? '차량을 먼저 선택해주세요' : '정산 처리'}
                    data-action="settlement"
                    onClick={() => handleQuickAction('settlement')}
                    disabled={selectedCarIndex === -1}
                  >
                    <span className="ico ico--wallet" />
                    <span className="action-text">정산처리</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <nav className="main__memu">
            <a href="#" className="main__memu-link on">
              공지사항
            </a>
            <a href="#" className="main__memu-link on">
              1:1 문의
            </a>
            <a href="#" className="main__memu-link">
              홈택스
            </a>
            <a href="#" className="main__memu-link">
              원부조회
            </a>
          </nav>
        </div>

        {/* GNB */}
        <nav className="header__gnb">
          {/* 제시(매입)차량: 기존엔 /purchases/list였으나 마크업에선 m1.jsp */}
          <Link href="/purchases/list" className="header__gnb-menu">
            제시(매입)차량
          </Link>

          {/* 상품화비용관리 드롭다운 */}
          <div className="select">
            <button className="select__toggle" type="button">
              <span className="header__gnb-menu">상품화비용관리</span>
              <Image
                className="select__arrow"
                src="/images/ico-dropdown.svg"
                alt=""
                width={10}
                height={10}
              />
            </button>
            <ul className="select__menu">
              <li className="select__option select__option--selected">
                <Link href="/car-goods/list" className="select__option-link">
                  차량별 리스트
                </Link>
              </li>
              <li className="select__option">
                <Link href="/car-goods/cost" className="select__option-link">
                  상품화비용 리스트
                </Link>
              </li>
            </ul>
          </div>

          {/* 재고금융관리 드롭다운 */}
          <div className="select">
            <button className="select__toggle" type="button">
              <span className="header__gnb-menu">재고금융관리</span>
              <Image
                className="select__arrow"
                src="/images/ico-dropdown.svg"
                alt=""
                width={10}
                height={10}
              />
            </button>
            <ul className="select__menu">
              <li className="select__option select__option--selected">
                <Link href="/inventory-finance/inventory-list" className="select__option-link">
                  재고금융 리스트
                </Link>
              </li>
              <li className="select__option">
                <Link href="/inventory-finance/interest-list" className="select__option-link">
                  이자납입 리스트
                </Link>
              </li>
            </ul>
          </div>

          <Link href="/car-sell/list" className="header__gnb-menu">
            매도(판매)/정산
          </Link>
          {/* 현금영수증 드롭다운 */}
          <div className="select">
            <button className="select__toggle" type="button">
              <span className="header__gnb-menu">현금영수증</span>
              <Image
                className="select__arrow"
                src="/images/ico-dropdown.svg"
                alt=""
                width={10}
                height={10}
              />
            </button>
            <ul className="select__menu">
              <li className="select__option select__option--selected">
                <Link href="/cash-receipts/register" className="select__option-link">
                  현금영수증 발행
                </Link>
              </li>
              <li className="select__option">
                <Link href="/cash-receipts/list" className="select__option-link">
                  발행 리스트
                </Link>
              </li>
              <li className="select__option">
                <Link href="/cash-receipts/newIssue" className="select__option-link">
                  건별 발행행
                </Link>
              </li>
            </ul>
          </div>
          {/* 전자세금계산서 드롭다운 */}
          <div className="select">
            <button className="select__toggle" type="button">
              <span className="header__gnb-menu">전자세금계산서</span>
              <Image
                className="select__arrow"
                src="/images/ico-dropdown.svg"
                alt=""
                width={10}
                height={10}
              />
            </button>
            <ul className="select__menu">
              <li className="select__option select__option--selected">
                <Link href="/electronic-tax-invoice/register" className="select__option-link">
                  전자세금계산서 발행
                </Link>
              </li>
              <li className="select__option">
                <Link href="/electronic-tax-invoice/list" className="select__option-link">
                  발행 리스트
                </Link>
              </li>
              <li className="select__option">
                <Link href="/electronic-tax-invoice/newIssue" className="select__option-link">
                  건별 발행행
                </Link>
              </li>
            </ul>
          </div>
          <Link href="/car-concil/list" className="header__gnb-menu">
            타상사알선판매
          </Link>
          <a href="/bank-account/list" className="header__gnb-menu">
            통장입출금내역
          </a>

          {/* 종합업무현황 드롭다운 */}
          <div className="select">
            <button className="select__toggle" type="button">
              <span className="header__gnb-menu">종합업무현황</span>
              <Image
                className="select__arrow"
                src="/images/ico-dropdown.svg"
                alt=""
                width={10}
                height={10}
              />
            </button>
            <ul className="select__menu">
              <li className="select__option select__option--selected">
                <a href="m9.jsp">원천징수</a>
              </li>
              <li className="select__option">
                <a href="#">정산내역</a>
              </li>
              <li className="select__option">
                <a href="#">매출자료</a>
              </li>
              <li className="select__option">
                <a href="#">매입자료</a>
              </li>
              <li className="select__option">
                <a href="#">보고서5</a>
              </li>
              <li className="select__option">
                <a href="#">보고서6</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
