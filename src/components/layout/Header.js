"use client";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
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
          <div className="header-search">
            <div className="header-search__inner">
              <span className="header-search__icon" />
              <input
                type="text"
                className="header-search__field"
                placeholder="차량 번호로 검색하세요."
              />
              <button type="button" className="header-search__clear ico ico--input-delete">
                삭제
              </button>
              <button type="button" className="header-search__toggle on">
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
              <ul className="header-search__list">
                <li className="header-search__option header-search__option--selected">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="searchgroup" defaultChecked />
                      <span className="form-option__title">246가5678 | 그랜저 | 홍길동 딜러</span>
                    </label>
                  </div>
                </li>
                <li className="header-search__option">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="searchgroup" />
                      <span className="form-option__title">123가5678 | 그랜저 | 홍길동 딜러</span>
                    </label>
                  </div>
                </li>
                <li className="header-search__option">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="searchgroup" />
                      <span className="form-option__title">235나5678 | G80 | 박길동 딜러</span>
                    </label>
                  </div>
                </li>
                <li className="header-search__option">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="searchgroup" />
                      <span className="form-option__title">434라5678 | 쏘나타 | 백두산 딜러</span>
                    </label>
                  </div>
                </li>
              </ul>

              {/* 하단 액션 버튼 */}
              <div className="header-search__actions">
                <button className="btn btn--info" type="button">
                  <span className="ico ico--pay" />
                  상품화비 등록
                </button>
                <button className="btn btn--info" type="button">
                  <span className="ico ico--shopping" />
                  판매 처리
                </button>
                <button className="btn btn--info" type="button">
                  <span className="ico ico--receipt" />
                  현금 영수증
                </button>
                <button className="btn btn--info" type="button">
                  <span className="ico ico--invoice" />
                  세금 계산서
                </button>
                <button className="btn btn--info" type="button">
                  <span className="ico ico--wallet" />
                  정산 처리
                </button>
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
          <Link href="/cash-receipts/list" className="header__gnb-menu">
            현금영수증
          </Link>
          <Link href="/electronic-tax-invoice/list" className="header__gnb-menu">
            전자세금계산서
          </Link>
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
