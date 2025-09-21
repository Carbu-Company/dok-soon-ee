"use client";

export default function BrokerageSalesCreatePage() {
    return (
      <main className="container container--page">
        <div className="container__head">
          <h2 className="container__title">알선매출 등록</h2>
  
          <div className="guidebox">
            <p className="guidebox__title">매출등록, 세금계산서 발행 연동, 즉시발행 필요</p>
            <p className="guidebox__title">딜러지급액 자동계산(수정가능)</p>
            <p className="guidebox__title">사무장님 재확인 필요</p>
          </div>
        </div>
  
        <div className="table-wrap">
          <h2 className="table-wrap__title">필수 입력 정보</h2>
          <table className="table table--lg">
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "auto" }} />
            </colgroup>
            <tbody>
              <tr>
                <th>판매딜러</th>
                <td>
                  <div className="select">
                    <input className="select__input" type="hidden" name="dealer" defaultValue="" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">선택</span>
                      <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                    </button>
                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="value1">선택</li>
                      <li className="select__option" data-value="">선택1</li>
                      <li className="select__option" data-value="">선택2</li>
                      <li className="select__option" data-value="">선택3</li>
                    </ul>
                  </div>
                </td>
  
                <th>거래항목</th>
                <td>
                  <div className="select">
                    <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">선택</span>
                      <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                    </button>
  
                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="value1">선택</li>
                      <li className="select__option" data-value="value2">알선수수료</li>
                      <li className="select__option" data-value="value3">알선수익금</li>
                    </ul>
                  </div>
                </td>
  
                <th>알선판매일</th>
                <td>
                  <div className="input-group">
                    <div className="input w200">
                      <input
                        type="text"
                        className="jsStartDate input__field input__field--date"
                        placeholder="날짜"
                        autoComplete="off"
                      />
                    </div>
                    <span className="input-help">조합전산 매도일</span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>금액</th>
                <td>
                  <div className="input-group input-group--sm">
                    <div className="input w160">
                      <input type="text" className="input__field" placeholder="금액" defaultValue="" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                    <span className="input-help">1,000,000 / 100,000</span>
                  </div>
                </td>
                <th>
                  공제비용(상품화)
                  <div className="tooltip">
                    <button className="jsTooltipBtn tooltip__btn btn btn--ico"><span className="ico ico--help">보기</span></button>
                    <div className="tooltip__box">
                      <p>알선판매 시 인정되는 상품화비용은 비용처리가 가능합니다.</p>
                    </div>
                  </div>
                </th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="금액" defaultValue="" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                </td>
                <th>
                  딜러지급액
                  <div className="tooltip">
                    <button className="jsTooltipBtn tooltip__btn btn btn--ico"><span className="ico ico--help">보기</span></button>
                    <div className="tooltip__box">
                      <p>예수부가세, 원천세를 제한 실 지급액</p>
                    </div>
                  </div>
                </th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="금액" defaultValue="" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th>매출증빙</th>
                <td>
                  <div className="form-option-wrap">
                    <div className="form-option">
                      <label className="form-option__label">
                        <input type="radio" name="radiogroup01" defaultChecked />
                        <span className="form-option__title">전자세금계산서</span>
                      </label>
                    </div>
                    <div className="form-option">
                      <label className="form-option__label">
                        <input type="radio" name="radiogroup01" />
                        <span className="form-option__title">현금영수증</span>
                      </label>
                    </div>
                  </div>
                </td>
                <th>차량명</th>
                <td>
                  <div className="input-group input-group--sm">
                    <div className="select w120">
                      <input className="select__input" type="hidden" name="dealer" defaultValue="승용" />
                      <button className="select__toggle" type="button">
                        <span className="select__text">승용</span>
                        <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                      </button>
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="승용">승용</li>
                        <li className="select__option" data-value="daum.net">승합</li>
                        <li className="select__option" data-value="naver.com">경차</li>
                        <li className="select__option" data-value="naver.com">화물</li>
                        <li className="select__option" data-value="nate.com">특수</li>
                      </ul>
                    </div>
  
                    <div className="input w300">
                      <input type="text" className="input__field" placeholder="차량명" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </div>
                </td>
                <th>차량번호</th>
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
                <th>고객명/상사명</th>
                <td>
                  <div className="input-group">
                    <div className="input w400">
                      <input type="text" className="input__field" placeholder="" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                    {/* <button className="btn btn--dark" type="button" disabled>검색</button> */}
                    <button className="btn btn--dark" type="button">검색</button>
                  </div>
                </td>
                <th>연락처</th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="'-' 없이 입력" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                </td>
                <th>특이사항</th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div className="container__btns">
          <button
            className="btn btn--light"
            type="button"
            onClick={() => {
              window.location.href = "m7.jsp";
            }}
          >
            취소
          </button>
          <button className="btn btn--primary" type="button" disabled>확인</button>
          <button className="btn btn--primary" type="button">확인</button>
        </div>
  
        {/*
        <div className="container__btns">
          <button className="btn btn--light" type="button">취소</button>
          <button className="btn btn--primary" type="button" disabled>확인</button>
          <button className="btn btn--primary" type="button">확인</button>
        </div>
        */}
      </main>
    );
  }
  