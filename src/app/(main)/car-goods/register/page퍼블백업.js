"use client";

import { useState, useEffect } from "react";
import CarSearchModal from "@/components/modal/CarSearchModal";
import Image from "next/image";

export default function ProductCostRegisterPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);

  // URL 파라미터를 확인해서 모달을 자동으로 열기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const openModal = urlParams.get("openModal");
      const carId = urlParams.get("carId");

      if (openModal === "true") {
        setIsModalOpen(true);
        if (carId) {
          setSelectedCarId(carId);
        }
      }
    }
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCarSearchClick = () => {
    setIsModalOpen(true);
  };

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">상품화비용 등록</h2>

        <div className="guidebox">
          <p className="guidebox__title">
            차 정보를 가지고 인입 시 차량 선택 모달 창 불필요.(차량 검색은 필요. 변경가능)
          </p>
          <p className="guidebox__title">
            상사별 환경설정에 가져와야 함. 상품화항목 선택 시 항목(지출구분,과세구분,정산반영) 연계
          </p>
          <p className="guidebox__title">비용등록시 종합업무현황-상사매입자료에 자동 반영</p>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">기준차량</h2>
          <button
            className="btn btn--dark btn--padding--r20"
            type="button"
            id="openBtn"
            onClick={handleCarSearchClick}
          >
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
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">상품화비용</h2>
          <button className="btn btn--dark btn--padding--r20" type="button" id="btnClone">
            <span className="ico ico--add"></span>상품화비용 추가
          </button>
        </div>
        <table className="table table--xl" id="myTable">
          <colgroup>
            <col style={{ width: "180px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "64px" }} />
          </colgroup>
          <thead>
            <tr>
              <th rowSpan={2}>상품화항목</th>
              <th rowSpan={2}>지출구분</th>
              <th rowSpan={2}>과세구분</th>
              <th colSpan={3} className="col-half">
                상품화비
              </th>
              <th rowSpan={2}>
                정산반영
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>매입비용(매입원가)으로 처리할 경우 &apos;체크&apos;</p>
                  </div>
                </div>
              </th>
              <th rowSpan={2}>결제일</th>
              <th rowSpan={2}>지출증빙</th>
              <th rowSpan={2}>비고/지출처</th>
              <th rowSpan={2}>삭제</th>
            </tr>
            <tr>
              <th className="col-half">금액</th>
              <th className="col-half">공급가</th>
              <th className="col-half">부가세</th>
            </tr>
          </thead>
          <tbody>
            <tr className="template">
              <td>
                <div className="select">
                  <input
                    className="select__input"
                    type="hidden"
                    name="dealer"
                    defaultValue="value1"
                  />
                  <button className="select__toggle" type="button">
                    <span className="select__text">선택</span>
                    <Image
                      className="select__arrow"
                      src="/images/ico-dropdown.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </button>

                  <ul className="select__menu">
                    <li className="select__option select__option--selected" data-value="value1">
                      선택
                    </li>
                    <li className="select__option" data-value="value2">
                      선택2
                    </li>
                    {/* 필요 시 더 추가 (10개 초과 시 내부 스크롤) */}
                  </ul>
                </div>
              </td>
              <td>
                {/*select 로 처리해도 됨*/}
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup01" defaultChecked />
                      <span className="form-option__title">딜러</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup01" />
                      <span className="form-option__title">상사</span>
                    </label>
                  </div>
                </div>
              </td>
              <td>
                {/*select 로 처리해도 됨*/}
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup02" defaultChecked />
                      <span className="form-option__title">과세</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup02" />
                      <span className="form-option__title">면세</span>
                    </label>
                  </div>
                </div>
              </td>
              <td>
                <div className="input">
                  <input type="text" className="input__field" placeholder="" />
                  <div className="input__utils">
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                    ></button>
                  </div>
                </div>
              </td>
              <td>9,090,909</td>
              <td>909,091</td>
              <td>
                <div className="form-option form-option--icon">
                  <label className="form-option__label">
                    <input type="checkbox" defaultChecked />
                    <span className="form-option__title">선택</span>
                  </label>
                </div>
              </td>
              <td>
                <div className="input">
                  <input
                    type="text"
                    className="jsStartDate input__field input__field--date datepicker"
                    placeholder="날짜"
                    autoComplete="off"
                  />
                </div>
              </td>

              <td>
                <div className="select">
                  <input
                    className="select__input"
                    type="hidden"
                    name="dealer"
                    defaultValue="value1"
                  />
                  <button className="select__toggle" type="button">
                    <span className="select__text">선택</span>
                    <Image
                      className="select__arrow"
                      src="/images/ico-dropdown.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </button>

                  <ul className="select__menu">
                    <li className="select__option select__option--selected" data-value="value1">
                      선택
                    </li>
                    <li className="select__option" data-value="value2">
                      전자세금계산서
                    </li>
                    <li className="select__option" data-value="value3">
                      카드영수증
                    </li>
                    <li className="select__option" data-value="value3">
                      현금영수증
                    </li>
                    {/* 필요 시 더 추가 (10개 초과 시 내부 스크롤) */}
                  </ul>
                </div>
              </td>

              <td>
                <div className="input">
                  <input type="text" className="input__field" placeholder="" />
                  <div className="input__utils">
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                    >
                      비고/지출처
                    </button>
                  </div>
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

      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">합계</h2>
        </div>
        <table className="table">
          <colgroup>
            <col style={{ width: "180px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            <tr>
              <th></th>
              <th>합계금액</th>
              <th>공급가</th>
              <th>부가세</th>
              <th>건수</th>
            </tr>
            <tr>
              <td>정산반영</td>
              <td>1,100,000원</td>
              <td>1,000,000원</td>
              <td>100,000원</td>
              <td>30</td>
            </tr>
            <tr>
              <td>정산제외</td>
              <td>200,000원</td>
              <td>20,000원</td>
              <td>220,000원</td>
              <td>20</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>합계</th>
              <th>1,200,000원</th>
              <th>1,200,000원</th>
              <th>1,200,000원</th>
              <th>50</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="container__btns">
        <button
          className="btn btn--light"
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") window.location.href = "m2.jsp";
          }}
        >
          취소
        </button>
        <button className="btn btn--primary" type="button" disabled>
          확인
        </button>
        <button className="btn btn--primary" type="button">
          확인
        </button>
      </div>

      {/* 차량 검색 모달 */}
      <CarSearchModal open={isModalOpen} onClose={handleModalClose} />
    </main>
  );
}
