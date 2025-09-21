"use client";

export default function SalesRegisterPage() {
    return (
      <main className="container container--page">
        <div className="container__head">
          <h2 className="container__title">판매차량 등록</h2>
  
          <div className="guidebox">
            <p className="guidebox__title">차 정보를 가지고 인입 시 차량 선택 모달 창 불필요.(차량 검색은 필요. 변경가능)</p>
            <p className="guidebox__title">알선(내 차를 다른 딜러가 파는 경우, 같은 소속 상사 딜러도 마찬가지 임) 처리</p>
            <p className="guidebox__title">판매 처리 등록 후 모달창 띄움. 정상처리됨. 매출처리등록 진행하시겠습니까? </p>
          </div>
        </div>
  
        <div className="table-wrap">
          <div className="table-wrap__head">
            <h2 className="table-wrap__title">기준차량</h2>
            <button className="btn btn--dark btn--padding--r20" type="button" id="openBtn">
              <span className="ico ico--add"></span>차량검색
            </button>
          </div>
          <table className="table">
            <colgroup>
              <col style={{ width: "100px" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "auto" }} />
            </colgroup>
            <tbody>
              <tr>
                <th>제시구분</th>
                <td>상사매입</td>
                <th>차량번호</th>
                <td>123가1234 (123허1234)</td>
                <th>매입딜러</th>
                <td>홍길동</td>
                <th>차량명</th>
                <td>그랜저(승용)</td>
                <th>매입일</th>
                <td>2025-08-01</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div className="table-wrap">
          {/* <h2 className="table-wrap__title">필수 입력 정보</h2> */}
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
                <th>
                  판매딜러 <span className="text-red">*</span>
                </th>
                <td>
                  <div className="select">
                    <button className="select__toggle" type="button">
                      <span className="select__text">선택</span>
                      <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                    </button>
  
                    <ul className="select__menu" id="select_dealer">
                      <li className="select__option select__option--selected" data-value="value1">
                        선택
                      </li>
                      <li className="select__option" data-value="value2">
                        선택2
                      </li>
                      <li className="select__option" data-value="value3">
                        선택3
                      </li>
                      <li className="select__option" data-value="value4">
                        선택4
                      </li>
                      <li className="select__option" data-value="value5">
                        선택5
                      </li>
                      <li className="select__option" data-value="value6">
                        선택6
                      </li>
                      <li className="select__option" data-value="value7">
                        선택7
                      </li>
                      <li className="select__option" data-value="value8">
                        선택8
                      </li>
                      <li className="select__option" data-value="value9">
                        선택9
                      </li>
                      <li className="select__option" data-value="value10">
                        선택10
                      </li>
                      <li className="select__option" data-value="value11">
                        선택11
                      </li>
                    </ul>
                    <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                  </div>
                </td>
  
                <th>
                  판매금액 <span className="text-red">*</span>
                </th>
                <td>
                  <div className="input-group input-group--sm">
                    <div className="input w160">
                      <input type="text" className="input__field" placeholder="판매금액" defaultValue="0" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                          삭제
                        </button>
                      </div>
                    </div>
                    <span className="input-help">1,000,000 / 100,000</span>
                  </div>
                </td>
                <th>
                  판매일 <span className="text-red">*</span>
                </th>
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
                <th>
                  상사매도비 <span className="text-red">*</span>
                  <div className="tooltip">
                    <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                      <span className="ico ico--help">보기</span>
                    </button>
                    <div className="tooltip__box">
                      <p>상사매도비는 판매 처리시 상사 매출로 자동 등록됩니다.</p>
                    </div>
                  </div>
                </th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="금액" defaultValue="0" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <th>
                  성능보험료 <span className="text-red">*</span>
                  <div className="tooltip">
                    <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                      <span className="ico ico--help">보기</span>
                    </button>
                    <div className="tooltip__box">
                      <p>성능보험료는 판매 처리시 상사 매출로 자동 등록됩니다.</p>
                    </div>
                  </div>
                </th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="금액" defaultValue="0" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <th>
                  차량번호(출고) <span className="text-red">*</span>
                </th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="" defaultValue="123가1234" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
  
              <tr>
                <th>판매유형</th>
                <td>
                  <div className="select">
                    <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">일반</span>
                      <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                    </button>
  
                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="value1">
                        일반
                      </li>
                      <li className="select__option" data-value="value2">
                        수출
                      </li>
                      <li className="select__option" data-value="value2">
                        폐차
                      </li>
                      <li className="select__option" data-value="value2">
                        경매
                      </li>
                    </ul>
                  </div>
                </td>
                <th>특이사항</th>
                <td colSpan="3">
                  <div className="input">
                    <textarea className="input__field" placeholder="내용 입력"></textarea>
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
  
              <tr>
                <th>관련 서류 첨부</th>
                <td colSpan="5">
                  <div className="input-group">
                    <div className="input w440">
                      <input
                        type="text"
                        className="input__field input__field--file"
                        placeholder="파일을 선택하세요"
                        defaultValue="홍길동_추가 서류_1.pdf"
                        disabled
                      />
                      <div className="input__utils">
                        <button type="button" className="input__remove ico ico--trash">
                          삭제
                        </button>
                      </div>
                    </div>
                    {/* <button className="btn btn--dark" type="button">파일 선택</button> */}
                  </div>
                  <div className="input-group">
                    <div className="input w440">
                      <input
                        type="text"
                        className="input__field input__field--file"
                        placeholder="파일을 선택하세요"
                        defaultValue="홍길동_추가 서류_2.pdf"
                        disabled
                      />
                      <div className="input__utils">
                        <button type="button" className="input__remove ico ico--trash">
                          삭제
                        </button>
                      </div>
                    </div>
                    {/* <button className="btn btn--dark" type="button">파일 선택</button> */}
                  </div>
  
                  <div className="input-group">
                    <button type="submit" className="btn btn--sm btn--light ">
                      <span className="ico ico--add-black"></span>추가
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        {/* 알선 경우만 s */}
        <div className="table-wrap" id="alson_div" style={{ display: "none" }}>
          <h2 className="table-wrap__title">알선</h2>
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
                <th>
                  알선딜러 <span className="text-red">*</span>
                </th>
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
                <th>
                  차주입금액 <span className="text-red">*</span>
                  <div className="tooltip">
                    <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                      <span className="ico ico--help">보기</span>
                    </button>
                    <div className="tooltip__box">
                      <p>매입상사 차주딜러에게 입금되어야 할 금액(즉, 판매가-차주입금액은 알선딜러 수익이 됨)</p>
                    </div>
                  </div>
                </th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="금액" defaultValue="0" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <th>
                  알선수수료
                  <div className="tooltip">
                    <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                      <span className="ico ico--help">보기</span>
                    </button>
                    <div className="tooltip__box">
                      <p>
                        알선 판매에 따른 수수료로 매입고객이 지불. 차주상사에는 매출로 등록, 알선딜러에는 공제(예수부가세,원천세)후 지급됩니다.
                      </p>
                    </div>
                  </div>
                </th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="금액" defaultValue="0" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th>주민등록번호</th>
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
                <th>연락처</th>
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
                <th>소속상사명</th>
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
              <tr>
                <th>입금계좌</th>
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
                <th></th>
                <td></td>
                <th></th>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 알선 경우만 e */}
  
        {/* 매수자 고객 정보 s */}
        <div className="table-wrap">
          <div className="table-wrap__head">
            <h2 className="table-wrap__title">매수고객</h2>
            <button className="btn btn--dark btn--padding--r20" type="button" id="btnClone">
              <span className="ico ico--add"></span>고객 추가(공동명의)
            </button>
          </div>
          <table className="table table--xl" id="myTable">
            <colgroup>
              <col style={{ width: "300px" }} />
              <col style={{ width: "220px" }} />
              <col style={{ width: "200px" }} />
              <col style={{ width: "200px" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "200px" }} />
              <col style={{ width: "64px" }} />
            </colgroup>
            <thead>
              <tr>
                <th>고객명</th>
                <th>주민(법인)등록번호</th>
                <th>사업자등록번호</th>
                <th>연락처</th>
                <th>주소</th>
                <th>특이사항</th>
                <th>지분율</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              <tr className="template">
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        고객명
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        주민(법인)등록번호
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        사업자등록번호
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        연락처
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        주소
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        특이사항
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input-group">
                    <div className="select w200">
                      <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                      <button className="select__toggle" type="button">
                        <span className="select__text">선택</span>
                        <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                      </button>
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="value1">
                          선택
                        </li>
                        <li className="select__option" data-value="value2">
                          1
                        </li>
                        <li className="select__option" data-value="value3">
                          2
                        </li>
                        <li className="select__option" data-value="value4">
                          99
                        </li>
                        <li className="select__option" data-value="value4">
                          100
                        </li>
                      </ul>
                    </div>
                    <span className="input-help">%</span>
                  </div>
                </td>
                <td>
                  <button type="button" className="btn btn--ico">
                    <span className="ico ico--trash"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 매수자 고객 정보 e */}
  
        <div className="container__btns">
          <button className="btn btn--light" type="button" onClick={() => { window.location.href = "m1.jsp"; }}>
            취소
          </button>
          <button className="btn btn--primary" type="button" disabled>
            확인
          </button>
          <button className="btn btn--primary" type="button">
            확인
          </button>
        </div>
  
        {/* 매입정보 s */}
        <div className="table-wrap">
          <h2 className="table-wrap__title">매입</h2>
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
                <th>
                  제시구분<span className="text-red">*</span>
                </th>
                <td>
                  <div className="form-option-wrap">
                    <div className="form-option">
                      <label className="form-option__label">
                        <input type="radio" name="radiogroup01" defaultChecked />
                        <span className="form-option__title">상사매입</span>
                      </label>
                    </div>
                    <div className="form-option">
                      <label className="form-option__label">
                        <input type="radio" name="radiogroup01" />
                        <span className="form-option__title">고객위탁</span>
                      </label>
                    </div>
                  </div>
                </td>
                <th>매입딜러</th>
                <td>
                  <div className="select">
                    <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">선택</span>
                      <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                    </button>
  
                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="value1">
                        선택
                      </li>
                      <li className="select__option" data-value="value2">
                        선택2
                      </li>
                      <li className="select__option" data-value="value3">
                        선택3
                      </li>
                      <li className="select__option" data-value="value4">
                        선택4
                      </li>
                      <li className="select__option" data-value="value5">
                        선택5
                      </li>
                      <li className="select__option" data-value="value6">
                        선택6
                      </li>
                      <li className="select__option" data-value="value7">
                        선택7
                      </li>
                      <li className="select__option" data-value="value8">
                        선택8
                      </li>
                      <li className="select__option" data-value="value9">
                        선택9
                      </li>
                      <li className="select__option" data-value="value10">
                        선택10
                      </li>
                      <li className="select__option" data-value="value11">
                        선택11
                      </li>
                    </ul>
                  </div>
                </td>
  
                <th>매입금액</th>
                <td>
                  <div className="input-group input-group--sm">
                    <div className="input w160">
                      <input type="text" className="input__field" placeholder="매입금액 " defaultValue="0" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                          삭제
                        </button>
                      </div>
                    </div>
                    <span className="input-help">1,000,000 / 100,000</span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>매입일</th>
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
                    <span className="input-help">조합전산 제시일</span>
                  </div>
                </td>
                <th>상사매입비</th>
                <td>
                  <div className="input-group input-group--sm">
                    <div className="input w200">
                      <input type="text" className="input__field" placeholder="상사매입비" defaultValue="0" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                          삭제
                        </button>
                      </div>
                    </div>
  
                    <div className="input w200">
                      <input
                        type="text"
                        className="jsStartDate input__field input__field--date"
                        placeholder="상사매입비 입금일"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </td>
                <th>
                  (예상)취득세
                  <div className="tooltip">
                    <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                      <span className="ico ico--help">보기</span>
                    </button>
                    <div className="tooltip__box">
                      <p>2,860만원 이상의 차량에 대해서는 1.05%의 취득세가 발생합니다.-지방세특례제한법 제68조</p>
                    </div>
                  </div>
                </th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="(예상)취득세" defaultValue="0" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
  
              <tr>
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
                        <li className="select__option select__option--selected" data-value="승용">
                          승용
                        </li>
                        <li className="select__option" data-value="daum.net">
                          승합
                        </li>
                        <li className="select__option" data-value="naver.com">
                          경차
                        </li>
                        <li className="select__option" data-value="naver.com">
                          화물
                        </li>
                        <li className="select__option" data-value="nate.com">
                          특수
                        </li>
                      </ul>
                    </div>
  
                    <div className="input w300">
                      <input type="text" className="input__field" placeholder="차량명" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <th>차량번호(신)</th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="차량번호(매입후)" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <th>차량번호(구)</th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="차량번호(매입전)" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
  
              <tr>
                <th>매도자/전소유자명</th>
                <td>
                  <div className="input-group">
                    <div className="input w400">
                      <input type="text" className="input__field" placeholder="고객명 " />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                          삭제
                        </button>
                      </div>
                    </div>
                    {/* <button className="btn btn--dark" type="button" disabled>검색</button> */}
                    <button className="btn btn--dark" type="button">
                      검색
                    </button>
                  </div>
                </td>
                <th>고객구분</th>
                <td>
                  <div className="select">
                    <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">개인</span>
                      <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                    </button>
  
                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="value1">
                        개인
                      </li>
                      <li className="select__option" data-value="value2">
                        법인
                      </li>
                    </ul>
                  </div>
                </td>
                <th>매입증빙</th>
                <td>
                  <div className="select">
                    <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">의제매입</span>
                      <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                    </button>
  
                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="value1">
                        의제매입
                      </li>
                      <li className="select__option" data-value="value2">
                        세금계산서
                      </li>
                      <li className="select__option" data-value="value2">
                        계산서
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
  
              <tr>
                <th>계약서번호</th>
                <td>
                  <div className="input w200">
                    <input type="text" className="input__field" placeholder="관인계약서번호" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <th>이전일</th>
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
                    <span className="input-help">조합전산 이전일</span>
                  </div>
                </td>
                <th>조합제시메모</th>
                <td className="text-left">조합전산 제시메모 내용입니다.</td>
              </tr>
  
              <tr>
                <th>주민(법인)등록번호</th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="'-' 없이 입력" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <th>연락처</th>
                <td>
                  <div className="input w200">
                    <input type="text" className="input__field" placeholder="'-' 없이 입력" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
                <th>e메일주소</th>
                <td>
                  <div className="input-group input-group--sm">
                    <div className="input w160">
                      <input type="text" className="input__field" placeholder="e메일" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                          삭제
                        </button>
                      </div>
                    </div>
                    <span className="input-group__dash">@</span>
                    <div className="select w140">
                      <input className="select__input" type="hidden" name="dealer" defaultValue="naver.com" />
                      <button className="select__toggle" type="button">
                        <span className="select__text">naver.com</span>
                        <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                      </button>
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="naver.com">
                          naver.com
                        </li>
                        <li className="select__option" data-value="daum.net">
                          daum.net
                        </li>
                        <li className="select__option" data-value="naver.com">
                          gmail.com
                        </li>
                        <li className="select__option" data-value="nate.com">
                          nate.com
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
  
              <tr>
                <th>주소</th>
                <td colSpan="3">
                  <div className="input-group">
                    <div className="input w400">
                      <input type="text" className="input__field" placeholder="검색 버튼을 눌러주세요" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                          삭제
                        </button>
                      </div>
                    </div>
                    <button className="btn btn--dark" type="button">
                      주소 검색
                    </button>
                    <div className="input w400">
                      <input type="text" className="input__field" placeholder="상세 주소" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <th></th>
                <td></td>
              </tr>
  
              <tr>
                <th>사업자등록번호</th>
                <td>
                  <div className="input">
                    <input type="text" className="input__field" placeholder="'-' 없이 입력" />
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
  
                <th>매입(세금)계산서</th>
                <td>
                  <div className="select">
                    <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">선택</span>
                      <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                    </button>
  
                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="value1">
                        선택
                      </li>
                      <li className="select__option" data-value="value2">
                        해당없음
                      </li>
                      <li className="select__option" data-value="value3">
                        수취
                      </li>
                      <li className="select__option" data-value="value3">
                        미수취
                      </li>
                    </ul>
                  </div>
                </td>
                <th>계산서발행일</th>
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
                    <span className="input-help">계산서 발행일 및 계약서 계약일</span>
                  </div>
                </td>
              </tr>
  
              <tr>
                <th>사실확인서</th>
                <td>
                  <div className="select">
                    <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                    <button className="select__toggle" type="button">
                      <span className="select__text">선택</span>
                      <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                    </button>
  
                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="value1">
                        선택
                      </li>
                      <li className="select__option" data-value="value2">
                        해당없음
                      </li>
                      <li className="select__option" data-value="value3">
                        수취
                      </li>
                      <li className="select__option" data-value="value3">
                        미수취
                      </li>
                    </ul>
                  </div>
                </td>
                <th>특이사항</th>
                <td colSpan="3">
                  <div className="input">
                    <textarea className="input__field" placeholder=""></textarea>
                    <div className="input__utils">
                      <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                        삭제
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
  
              {/* 
              <tr>
                <th>사업자등록증</th>
                <td colSpan="3">
                  <div className="input-group">
                    <div className="input w440">
                      <input type="text" className="input__field input__field--file" placeholder="파일을 선택하세요" disabled />
                      <div className="input__utils">
                        <button type="button" className="input__remove ico ico--trash">삭제</button>
                      </div>
                    </div>
                    <button className="btn btn--dark" type="button">파일 선택</button>
                  </div>
                </td>
              </tr>
              */}
              <tr>
                <th>관련 서류 첨부</th>
                <td colSpan="5">
                  <div className="input-group">
                    <div className="input w440">
                      <input
                        type="text"
                        className="input__field input__field--file"
                        placeholder="파일을 선택하세요"
                        defaultValue="홍길동_추가 서류_1.pdf"
                        disabled
                      />
                      <div className="input__utils">
                        <button type="button" className="input__remove ico ico--trash">
                          삭제
                        </button>
                      </div>
                    </div>
                    {/* <button className="btn btn--dark" type="button">파일 선택</button> */}
                  </div>
                  <div className="input-group">
                    <div className="input w440">
                      <input
                        type="text"
                        className="input__field input__field--file"
                        placeholder="파일을 선택하세요"
                        defaultValue="홍길동_추가 서류_2.pdf"
                        disabled
                      />
                      <div className="input__utils">
                        <button type="button" className="input__remove ico ico--trash">
                          삭제
                        </button>
                      </div>
                    </div>
                    {/* <button className="btn btn--dark" type="button">파일 선택</button> */}
                  </div>
  
                  <div className="input-group">
                    <button type="submit" className="btn btn--sm btn--light ">
                      <span className="ico ico--add-black"></span>추가
                    </button>
                  </div>
                </td>
              </tr>
  
              <tr>
                <th>주차위치</th>
                <td colSpan="3">
                  <div className="input-group input-group--sm">
                    <div className="select w200">
                      <input className="select__input" type="hidden" name="dealer" defaultValue="선택" />
                      <button className="select__toggle" type="button">
                        <span className="select__text">선택</span>
                        <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                      </button>
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="선택">
                          선택
                        </li>
                        <li className="select__option" data-value="daum.net">
                          주차위치코드1
                        </li>
                        <li className="select__option" data-value="daum.net">
                          주차위치코드2
                        </li>
                      </ul>
                    </div>
  
                    <div className="input w800">
                      <input type="text" className="input__field" placeholder="상세위치" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <th>Key묶음번호</th>
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
        </div>
        {/* 매입정보 e */}
  
        <div className="container__btns">
          <button className="btn btn--primary" type="button">
            매입정보 수정
          </button>
        </div>
      </main>
    );
  }
  