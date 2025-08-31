'use client'
import Image from 'next/image'
export default function Editor() {
    return (
        <main className="container container--page">
          <div className="container__head">
            <h2 className="container__title">매입차량 수정</h2>
  
            <div className="guidebox">
              <p className="guidebox__title">도움말</p>
              <p className="guidebox__desc">도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다.</p>
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
                  <th>제시구분<span className="text-red">*</span></th>
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
                        <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                      </button>
  
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="value1">선택</li>
                        <li className="select__option" data-value="value2">선택2</li>
                        <li className="select__option" data-value="value3">선택3</li>
                        <li className="select__option" data-value="value4">선택4</li>
                        <li className="select__option" data-value="value5">선택5</li>
                        <li className="select__option" data-value="value6">선택6</li>
                        <li className="select__option" data-value="value7">선택7</li>
                        <li className="select__option" data-value="value8">선택8</li>
                        <li className="select__option" data-value="value9">선택9</li>
                        <li className="select__option" data-value="value10">선택10</li>
                        <li className="select__option" data-value="value11">선택11</li>
                      </ul>
                    </div>
                  </td>
  
                  <th>매입금액</th>
                  <td>
                    <div className="input-group input-group--sm">
                      <div className="input w160">
                        <input type="text" className="input__field" placeholder="매입금액 " defaultValue="0" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
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
                        <input type="text" className="jsStartDate input__field input__field--date" placeholder="매입일" autoComplete="off" />
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
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
  
                      <div className="input w200">
                        <input type="text" className="jsStartDate input__field input__field--date" placeholder="상사매입비 입금일" autoComplete="off" />
                      </div>
                    </div>
                  </td>
                  <th>
                    (예상)취득세
                    <div className="tooltip">
                      <button className="jsTooltipBtn tooltip__btn btn btn--ico"><span className="ico ico--help">보기</span></button>
                      <div className="tooltip__box">
                        <p>2,860만원 이상의 차량에 대해서는 1.05%의 취득세가 발생합니다.-지방세특례제한법 제68조</p>
                      </div>
                    </div>
                  </th>
                  <td>
                    <div className="input">
                      <input type="text" className="input__field" placeholder="(예상)취득세" defaultValue="0" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
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
                          <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
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
                  <th>차량번호(매입후)</th>
                  <td>
                    <div className="input">
                      <input type="text" className="input__field" placeholder="차량번호(매입후)" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                  <th>차량번호(매입전)</th>
                  <td>
                    <div className="input">
                      <input type="text" className="input__field" placeholder="차량번호(매입전)" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
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
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                      {/* <button className="btn btn--dark" type="button" disabled>검색</button> */}
                      <button className="btn btn--dark" type="button">검색</button>
                    </div>
                  </td>
                  <th>고객구분</th>
                  <td>
                    <div className="select">
                      <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                      <button className="select__toggle" type="button">
                        <span className="select__text">개인</span>
                        <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                      </button>
  
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="value1">개인</li>
                        <li className="select__option" data-value="value2">법인</li>
                      </ul>
                    </div>
                  </td>
                  <th>증빙종류</th>
                  <td>
                    <div className="select">
                      <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                      <button className="select__toggle" type="button">
                        <span className="select__text">의제매입</span>
                        <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                      </button>
  
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="value1">의제매입</li>
                        <li className="select__option" data-value="value2">세금계산서</li>
                        <li className="select__option" data-value="value2">계산서</li>
                      </ul>
                    </div>
                  </td>
                </tr>
  
                {/*
                <tr>
                  <th>상사매입비</th>
                  <td colSpan={5}>
                    <div className="input-group">
                      <div className="input w240">
                        <input type="text" className="input__field" placeholder="상사매입비 " />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                      <button className="btn btn--dark" type="button" disabled>확인</button>
                      <button className="btn btn--dark" type="button">확인</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    (예상)취득세
                    <div className="tooltip">
                      <button className="jsTooltipBtn tooltip__btn btn btn--ico"><span className="ico ico--help">보기</span></button>
                      <div className="tooltip__box">
                        <p>문자를 전송할 발신번호의 명의자를 의미합니다. <br /> 선택한 소유자 유형에 따라 구비서류가 상이합니다.</p>
                      </div>
                    </div>
                  </th>
                  <td>
                    <div className="input">
                      <input type="text" className="input__field" placeholder="(예상)취득세 " />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                  <th>추가</th>
                  <td>
                    <div className="select">
                      <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                      <button className="select__toggle" type="button">
                        <span className="select__text">선택</span>
                        <img className="select__arrow" src="../assets/images/ico-dropdown.svg" alt="" />
                      </button>
  
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="value1">선택</li>
                        <li className="select__option" data-value="value2">선택2</li>
                        <li className="select__option" data-value="value3">선택3</li>
                        <li className="select__option" data-value="value4">선택4</li>
                        <li className="select__option" data-value="value5">선택5</li>
                        <li className="select__option" data-value="value6">선택6</li>
                        <li className="select__option" data-value="value7">선택7</li>
                        <li className="select__option" data-value="value8">선택8</li>
                        <li className="select__option" data-value="value9">선택9</li>
                        <li className="select__option" data-value="value10">선택10</li>
                        <li className="select__option" data-value="value11">선택11</li>
                      </ul>
                    </div>
                  </td>
                  <th>매입비</th>
                  <td>
                    <div className="input-group input-group--sm">
                      <div className="input w200">
                        <input type="text" className="input__field" placeholder="매입비 " />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                      <span className="input-group__dash">/</span>
                      <div className="input w200">
                        <input type="text" className="input__field" placeholder="매입비 " />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>선택</th>
                  <td colSpan={3}>
                    <div className="form-option-wrap">
                      <div className="form-option">
                        <label className="form-option__label">
                          <input type="checkbox" />
                          <span className="form-option__title">옵션명</span>
                        </label>
                      </div>
                      <div className="form-option">
                        <label className="form-option__label">
                          <input type="checkbox" />
                          <span className="form-option__title">옵션명</span>
                        </label>
                      </div>
                      <div className="form-option">
                        <label className="form-option__label">
                          <input type="checkbox" />
                          <span className="form-option__title">옵션명</span>
                        </label>
                      </div>
                      <div className="form-option">
                        <label className="form-option__label">
                          <input type="checkbox" />
                          <span className="form-option__title">옵션명</span>
                        </label>
                      </div>
                    </div>
                  </td>
                  <th>유형</th>
                  <td>
                    <div className="form-option-wrap">
                      <div className="form-option">
                        <label className="form-option__label">
                          <input type="radio" name="radiogroup02" />
                          <span className="form-option__title">상사</span>
                        </label>
                      </div>
                      <div className="form-option">
                        <label className="form-option__label">
                          <input type="radio" name="radiogroup02" />
                          <span className="form-option__title">딜러</span>
                        </label>
                      </div>
                    </div>
                  </td>
                </tr>
                */}
              </tbody>
            </table>
          </div>
  
          <div className="container__btns">
            <button className="btn btn--light" type="button" onClick={() => (location.href = 'm1.jsp')}>취소</button>
            <button className="btn btn--primary" type="button" disabled>확인</button>
            <button className="btn btn--primary" type="button">확인</button>
          </div>
  
          <div className="table-wrap">
            <h2 className="table-wrap__title">선택 입력 정보</h2>
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
                  <th>계약서번호</th>
                  <td>
                    <div className="input w200">
                      <input type="text" className="input__field" placeholder="관인계약서번호" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                  <th>이전일</th>
                  <td>
                    <div className="input-group">
                      <div className="input w200">
                        <input type="text" className="jsStartDate input__field input__field--date" placeholder="이전일" autoComplete="off" />
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
                      <input type="text" className="input__field" placeholder="주민(법인)등록번호" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                  <th>연락처</th>
                  <td>
                    <div className="input w200">
                      <input type="text" className="input__field" placeholder="- 없이 입력" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                  <th>e메일주소</th>
                  <td>
                    <div className="input-group input-group--sm">
                      <div className="input w160">
                        <input type="text" className="input__field" placeholder="e메일 주소" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                      <span className="input-group__dash">@</span>
                      <div className="select w140">
                        <input className="select__input" type="hidden" name="dealer" defaultValue="naver.com" />
                        <button className="select__toggle" type="button">
                          <span className="select__text">naver.com</span>
                          <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                        </button>
                        <ul className="select__menu">
                          <li className="select__option select__option--selected" data-value="naver.com">naver.com</li>
                          <li className="select__option" data-value="daum.net">daum.net</li>
                          <li className="select__option" data-value="naver.com">gmail.com</li>
                          <li className="select__option" data-value="nate.com">nate.com</li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
  
                <tr>
                  <th>주소</th>
                  <td colSpan={3}>
                    <div className="input-group">
                      <div className="input w400">
                        <input type="text" className="input__field" placeholder="검색 버튼을 눌러주세요" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                      <button className="btn btn--dark" type="button">주소 검색</button>
                      <div className="input w400">
                        <input type="text" className="input__field" placeholder="상세 주소" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
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
                      <input type="text" className="input__field" placeholder="-없이 입력" />
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
  
                  <th>매입(세금)계산서</th>
                  <td>
                    <div className="select">
                      <input className="select__input" type="hidden" name="dealer" defaultValue="value1" />
                      <button className="select__toggle" type="button">
                        <span className="select__text">선택</span>
                        <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                      </button>
  
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="value1">선택</li>
                        <li className="select__option" data-value="value2">해당없음</li>
                        <li className="select__option" data-value="value3">수취</li>
                        <li className="select__option" data-value="value3">미수취</li>
                      </ul>
                    </div>
                  </td>
                  <th>계산서발행일</th>
                  <td>
                    <div className="input-group">
                      <div className="input w200">
                        <input type="text" className="jsStartDate input__field input__field--date" placeholder="발행일" autoComplete="off" />
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
                        <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                      </button>
  
                      <ul className="select__menu">
                        <li className="select__option select__option--selected" data-value="value1">선택</li>
                        <li className="select__option" data-value="value2">해당없음</li>
                        <li className="select__option" data-value="value3">수취</li>
                        <li className="select__option" data-value="value3">미수취</li>
                      </ul>
                    </div>
                  </td>
                  <th>특이사항</th>
                  <td colSpan={3}>
                    <div className="input">
                      <textarea className="input__field" placeholder="내용 입력"></textarea>
                      <div className="input__utils">
                        <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                      </div>
                    </div>
                  </td>
                </tr>
  
                {/*
                <tr>
                  <th>사업자등록증</th>
                  <td colSpan={3}>
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
                  <td colSpan={5}>
                    <div className="input-group">
                      <div className="input w440">
                        <input type="text" className="input__field input__field--file" placeholder="파일을 선택하세요" defaultValue="홍길동_추가 서류_1.pdf" disabled />
                        <div className="input__utils">
                          <button type="button" className="input__remove ico ico--trash">삭제</button>
                        </div>
                      </div>
                      {/* <button className="btn btn--dark" type="button">파일 선택</button> */}
                    </div>
                    <div className="input-group">
                      <div className="input w440">
                        <input type="text" className="input__field input__field--file" placeholder="파일을 선택하세요" defaultValue="홍길동_추가 서류_2.pdf" disabled />
                        <div className="input__utils">
                          <button type="button" className="input__remove ico ico--trash">삭제</button>
                        </div>
                      </div>
                      {/* <button className="btn btn--dark" type="button">파일 선택</button> */}
                    </div>
  
                    <div className="input-group">
                      <button type="submit" className="btn btn--sm btn--light "><span className="ico ico--add-black"></span>추가</button>
                    </div>
                  </td>
                </tr>
  
                <tr>
                  <th>주차위치</th>
                  <td colSpan={3}>
                    <div className="input-group input-group--sm">
                      <div className="select w200">
                        <input className="select__input" type="hidden" name="dealer" defaultValue="선택" />
                        <button className="select__toggle" type="button">
                          <span className="select__text">선택</span>
                          <Image className="select__arrow" src="/images/ico-dropdown.svg" alt="" width={10} height={10} />
                        </button>
                        <ul className="select__menu">
                          <li className="select__option select__option--selected" data-value="선택">선택</li>
                          <li className="select__option" data-value="daum.net">주차위치코드1</li>
                          <li className="select__option" data-value="daum.net">주차위치코드2</li>
                        </ul>
                      </div>
  
                      <div className="input w800">
                        <input type="text" className="input__field" placeholder="주차위치" />
                        <div className="input__utils">
                          <button type="button" className="jsInputClear input__clear ico ico--input-delete">삭제</button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <th>Key번호</th>
                  <td>
                    <div className="input">
                      <input type="text" className="input__field" placeholder="Key번호" />
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
            <button className="btn btn--light" type="button">취소</button>
            <button className="btn btn--primary" type="button" disabled>확인</button>
            <button className="btn btn--primary" type="button">확인</button>
          </div>
        </main>
    );
  }
  