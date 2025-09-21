'use client'

export default function ElectronicTaxInvoicePage() {
    return (
      <main className="container container--page">
        <div className="container__head">
          <h2 className="container__title">전자세금계산서 관리</h2>
  
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
                    <input type="text" className="input__field" placeholder="" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
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
                      <li className="select__option select__option--selected" data-value="">선택</li>
                      <li className="select__option" data-value="">선택1</li>
                      <li className="select__option" data-value="">선택2</li>
                      <li className="select__option" data-value="">선택3</li>
                      <li className="select__option" data-value="">선택4</li>
                    </ul>
                  </div>
                </td>
                <th>검색기간</th>
                <td>
                  <div className="input-group">
                    <div className="select w140">
                      <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                      <button className="select__toggle" type="button">
                        <span className="select__text">작성일</span>
                        <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                      </button>
  
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="">작성일</li>
                        <li className="select__option" data-value="">발행일</li>
                        <li className="select__option" data-value="">매도(판매)일</li>
                        <li className="select__option" data-value="">제시(매입)일</li>
                      </ul>
                    </div>
  
                    <div className="input w140">
                      <input type="text" className="jsStartDate input__field input__field--date" placeholder="시작일" autoComplete="off" />
                    </div>
                    <span className="input-group__dash">-</span>
                    <div className="input w140">
                      <input type="text" className="jsEndDate input__field input__field--date" placeholder="종료일" autoComplete="off" />
                    </div>
  
                    {/* disabled 속성 제거 시, 활성화 상태 적용 */}
                    <button type="button" className="btn btn--type03"><span className="ico ico--search"></span>차량검색</button>
                    <button type="button" className="jsSearchboxBtn btn btn--type02"><span className="ico ico--search_detail"></span>상세조건검색</button>
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
                <button className="btn btn--white" type="button"><span className="ico ico--reset"></span>선택 초기화</button>
  
                {/* 딜러명 */}
                <div className="select select--dark w160">
                  <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                  <button className="select__toggle" type="button">
                    <span className="select__text">거래일</span>
                    <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                  </button>
  
                  <ul className="select__menu">
                    <li className="select__option select__option--selected" data-value="">작성일</li>
                    <li className="select__option" data-value="">발행일</li>
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
                    <li className="select__option select__option--selected" data-value="desc">내림차순</li>
                    <li className="select__option" data-value="asc">오름차순</li>
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
                    <li className="select__option select__option--selected" data-value="10">10건씩</li>
                    <li className="select__option" data-value="20">20건씩</li>
                    <li className="select__option" data-value="30">30건씩</li>
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
                            <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
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
                            <li className="select__option select__option--selected" data-value="">선택</li>
                            <li className="select__option" data-value="">선택1</li>
                            <li className="select__option" data-value="">선택2</li>
                            <li className="select__option" data-value="">선택3</li>
                            <li className="select__option" data-value="">선택4</li>
                          </ul>
                        </div>
                      </td>
                      <th>검색기간</th>
                      <td>
                        <div className="input-group">
                          <div className="select w140">
                            <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                            <button className="select__toggle" type="button">
                              <span className="select__text">작성일</span>
                              <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                            </button>
  
                            <ul className="select__menu">
                              <li className="select__option select__option--selected" data-value="">작성일</li>
                              <li className="select__option" data-value="">발행일</li>
                              <li className="select__option" data-value="">매도(판매)일</li>
                              <li className="select__option" data-value="">제시(매입)일</li>
                            </ul>
                          </div>
  
                          <div className="input w140">
                            <input type="text" className="jsStartDate input__field input__field--date" placeholder="시작일" autoComplete="off" />
                          </div>
                          <span className="input-group__dash">-</span>
                          <div className="input w140">
                            <input type="text" className="jsEndDate input__field input__field--date" placeholder="종료일" autoComplete="off" />
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
                            <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                          </div>
                        </div>
                      </td>
  
                      <th>거래처유형</th>
                      <td>
                        <div className="form-option-wrap">
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" name="group-type1" defaultChecked />
                              <span className="form-option__title">전체</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" name="group-type1" />
                              <span className="form-option__title">사업자(사업자번호)</span>
                            </label>
                          </div>
  
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" name="group-type1" />
                              <span className="form-option__title">개인(주민등록번호)</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" name="group-type1" />
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
                            <button className="select__toggle" type="button">
                              <span className="select__text">거래처/고객명</span>
                              <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                            </button>
                            <ul className="select__menu">
                              <li className="select__option select__option--selected" data-value="승용">거래처/고객명</li>
                              <li className="select__option" data-value="daum.net">사업자/주민등록번호</li>
                            </ul>
                          </div>
  
                          <div className="input">
                            <input type="text" className="input__field" placeholder="" />
                            <div className="input__utils">
                              <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
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
                              <input type="checkbox" defaultChecked />
                              <span className="form-option__title">발행대기</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="checkbox" />
                              <span className="form-option__title">발행완료</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="checkbox" />
                              <span className="form-option__title">발행취소</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="checkbox" />
                              <span className="form-option__title">전송중</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="checkbox" />
                              <span className="form-option__title">전송성공</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="checkbox" />
                              <span className="form-option__title">전송실패</span>
                            </label>
                          </div>
                        </div>
                      </td>
                      <th>작성유형</th>
                      <td>
                        <div className="form-option-wrap">
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="checkbox" defaultChecked />
                              <span className="form-option__title">똑순이</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="checkbox" />
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
                          <input type="text" className="input__field" placeholder="문서번호/국세청승인번호" />
                          <div className="input__utils">
                            <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                          </div>
                        </div>
                      </td>
                      <th>비고</th>
                      <td>
                        <div className="input">
                          <input type="text" className="input__field" placeholder="" />
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
                  <button className="jsSearchboxBtn btn btn--light" type="button">취소</button>
                  <button className="btn btn--primary" type="button"><span className="ico ico--search"></span>검색</button>
                </div>
              </form>
            </div>
          </div>
        </div>
  
        <div className="table-wrap">
          <h2 className="table-wrap__title">발행 리스트<span>Total 100건</span></h2>
          <div className="table-wrap__head table-wrap__title">
            <button
              type="button"
              className="btn btn--red btn--padding--r30"
              onClick={() => (window.location.href = '#')}
            >
              <span className="ico ico--add"></span>건별 발행 등록
            </button>
            <div className="input-group">
              {/* 딜러명 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="dealer" defaultValue="발행일" />
                <button className="select__toggle" type="button">
                  <span className="select__text">발행일</span>
                  <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                </button>
  
                <ul className="select__menu">
                  <li className="select__option select__option--selected" data-value="발행일">발행일</li>
                  <li className="select__option" data-value="담당딜러">담당딜러</li>
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
                  <li className="select__option select__option--selected" data-value="desc">내림차순</li>
                  <li className="select__option" data-value="asc">오름차순</li>
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
                  <li className="select__option select__option--selected" data-value="10">10건씩</li>
                  <li className="select__option" data-value="30">30건씩</li>
                  <li className="select__option" data-value="50">50건씩</li>
                </ul>
              </div>
  
              <button className="btn btn--white btn--padding--r30" type="button"><span className="ico ico--download"></span>다운로드</button>
            </div>
          </div>
  
          <table className="table">
            <colgroup>
              <col style={{ width: "auto" }} />
              {/* --> */}
              <col style={{ width: "80px" }} />
              <col style={{ width: "120px" }} />
              <col style={{ width: "120px" }} />
              <col style={{ width: "auto" }} />
              {/*거래처명*/}
  
              <col style={{ width: "200px" }} />
              <col style={{ width: "150px" }} />
              <col style={{ width: "auto" }} />
              {/*품목명*/}
  
              <col style={{ width: "130px" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "100px" }} />
  
              <col style={{ width: "100px" }} />
              <col style={{ width: "100px" }} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  차량정보
                  <div className="tooltip">
                    <button className="jsTooltipBtn tooltip__btn btn btn--ico"><span className="ico ico--help">보기</span></button>
                    <div className="tooltip__box">
                      <p>차량번호 / 담당딜러 / 차량명 / 매입일 / 매입금액</p>
                    </div>
                  </div>
                </th>
                <th>문서</th>
                <th>작성일자</th>
                <th>발행일자</th>
                <th>거래처</th>
                <th>등록번호</th>
                <th>판매딜러</th>
                <th>품목명</th>
                <th>공급가액</th>
                <th>세액</th>
                <th>합계금액</th>
                <th>상태</th>
                <th>바로가기</th>
                <th>보기</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>123가1234 / 홍길동 / 쏘나타 / 2025-07-01 / 100,000,000</td>
                <td>일반</td>
                <td>2025-09-11</td>
                <td>2025-09-11</td>
                <td>차산사람</td>
                <td>111-11-11111</td>
                <td>홍길동</td>
                <td>그랜저 123가4567 차량매도 외</td>
                <td>100,000,000</td>
                <td>100,000,000</td>
                <td>100,000,000</td>
                <td>전송성공</td>
  
                <td>
                  <div className="input-group input-group--sm input-group--center">
                    <div className="select select--utils">
                      <button type="button" className="select__toggle">더보기</button>
  
                      <ul className="select__menu">
                        <li className="select__option">
                          <a href="#">계산서인쇄</a>
                        </li>
                        <li className="select__option">
                          <a href="#">알림톡전송</a>
                        </li>
                        <li className="select__option">
                          <a href="#">메일전송</a>
                        </li>
                        <li className="select__option">
                          <a href="#">Fax전송</a>
                        </li>
                        <li className="select__option">
                          <a
                            href="#"
                            onClick={() => {
                              if (typeof window !== 'undefined' && typeof (window.openModal) === 'function') {
                                window.openModal('1');
                              }
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
                    onClick={() => (window.location.href = 'm1_v.jsp')}
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
  
          <div className="pagination">
            <a href="#" className="pagination__btn pagination__btn--prev">이전</a>
            {/* MEMO: <a> 태그에 .on 추가 시, selected 상태 적용 */}
            <a href="#" className="pagination__btn on">1</a>
            <a href="#" className="pagination__btn">2</a>
            <a href="#" className="pagination__btn">3</a>
            <a href="#" className="pagination__btn">...</a>
            <a href="#" className="pagination__btn">9</a>
            <a href="#" className="pagination__btn">10</a>
            <a href="#" className="pagination__btn pagination__btn--next">다음</a>
          </div>
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
              <tr>
                <td>사업자번호 발급분</td>
                <td>17</td>
                <td>17</td>
                <td>1,200,000</td>
                <td>1,100,000</td>
                <td>100,000</td>
              </tr>
              <tr>
                <td>주민번호 발급분</td>
                <td>17</td>
                <td>17</td>
                <td>1,200,000</td>
                <td>1,100,000</td>
                <td>100,000</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>합계</th>
                <th>17</th>
                <th>17</th>
                <th>1,200,000</th>
                <th>100,000</th>
                <th>1,100,000</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
    );
  }
  