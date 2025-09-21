"use client";

export default function InventoryFinanceInterestList() {
  const openModal = (id) => {
    if (typeof window !== "undefined" && window.openModal) {
      window.openModal(id);
    } else {
      console.log("openModal stub:", id);
    }
  };

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">재고금융 리스트(이자납입)</h2>

        <div className="guidebox">
          <p className="guidebox__title">재고금융 : 이자납입 = 1 : N</p>
          <p className="guidebox__title">하나의 재고금융 등록시 자동으로 이자테이블 1row 추가(최소 1row~N)</p>
          {/*<p className="guidebox__desc">※ 이자계산, 신규/연장/추가처리</p>*/}
        </div>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">차량 검색</h2>
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
                  <input type="text" className="input__field" placeholder="" />
                  <div className="input__utils">
                    <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                      삭제
                    </button>
                  </div>
                </div>
              </td>
              <th>담당딜러</th>
              <td>
                <div className="select">
                  <input className="select__input" type="hidden" name="dealer" defaultValue="선택" />
                  <button className="select__toggle" type="button">
                    <span className="select__text">선택</span>
                    <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                  </button>

                  <ul className="select__menu">
                    <li className="select__option select__option--selected" data-value="">
                      선택
                    </li>
                    <li className="select__option" data-value="선택">
                      선택1
                    </li>
                    <li className="select__option" data-value="">
                      선택2
                    </li>
                    <li className="select__option" data-value="">
                      선택3
                    </li>
                  </ul>
                </div>
              </td>
              <th>검색기간</th>
              <td>
                <div className="input-group">
                  <div className="select w140">
                    <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">이자납입일</span>
                      <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                    </button>

                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="">
                        이자납입일
                      </li>
                      <li className="select__option" data-value="">
                        대출실행일
                      </li>
                      <li className="select__option" data-value="">
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
                    />
                  </div>
                  <span className="input-group__dash">-</span>
                  <div className="input w140">
                    <input
                      type="text"
                      className="jsEndDate input__field input__field--date"
                      placeholder="종료일"
                      autoComplete="off"
                    />
                  </div>

                  {/* disabled 속성 제거 시, 활성화 상태 적용 */}
                  <button type="button" className="btn btn--type03">
                    <span className="ico ico--search"></span>차량검색
                  </button>
                  <button type="button" className="jsSearchboxBtn btn btn--type02">
                    <span className="ico ico--search_detail"></span>상세조건검색
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
                <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                <button className="select__toggle" type="button">
                  <span className="select__text">이자납입일</span>
                  <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                </button>

                <ul className="select__menu">
                  <li className="select__option select__option--selected" data-value="">
                    이자납입일
                  </li>
                  <li className="select__option" data-value="">
                    대출실행일
                  </li>
                </ul>
              </div>

              {/* 정렬순서 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="dealer" defaultValue="desc" />
                <button className="select__toggle" type="button">
                  <span className="select__text">내림차순</span>
                  <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                </button>

                <ul className="select__menu">
                  <li className="select__option select__option--selected" data-value="desc">
                    내림차순
                  </li>
                  <li className="select__option" data-value="asc">
                    오름차순
                  </li>
                </ul>
              </div>

              {/* 건수 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="dealer" defaultValue="10" />
                <button className="select__toggle" type="button">
                  <span className="select__text">10건씩</span>
                  <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                </button>

                <ul className="select__menu">
                  <li className="select__option select__option--selected" data-value="10">
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
                    <th>차량번호(신)</th>
                    <td>
                      <div className="input">
                        <input type="text" className="input__field" placeholder="" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                    <th>담당딜러</th>
                    <td>
                      <div className="select">
                        <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                        <button className="select__toggle" type="button">
                          <span className="select__text">선택</span>
                          <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                        </button>

                        <ul className="select__menu">
                          <li className="select__option select__option--selected" data-value="">
                            선택
                          </li>
                          <li className="select__option" data-value="">
                            선택1
                          </li>
                          <li className="select__option" data-value="">
                            선택2
                          </li>
                          <li className="select__option" data-value="">
                            선택3
                          </li>
                          <li className="select__option" data-value="">
                            선택4
                          </li>
                        </ul>
                      </div>
                    </td>
                    <th>검색기간</th>
                    <td>
                      <div className="input-group">
                        <div className="select w140">
                          <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                          <button className="select__toggle" type="button">
                            <span className="select__text">이자납입일</span>
                            <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                          </button>

                          <ul className="select__menu">
                            <li className="select__option select__option--selected" data-value="">
                              이자납입일
                            </li>
                            <li className="select__option" data-value="">
                              대출실행일
                            </li>
                            <li className="select__option" data-value="">
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
                          />
                        </div>
                        <span className="input-group__dash">-</span>
                        <div className="input w140">
                          <input
                            type="text"
                            className="jsEndDate input__field input__field--date"
                            placeholder="종료일"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>차량번호(구)</th>
                    <td>
                      <div className="input">
                        <input type="text" className="input__field" placeholder="" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                    <th>캐피탈사</th>
                    <td>
                      <div className="select">
                        <input className="select__input" type="hidden" name="dealer" defaultValue="선택" />
                        <button className="select__toggle" type="button">
                          <span className="select__text">선택</span>
                          <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                        </button>

                        <ul className="select__menu">
                          <li className="select__option select__option--selected" data-value="선택">
                            선택
                          </li>
                          <li className="select__option" data-value="">
                            하나캐피탈
                          </li>
                          <li className="select__option" data-value="">
                            KB캐피탈
                          </li>
                        </ul>
                      </div>
                    </td>
                    <th>특이사항</th>
                    <td>
                      <div className="input">
                        <input type="text" className="input__field" placeholder="" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="searchbox__btns container__btns">
                <button className="jsSearchboxBtn btn btn--light" type="button">
                  취소
                </button>
                <button className="btn btn--primary" type="button">
                  <span className="ico ico--search"></span>검색
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">
          리스트<span>Total 100건</span>
        </h2>
        <div className="table-wrap__head table-wrap__title">
          <button
            type="button"
            className="btn btn--red btn--padding--r30"
            onClick={() => {
              window.location.href = "m3_w.jsp";
            }}
          >
            <span className="ico ico--add"></span>재고금융 등록
          </button>
          <div className="input-group">
            {/* 딜러명 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="" />
              <button className="select__toggle" type="button">
                <span className="select__text">이자납입일</span>
                <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
              </button>

              <ul className="select__menu">
                <li className="select__option select__option--selected" data-value="">
                  이자납입일
                </li>
                <li className="select__option" data-value="">
                  실행일
                </li>
                <li className="select__option" data-value="">
                  제시(매입)일
                </li>
              </ul>
            </div>

            {/* 정렬순서 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="desc" />
              <button className="select__toggle" type="button">
                <span className="select__text">내림차순</span>
                <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
              </button>

              <ul className="select__menu">
                <li className="select__option select__option--selected" data-value="desc">
                  내림차순
                </li>
                <li className="select__option" data-value="asc">
                  오름차순
                </li>
              </ul>
            </div>

            {/* 건수 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="10" />
              <button className="select__toggle" type="button">
                <span className="select__text">10건씩</span>
                <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
              </button>

              <ul className="select__menu">
                <li className="select__option select__option--selected" data-value="10">
                  10건씩
                </li>
                <li className="select__option" data-value="30">
                  30건씩
                </li>
                <li className="select__option" data-value="50">
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
            <tr>
              <td>홍길동 / 123가4567 / 그랜저 / 100,000,000 / 2025-08-01</td>
              <td>메리츠캐피탈</td>
              <td>30,000,000</td>
              <td>2025-08-10</td>
              <td>6개월</td>
              <td>15%</td>
              <td>100,000</td>
              <td>1,000,000</td>
              <td>
                <span className="text-red">100,000</span>
              </td>
              <td>
                <span className="text-red">2025-09-01</span>
              </td>
              <td>500,000</td>
              <td>진행중</td>
              <td>
                <div className="input-group input-group--sm input-group--center">
                  <div className="select select--utils">
                    <button type="button" className="select__toggle">더보기</button>

                    <ul className="select__menu">
                      <li className="select__option">
                        <a href="#">이자납 수정(등록동일)</a>
                      </li>
                      <li className="select__option">
                        <a
                          href="#"
                          onClick={(e) => {
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
                  onClick={() => {
                    window.location.href = "m1_v.jsp";
                  }}
                >
                  상세보기
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        {/* 이자납 리스트 e */}

        <div className="pagination">
          <a href="#" className="pagination__btn pagination__btn--prev">
            이전
          </a>
          {/* MEMO: <a> 태그에 .on 추가 시, selected 상태 적용 */}
          <a href="#" className="pagination__btn on">
            1
          </a>
          <a href="#" className="pagination__btn">
            2
          </a>
          <a href="#" className="pagination__btn">
            3
          </a>
          <a href="#" className="pagination__btn">
            ...
          </a>
          <a href="#" className="pagination__btn">
            9
          </a>
          <a href="#" className="pagination__btn">
            10
          </a>
          <a href="#" className="pagination__btn pagination__btn--next">
            다음
          </a>
        </div>
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
            <tr>
              <td>하나캐피탈</td>
              <td>500,000,000</td>
              <td>250,000,000</td>
              <td>250,000,000</td>
              <td>10일</td>
              <td>50%</td>
              <td>15건</td>
              <td>123가4567</td>
              <td>홍길동</td>
              <td>그랜저</td>
              <td>2025-09-01</td>
            </tr>
            <tr>
              <td>KB캐피탈</td>
              <td>500,000,000</td>
              <td>250,000,000</td>
              <td>250,000,000</td>
              <td>10일</td>
              <td>50%</td>
              <td>15건</td>
              <td>123가4567</td>
              <td>홍길동</td>
              <td>그랜저</td>
              <td>2025-09-01</td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <th>합계</th>
              <th></th>
              <th></th>
              <th></th>
              <th>-</th>
              <th></th>
              <th></th>
              <th>-</th>
              <th>-</th>
              <th>-</th>
              <th>-</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  );
}
