"use client";
import Image from "next/image";

export default function Header() {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__title">자동차매매상사관리프로그램</h1>
        <nav className="header__nav">
          <a className="header__nav-menu user" href="#">
            <span>로그인상사명</span>
          </a>
          <a className="header__nav-menu setting" href="/settings">
            <span>환경설정</span>
          </a>
          <a className="header__nav-menu remote" href="#">
            <span>원격지원</span>
          </a>
          <a
            type="button"
            className="header__nav-menu logout"
            onClick={handleLogout}
          >
            <span>로그아웃</span>
          </a>
        </nav>
      </div>

      <div className="header__main-wrap">
        <div className="header__main">
          <h2 className=" header__logo">
            <Image src="/images/logo_155100.png" alt="똑순이 2.0" width={155} height={100} />
          </h2>

          <div className="header-search">
            <div className="header-search__inner">
              <span className="header-search__icon"></span>
              <input
                type="text"
                className="header-search__field"
                placeholder="차량 번호로 검색하세요."
              />
              <button
                type="button"
                className="header-search__clear ico ico--input-delete"
              >
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

            <div className="header-search__dropdown">
              <ul className="header-search__list">
                <li className="header-search__option header-search__option--selected">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="searchgroup" defaultChecked />
                      <span className="form-option__title">
                        246가5678 | 그랜저 | 홍길동 딜러
                      </span>
                    </label>
                  </div>
                </li>
                <li className="header-search__option">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="searchgroup" />
                      <span className="form-option__title">
                        123가5678 | 그랜저 | 홍길동 딜러
                      </span>
                    </label>
                  </div>
                </li>
                <li className="header-search__option">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="searchgroup" />
                      <span className="form-option__title">
                        235나5678 | G80 | 박길동 딜러
                      </span>
                    </label>
                  </div>
                </li>
                <li className="header-search__option">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="searchgroup" />
                      <span className="form-option__title">
                        434라5678 | 쏘나타 | 백두산 딜러
                      </span>
                    </label>
                  </div>
                </li>
              </ul>

              <div className="header-search__actions">
                <button className="btn btn--info" type="button">
                  <span className="ico ico--pay"></span>상품화비 등록
                </button>
                <button className="btn btn--info" type="button">
                  <span className="ico ico--shopping"></span>판매 처리
                </button>
                <button className="btn btn--info" type="button">
                  <span className="ico ico--receipt"></span>현금 영수증
                </button>
                <button className="btn btn--info" type="button">
                  <span className="ico ico--invoice"></span>세금 계산서
                </button>
                <button className="btn btn--info" type="button">
                  <span className="ico ico--wallet"></span>정산 처리
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

        <nav className="header__gnb">
          <a href="/purchases/list" className="header__gnb-menu">
            제시(매입)차량
          </a>
          <a href="m2.jsp" className="header__gnb-menu">
            상품화비용
          </a>
          <a href="m3.jsp" className="header__gnb-menu">
            재고금융
          </a>
          <a href="m4.jsp" className="header__gnb-menu">
            매도(판매)/정산
          </a>
          <a href="m5.jsp" className="header__gnb-menu">
            현금영수증발행
          </a>
          <a href="m6.jsp" className="header__gnb-menu">
            세금계산서발행
          </a>
          <a href="m7.jsp" className="header__gnb-menu">
            타상사알선판매
          </a>
          <a href="m8.jsp" className="header__gnb-menu">
            통장시재관리
          </a>
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
                <a href="m9.jsp">보고서1</a>
              </li>
              <li className="select__option">
                <a href="#">보고서2</a>
              </li>
              <li className="select__option">
                <a href="#">보고서3</a>
              </li>
              <li className="select__option">
                <a href="#">보고서4</a>
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


