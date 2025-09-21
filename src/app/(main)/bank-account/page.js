'use client';

export default function BankCashLedgerPage() {
  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">통장시재 관리</h2>

        <div className="guidebox">
          <p className="guidebox__title">팝빌 연동, 주기별 / 선택적 가져오기</p>
          <p className="guidebox__title">거래항목 상사환경설정</p>
        </div>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">검색</h2>
        <table className="table table--lg">
          <colgroup>
            <col style={{ width: '10%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: 'auto' }} />
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
                    <input className="select__input" type="hidden" name="dealer" defaultValue="거래일" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">거래일</span>
                      <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                    </button>

                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="거래일">
                        거래일
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
                  <span className="select__text">거래일</span>
                  <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                </button>

                <ul className="select__menu">
                  <li className="select__option select__option--selected" data-value="">
                    거래일
                  </li>
                  <li className="select__option" data-value="">
                    거래구분
                  </li>
                  <li className="select__option" data-value="">
                    거래항목
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
                  <col style={{ width: '8%' }} />
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: 'auto' }} />
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
                        <input className="select__input" type="hidden" name="dealer" defaultValue="선택1" />
                        <button className="select__toggle" type="button">
                          <span className="select__text">선택</span>
                          <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                        </button>

                        <ul className="select__menu">
                          <li className="select__option select__option--selected" data-value="선택1">
                            선택1
                          </li>
                          <li className="select__option" data-value="선택2">
                            선택2
                          </li>
                          <li className="select__option" data-value="선택3">
                            선택3
                          </li>
                          <li className="select__option" data-value="선택4">
                            선택4
                          </li>
                        </ul>
                      </div>
                    </td>
                    <th>검색기간</th>
                    <td>
                      <div className="input-group">
                        <div className="select w140">
                          <input className="select__input" type="hidden" name="dealer" defaultValue="거래일" />
                          <button className="select__toggle" type="button">
                            <span className="select__text">거래일</span>
                            <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                          </button>

                          <ul className="select__menu">
                            <li className="select__option select__option--selected" data-value="">
                              거래일
                            </li>
                            <li className="select__option" data-value="">
                              거래구분
                            </li>
                            <li className="select__option" data-value="">
                              거래항목
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
                    <th>차량명</th>
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
                    <th>거래구분</th>
                    <td>
                      <div className="form-option-wrap">
                        <div className="form-option">
                          <label className="form-option__label">
                            <input type="radio" name="radiogroup01" defaultChecked />
                            <span className="form-option__title">전체</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input type="radio" name="radiogroup01" />
                            <span className="form-option__title">입금</span>
                          </label>
                        </div>
                        <div className="form-option">
                          <label className="form-option__label">
                            <input type="radio" name="radiogroup01" />
                            <span className="form-option__title">출금</span>
                          </label>
                        </div>
                      </div>
                    </td>
                    <th>거래항목</th>
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
                            차량대금
                          </li>
                          <li className="select__option" data-value="">
                            상사매도비
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>계좌번호</th>
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
                            110-11-123545
                          </li>
                          <li className="select__option" data-value="">
                            110-11-024680
                          </li>
                        </ul>
                      </div>
                    </td>
                    <th>통장적요</th>
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

                    <th>상세메모</th>
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
              if (typeof window !== 'undefined') window.location.href = '#';
            }}
          >
            <span className="ico ico--add"></span>통장내역 불러오기
          </button>
          <div className="input-group">
            {/* 딜러명 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="거래일" />
              <button className="select__toggle" type="button">
                <span className="select__text">거래일</span>
                <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
              </button>

              <ul className="select__menu">
                <li className="select__option select__option--selected" data-value="거래일">
                  거래일
                </li>
                <li className="select__option" data-value="">
                  계좌번호
                </li>
                <li className="select__option" data-value="">
                  거래항목
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

        <table className="table">
          <colgroup>
            <col style={{ width: '250px' }} /> {/*거래일시*/}
            <col style={{ width: '100px' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: 'auto' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: 'auto' }} /> {/*품목명*/}
            <col style={{ width: '100px' }} />
          </colgroup>
          <thead>
            <tr>
              <th>거래일시</th>
              <th>거래구분</th>
              <th>계좌번호</th>
              <th>차량정보</th>
              <th>거래항목</th>
              <th>입금액</th>
              <th>출금액</th>
              <th>잔액</th>
              <th>통장적요</th>
              <th>상세메모</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-09-11 20:45:45</td>
              <td>입금</td>
              <td>110-11-123545</td>
              <td>홍길동 / 123가4567 / 그랜저</td>
              <td>차량판매</td>
              <td>5,000,000</td>
              <td></td>
              <td>12,550,000</td>
              <td>통장적요내용</td>
              <td>특이사항</td>
              <td>
                <button
                  type="button"
                  className="btn btn--light btn--sm"
                  onClick={() => {
                    if (typeof window !== 'undefined') window.location.href = 'm8_w.jsp';
                  }}
                >
                  상세등록
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="pagination">
          <a
            href="#"
            className="pagination__btn pagination__btn--prev"
            onClick={(e) => e.preventDefault()}
          >
            이전
          </a>
          {/* MEMO: <a> 태그에 .on 추가 시, selected 상태 적용 */}
          <a href="#" className="pagination__btn on" onClick={(e) => e.preventDefault()}>
            1
          </a>
          <a href="#" className="pagination__btn" onClick={(e) => e.preventDefault()}>
            2
          </a>
          <a href="#" className="pagination__btn" onClick={(e) => e.preventDefault()}>
            3
          </a>
          <a href="#" className="pagination__btn" onClick={(e) => e.preventDefault()}>
            ...
          </a>
          <a href="#" className="pagination__btn" onClick={(e) => e.preventDefault()}>
            9
          </a>
          <a href="#" className="pagination__btn" onClick={(e) => e.preventDefault()}>
            10
          </a>
          <a
            href="#"
            className="pagination__btn pagination__btn--next"
            onClick={(e) => e.preventDefault()}
          >
            다음
          </a>
        </div>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">입출금 합계</h2>
        <table className="table">
          <thead>
            <tr>
              <th colSpan={2} className="col-half">
                입금
              </th>
              <th colSpan={2} className="col-half">
                출금
              </th>
            </tr>
            <tr>
              <th className="col-half">건수</th>
              <th className="col-half">금액</th>
              <th className="col-half">건수</th>
              <th className="col-half">금액</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-red">100</td>
              <td className="text-red">1,000,000</td>
              <td className="text-blue">10,000</td>
              <td className="text-blue">1,100,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
