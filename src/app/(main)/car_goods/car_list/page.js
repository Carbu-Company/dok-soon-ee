"use client";

export default function ProductCostList() {
    return (
      <main className="container container--page">
        <div className="container__head">
          <h2 className="container__title">상품화비용 리스트(차량별)</h2>
  
          <div className="guidebox">
            <p className="guidebox__title">차량 : 상품화항목 = 1 : N</p>
            <p className="guidebox__desc">※ 상품화비용을 차량별, 상품화 비용건별 확인이 가능합니다.</p>
            <p className="guidebox__desc">
              ※ 상품화 비용은 일반적으로 상사 매입 자료로 비용 처리하여 세무상 반영할 수 있습니다. 다만, 적격 증빙 여부 등 구체적인 사항은 세무사 사무실에 확인하시기 바랍니다.
            </p>
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
                    <input className="select__input" type="hidden" name="dealer" defaultValue="선택1" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">선택</span>
                      <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                    </button>
  
                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="선택1">선택1</li>
                      <li className="select__option" data-value="선택2">선택2</li>
                      <li className="select__option" data-value="선택3">선택3</li>
                      <li className="select__option" data-value="선택4">선택4</li>
                    </ul>
                  </div>
                </td>
                <th>검색기간</th>
                <td>
                  <div className="input-group">
                    <div className="select w140">
                      <input className="select__input" type="hidden" name="dealer" defaultValue="제시(매입)일" />
                      <button className="select__toggle" type="button">
                        <span className="select__text">제시(매입)일</span>
                        <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                      </button>
  
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="제시(매입)일">제시(매입)일</li>
                        <li className="select__option" data-value="상품화등록일">상품화등록일</li>
                        <li className="select__option" data-value="상품화등록일">매도(판매)일</li>
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
                    <span className="select__text">제시(매입)일</span>
                    <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                  </button>
  
                  <ul className="select__menu">
                    <li className="select__option select__option--selected" data-value="">제시(매입)일</li>
                    <li className="select__option" data-value="">차량번호</li>
                    <li className="select__option" data-value="">상품화등록일</li>
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
                          <input className="select__input" type="hidden" name="dealer" defaultValue="선택1" />
                          <button className="select__toggle" type="button">
                            <span className="select__text">선택</span>
                            <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                          </button>
  
                          <ul className="select__menu">
                            <li className="select__option select__option--selected" data-value="선택1">선택1</li>
                            <li className="select__option" data-value="선택2">선택2</li>
                            <li className="select__option" data-value="선택3">선택3</li>
                            <li className="select__option" data-value="선택4">선택4</li>
                          </ul>
                        </div>
                      </td>
                      <th>검색기간</th>
                      <td>
                        <div className="input-group">
                          <div className="select w140">
                            <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                            <button className="select__toggle" type="button">
                              <span className="select__text">제시(매입)일</span>
                              <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                            </button>
  
                            <ul className="select__menu">
                              <li className="select__option select__option--selected" data-value="">제시(매입)일</li>
                              <li className="select__option" data-value="">상품화등록일</li>
                              <li className="select__option" data-value="">매도(판매)일</li>
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
  
                      <th>비용항목</th>
                      <td>
                        <div className="select">
                          <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                          <button className="select__toggle" type="button">
                            <span className="select__text">선택</span>
                            <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                          </button>
  
                          <ul className="select__menu">
                            <li className="select__option select__option--selected" data-value="선택">선택</li>
                            <li className="select__option" data-value="">성능점검비</li>
                          </ul>
                        </div>
                      </td>
  
                      <th>과세구분</th>
                      <td>
                        <div className="form-option-wrap">
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" defaultChecked name="group-type2" />
                              <span className="form-option__title">전체</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" name="group-type2" />
                              <span className="form-option__title">과세</span>
                            </label>
                          </div>
  
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" name="group-type2" />
                              <span className="form-option__title">면세</span>
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>지출구분</th>
                      <td>
                        <div className="form-option-wrap">
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" defaultChecked name="group-type" />
                              <span className="form-option__title">전체</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" name="group-type" />
                              <span className="form-option__title">상사지출</span>
                            </label>
                          </div>
  
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" name="group-type" />
                              <span className="form-option__title">딜러지출</span>
                            </label>
                          </div>
                        </div>
                      </td>
  
                      <th>지출증빙</th>
                      <td>
                        <div className="select">
                          <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                          <button className="select__toggle" type="button">
                            <span className="select__text">선택</span>
                            <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                          </button>
  
                          <ul className="select__menu">
                            <li className="select__option select__option--selected" data-value="value1">선택</li>
                            <li className="select__option" data-value="value2">전자세금계산서</li>
                            <li className="select__option" data-value="value2">카드영수증</li>
                            <li className="select__option" data-value="value2">현금영수증</li>
                          </ul>
                        </div>
                      </td>
                      <th>비고/지출처</th>
                      <td>
                        <div className="input">
                          <input type="text" className="input__field" placeholder="" />
                          <div className="input__utils">
                            <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>정산반영여부</th>
                      <td>
                        <div className="form-option-wrap">
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" defaultChecked name="group-type3" />
                              <span className="form-option__title">전체</span>
                            </label>
                          </div>
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" name="group-type3" />
                              <span className="form-option__title">반영</span>
                            </label>
                          </div>
  
                          <div className="form-option">
                            <label className="form-option__label">
                              <input type="radio" name="group-type3" />
                              <span className="form-option__title">제외</span>
                            </label>
                          </div>
                        </div>
                      </td>
                      <th></th>
                      <td></td>
                      <th></th>
                      <td></td>
                    </tr>
  
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
                  <button className="jsSearchboxBtn btn btn--light" type="button">취소</button>
                  <button className="btn btn--primary" type="button"><span className="ico ico--search"></span>검색</button>
                </div>
              </form>
            </div>
          </div>
        </div>
  
        <div className="table-wrap">
          <h2 className="table-wrap__title">리스트<span>Total 100건</span></h2>
          <div className="table-wrap__head table-wrap__title">
            <button type="button" className="btn btn--red btn--padding--r30" onClick={() => (window.location.href = 'm2_w.jsp')}>
              <span className="ico ico--add"></span>상품화비용 등록
            </button>
            <div className="input-group">
              {/* 딜러명 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                <button className="select__toggle" type="button">
                  <span className="select__text">등록일</span>
                  <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                </button>
  
                <ul className="select__menu">
                  <li className="select__option select__option--selected" data-value="">등록일</li>
                  <li className="select__option" data-value="">결제일</li>
                  <li className="select__option" data-value="">지출구분</li>
                  <li className="select__option" data-value="">과세구분</li>
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
  
          {/* 차량별 리스트 s */}
          <table className="table">
            <colgroup>
              <col style={{ width: "150px" }} />
              <col style={{ width: "150px" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "150px" }} />
              <col style={{ width: "150px" }} />
              <col style={{ width: "150px" }} />
              <col style={{ width: "150px" }} />
              <col style={{ width: "150px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "100px" }} />
            </colgroup>
            <thead>
              <tr>
                <th>차량번호</th>
                <th>담당딜러</th>
                <th>차량명</th>
                <th>매입일</th>
                <th>매입금액</th>
                <th>상품화건수</th>
                <th>상품화금액</th>
                <th>공급가</th>
                <th>부가세</th>
                <th>상태</th>
                <th>매도일</th>
                <th>바로가기</th>
                <th>보기</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>123가4567</td>
                <td>홍길동</td>
                <td>그랜저</td>
                <td>2025-09-01</td>
                <td>1,000,000</td>
                <td>10건</td>
                <td>100,000</td>
                <td>90,909</td>
                <td>9,091</td>
                <td>매도</td>
                <td>2025-09-01</td>
                <td>
                  <div className="input-group input-group--sm input-group--center">
                    <div className="select select--utils">
                      <button type="button" className="select__toggle">더보기</button>
  
                      <ul className="select__menu">
                        <li className="select__option">
                          <a href="m2_w.jsp">상품화비용 등록</a>
                        </li>
                        <li className="select__option">
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (typeof window !== "undefined" && typeof window.openModal === "function") {
                                window.openModal("2");
                              }
                            }}
                          >
                            비용 전체 삭제
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
  
                <td>
                  <button type="button" className="btn btn--light btn--sm" onClick={() => (window.location.href = 'm1_v.jsp')}>
                    상세보기
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          {/* 차량별 리스트 e */}
  
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
                <th rowSpan={2}>구분</th>
                <th rowSpan={2}>건수</th>
                <th colSpan={3} className="col-half">상품화비용</th>
              </tr>
              <tr>
                <th className="col-half">합계금액</th>
                <th className="col-half">공급가</th>
                <th className="col-half">부가세</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>과세</td>
                <td>100</td>
                <td>1,100,000</td>
                <td>1,000,000</td>
                <td>100,000</td>
              </tr>
              <tr>
                <td>면세</td>
                <td>100</td>
                <td>1,000,000</td>
                <td>1,000,000</td>
                <td>-</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>합계</th>
                <th>100</th>
                <th>1,100,000</th>
                <th>1,000,000</th>
                <th>100,000</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
    );
  }
  