"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OtherDealerMediationSalesPage() {
  const router = useRouter();
  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">타상사알선판매 관리</h2>

        <div className="guidebox">
          <p className="guidebox__title">매도처리 후 매출증빙과 연계 필요</p>
          <p className="guidebox__title">세금계산서 직접 발행 필요</p>
          <p className="guidebox__title">
            삭제 시 체크! (계산서 발행건 처리) 계산서 취소 발행 여부 확인 필요.
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
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                    >
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
                    <Image
                      className="select__arrow"
                      src="/images/ico-dropdown.svg"
                      alt=""
                      width={10}
                      height={10}
                    />
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
                    <li className="select__option" data-value="선4">
                      선택4
                    </li>
                  </ul>
                </div>
              </td>
              <th>검색기간</th>
              <td>
                <div className="input-group">
                  <div className="select w140">
                    <input
                      className="select__input"
                      type="hidden"
                      name="dealer"
                      defaultValue="알선판매일"
                    />
                    <button className="select__toggle" type="button">
                      <span className="select__text">알선판매일</span>
                      <Image
                        className="select__arrow"
                        src="/images/ico-dropdown.svg"
                        width={10}
                        height={10}
                        alt=""
                      />
                    </button>

                    <ul className="select__menu">
                      <li className="select__option select__option--selected" data-value="거래일">
                        알선판매일
                      </li>
                      <li className="select__option" data-value="">
                        등록일
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
                <input
                  className="select__input"
                  type="hidden"
                  name="dealer"
                  defaultValue="알선판매일"
                />
                <button className="select__toggle" type="button">
                  <span className="select__text">알선판매일</span>
                  <Image
                    className="select__arrow"
                    src="/images/ico-dropdown.svg"
                    alt=""
                    width={10}
                    height={10}
                  />
                </button>

                <ul className="select__menu">
                  <li className="select__option select__option--selected" data-value="딜러명1">
                    거래일
                  </li>
                  <li className="select__option" data-value="담당딜러">
                    담당딜러
                  </li>
                  <li className="select__option" data-value="차량번호">
                    차량번호
                  </li>
                </ul>
              </div>

              {/* 정렬순서 */}
              <div className="select select--dark w160">
                <input className="select__input" type="hidden" name="dealer" defaultValue="desc" />
                <button className="select__toggle" type="button">
                  <span className="select__text">내림차순</span>
                  <Image
                    className="select__arrow"
                    src="/images/ico-dropdown.svg"
                    alt=""
                    width={10}
                    height={10}
                  />
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
                  <Image
                    className="select__arrow"
                    src="/images/ico-dropdown.svg"
                    alt=""
                    width={10}
                    height={10}
                  />
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
                    <th>차량번호</th>
                    <td>
                      <div className="input">
                        <input type="text" className="input__field" placeholder="" />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                    <th>담당딜러</th>
                    <td>
                      <div className="select">
                        <input
                          className="select__input"
                          type="hidden"
                          name="dealer"
                          defaultValue="선택1"
                        />
                        <button className="select__toggle" type="button">
                          <span className="select__text">선택</span>
                          <Image
                            className="select__arrow"
                            src="/images/ico-dropdown.svg"
                            width={10}
                            height={10}
                            alt=""
                          />
                        </button>

                        <ul className="select__menu">
                          <li
                            className="select__option select__option--selected"
                            data-value="선택1"
                          >
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
                          <input
                            className="select__input"
                            type="hidden"
                            name="dealer"
                            defaultValue="알선판매일"
                          />
                          <button className="select__toggle" type="button">
                            <span className="select__text">알선판매일</span>
                            <Image
                              className="select__arrow"
                              src="/images/ico-dropdown.svg"
                              width={10}
                              height={10}
                              alt=""
                            />
                          </button>

                          <ul className="select__menu">
                            <li className="select__option select__option--selected" data-value="">
                              알선판매일
                            </li>
                            <li className="select__option" data-value="">
                              등록일
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
                    <th>거래항목</th>
                    <td>
                      <div className="select">
                        <input
                          className="select__input"
                          type="hidden"
                          name="dealer"
                          defaultValue="선택"
                        />
                        <button className="select__toggle" type="button">
                          <span className="select__text">선택</span>
                          <Image
                            className="select__arrow"
                            src="/images/ico-dropdown.svg"
                            width={10}
                            height={10}
                            alt=""
                          />
                        </button>

                        <ul className="select__menu">
                          <li className="select__option select__option--selected" data-value="선택">
                            선택
                          </li>
                          <li className="select__option" data-value="선택2">
                            알선수수료
                          </li>
                          <li className="select__option" data-value="선택3">
                            알선수익금
                          </li>
                        </ul>
                      </div>
                    </td>
                    <th>상사명</th>
                    <td>
                      <div className="input">
                        <input type="text" className="input__field" placeholder="" />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                    <th>차량명</th>
                    <td>
                      <div className="input">
                        <input type="text" className="input__field" placeholder="" />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>고객명</th>
                    <td>
                      <div className="input">
                        <input type="text" className="input__field" placeholder="" />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </td>
                    <th>매출증빙</th>
                    <td>
                      <div className="select">
                        <input
                          className="select__input"
                          type="hidden"
                          name="dealer"
                          defaultValue=""
                        />
                        <button className="select__toggle" type="button">
                          <span className="select__text">선택</span>
                          <Image
                            className="select__arrow"
                            src="/images/ico-dropdown.svg"
                            width={10}
                            height={10}
                            alt=""
                          />
                        </button>

                        <ul className="select__menu">
                          <li className="select__option select__option--selected" data-value="선택">
                            선택
                          </li>
                          <li className="select__option" data-value="">
                            현금영수증
                          </li>
                          <li className="select__option" data-value="">
                            전자세금계산서
                          </li>
                          <li className="select__option" data-value="">
                            카드영수증
                          </li>
                        </ul>
                      </div>
                    </td>
                    <th>특이사항</th>
                    <td>
                      <div className="input">
                        <input type="text" className="input__field" placeholder="" />
                        <div className="input__utils">
                          <button
                            type="button"
                            className="jsInputClear input__clear ico ico--input-delete"
                          >
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
              router.push("/car-concil/register");
            }}
          >
            <span className="ico ico--add"></span>알선매출 등록
          </button>
          <div className="input-group">
            {/* 딜러명 */}
            <div className="select select--dark w160">
              <input
                className="select__input"
                type="hidden"
                name="dealer"
                defaultValue="알선판매일"
              />
              <button className="select__toggle" type="button">
                <span className="select__text">알선판매일</span>
                <Image
                  className="select__arrow"
                  src="/images/ico-dropdown.svg"
                  alt=""
                  width={10}
                  height={10}
                />
              </button>

              <ul className="select__menu">
                <li className="select__option select__option--selected" data-value="발행일">
                  알선판매일
                </li>
                <li className="select__option" data-value="">
                  등록일
                </li>
              </ul>
            </div>

            {/* 정렬순서 */}
            <div className="select select--dark w160">
              <input className="select__input" type="hidden" name="dealer" defaultValue="desc" />
              <button className="select__toggle" type="button">
                <span className="select__text">내림차순</span>
                <Image
                  className="select__arrow"
                  src="/images/ico-dropdown.svg"
                  alt=""
                  width={10}
                  height={10}
                />
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
                <Image
                  className="select__arrow"
                  src="/images/ico-dropdown.svg"
                  alt=""
                  width={10}
                  height={10}
                />
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
            <col style={{ width: "auto" }} />
            {/*거래처명*/}
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "auto" }} />
            {/*품목명*/}
            <col style={{ width: "100px" }} />
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
                    <p>차량번호 / 담당딜러 / 차량명</p>
                  </div>
                </div>
              </th>
              <th>알선판매일</th>
              <th>거래항목</th>
              <th>금액</th>
              <th>공제금액</th>
              <th>세액합계</th>
              <th>지급액</th>
              <th>증빙</th>
              <th>발행일</th>
              <th>상사/고객명</th>
              <th>바로가기</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>123가4567 / 홍길동 / 그랜저</td>
              <td>2025-09-11</td>
              <td>알선수수료</td>
              <td>500,000</td>
              <td>50,000</td>
              <td>50,000</td>
              <td>450,000</td>
              <td>전자세금계산서</td>
              <td>
                <button
                  type="button"
                  className="btn btn--light btn--sm"
                  onClick={() => {
                    if (typeof window !== "undefined") window.location.href = "m7_v.jsp";
                  }}
                >
                  발행등록
                </button>
              </td>
              <td>상사/차산사람</td>
              <td>
                <div className="input-group input-group--sm input-group--center">
                  <div className="select select--utils">
                    <button type="button" className="select__toggle">
                      더보기
                    </button>
                    <ul className="select__menu">
                      <li className="select__option">
                        <Link href="/car-concil/modify">알선매출 수정</Link>
                      </li>
                      <li className="select__option">
                        <a
                          href="#"
                          onClick={e => {
                            e.preventDefault();
                            if (typeof window !== "undefined" && window.openModal) {
                              window.openModal("1");
                            }
                          }}
                        >
                          알선매출 삭제
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
                    if (typeof window !== "undefined") window.location.href = "m7_v.jsp";
                  }}
                >
                  상세보기
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="pagination">
          <button type="button" className="pagination__btn pagination__btn--prev">
            이전
          </button>
          {/* MEMO: button 태그에 .on 추가 시, selected 상태 적용 */}
          <button type="button" className="pagination__btn on">
            1
          </button>
          <button type="button" className="pagination__btn">
            2
          </button>
          <button type="button" className="pagination__btn">
            3
          </button>
          <button type="button" className="pagination__btn">
            ...
          </button>
          <button type="button" className="pagination__btn">
            9
          </button>
          <button type="button" className="pagination__btn">
            10
          </button>
          <button type="button" className="pagination__btn pagination__btn--next">
            다음
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">합계표</h2>
        <table className="table">
          <thead>
            <tr>
              <th>거래항목</th>
              <th>건수</th>
              <th>합계금액</th>
              <th>공급가액</th>
              <th>세액</th>
              <th>공제금액</th>
              <th>예수부가세</th>
              <th>원천세</th>
              <th>지급액</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>알선수수료</td>
              <td>17</td>
              <td>1,200,000</td>
              <td>1,100,000</td>
              <td>100,000</td>
              <td>100,000</td>
              <td>100,000</td>
              <td>100,000</td>
              <td>100,000</td>
            </tr>
            <tr>
              <td>알선수익금</td>
              <td>17</td>
              <td>1,200,000</td>
              <td>1,100,000</td>
              <td>100,000</td>
              <td>100,000</td>
              <td>100,000</td>
              <td>100,000</td>
              <td>100,000</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>합계</th>
              <th>17</th>
              <th>1,100,000</th>
              <th>1,000,000</th>
              <th>100,000</th>
              <th>100,000</th>
              <th>100,000</th>
              <th>100,000</th>
              <th>100,000</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  );
}
