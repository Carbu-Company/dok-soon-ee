"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarGoodsRegisterModal from "@/components/modal/inventoryRegister";

export default function InventoryFinanceRegisterPage({ session = null, dealerList = [], loanCompList = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // 대출회사 선택 상태 관리 (콤보 박스)
  const [isLoanCompSelectOpen, setIsLoanCompSelectOpen] = useState(false);
  const [loanCompCd, setLoanCompCd] = useState('');

  useEffect(() => {
    // URL 쿼리 파라미터에서 showModal이 true이면 모달을 열기
    if (searchParams.get("showModal") === "true") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    // URL에서 쿼리 파라미터 제거
    router.replace("/inventory-finance/register");
  };

  const handleCarSelect = carData => {
    setSelectedCar(carData);
    setIsModalOpen(false);
    router.replace("/inventory-finance/register");
  };
  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">재고금융 등록</h2>

        <div className="guidebox">
          <p className="guidebox__title">
            차 정보를 가지고 인입 시 차량 선택 모달 창 불필요.(차량 검색은 필요. 변경가능)
          </p>
          <p className="guidebox__title">
            네이버 이자계산기 참고(만기일시상환), 월이자/총이자 저장해야 함
          </p>
          <p className="guidebox__title">환경설정 연동되어야 함. 한도 등</p>
          <p className="guidebox__title">캐피탈 선택 시 한도,이용금액, 잔여금액 안내</p>
          <p className="guidebox__title">
            하나의 재고금융 등록시 자동으로 이자테이블 1row 추가(최소 1row~N)
          </p>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-wrap__head">
          <h2 className="table-wrap__title">기준차량</h2>
          <button
            className="btn btn--dark btn--padding--r20"
            type="button"
            onClick={() => setIsModalOpen(true)}
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
              <td>{selectedCar ? selectedCar.carNumber : "123가1234 (123허1234)"}</td>
              <th>매입딜러</th>
              <td>{selectedCar ? selectedCar.dealer : "홍길동"}</td>
              <th>차량명</th>
              <td>{selectedCar ? selectedCar.carName : "그랜저(승용)"}</td>
              <th>매입일</th>
              <td>{selectedCar ? selectedCar.purchaseDate : "2025-08-01"}</td>
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
                캐피탈사 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                  <div className="select">
                    <input
                      className="select__input"
                      type="hidden"
                      name="loanCompCd"
                      value={loanCompCd || ''}
                    />
                    <button className="select__toggle" type="button" onClick={() => setIsLoanCompSelectOpen(!isLoanCompSelectOpen)}>
                      <span className="select__text">
                        {loanCompCd ? loanCompList.find(item => item.CD === loanCompCd)?.CD_NM : '선택'}
                      </span>
                      <Image
                        className="select__arrow"
                        src="/images/ico-dropdown.svg"
                        alt=""
                        width={10}
                        height={10}
                      />
                    </button>

                    <ul className={`select__menu ${isLoanCompSelectOpen ? 'active' : ''}`}>
                      <li className={`select__option ${!loanCompCd ? 'select__option--selected' : ''}`} data-value="" onClick={() => {
                        setLoanCompCd('');
                        setIsLoanCompSelectOpen(false);
                      }}>
                        선택
                      </li>
                      {loanCompList.map((comp) => (
                        <li key={comp.CD_ID} className={`select__option ${loanCompCd === comp.CD_ID ? 'select__option--selected' : ''}`} data-value={comp.CD_ID} onClick={() => {
                          setLoanCompCd(comp.CD_ID);
                          setIsLoanCompSelectOpen(false);
                        }}>
                          {comp.CD_NM}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </td>
              <th>총한도</th>
              <td>500,000,000</td>
              <th>잔여한도</th>
              <td>250,000,000 (50%)</td>
            </tr>
            <tr>
              <th>
                대출금액 <span className="text-red">*</span>
              </th>
              <td>
                <div className="input">
                  <input type="text" className="input__field" placeholder="금액" defaultValue="" />
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
              <th>
                대출실행일 <span className="text-red">*</span>
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
                  <span className="input-help">대출 실행일</span>
                </div>
              </td>
              <th>
                대출기간 <span className="text-red">*</span>
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>이자 납입 총 개월수</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input-group">
                  <div className="select w200">
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
                        width={10}
                        height={10}
                        alt=""
                      />
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
                        3
                      </li>
                    </ul>
                  </div>
                  <span className="input-help">개월</span>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                캐피탈이율
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>캐피탈사에 적용 이율입니다.</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w200">
                    <input
                      type="text"
                      className="input__field center"
                      placeholder="이율"
                      defaultValue=""
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <span className="input-help">%</span>
                </div>
              </td>
              <th>월 이자</th>
              <td>83,333</td>
              <th>총 이자</th>
              <td>500,000</td>
            </tr>
            <tr>
              <th>
                딜러이율 <span className="text-red">*</span>
                <div className="tooltip">
                  <button className="jsTooltipBtn tooltip__btn btn btn--ico">
                    <span className="ico ico--help">보기</span>
                  </button>
                  <div className="tooltip__box">
                    <p>실제 딜러에게 적용되는 이율입니다.</p>
                  </div>
                </div>
              </th>
              <td>
                <div className="input-group input-group--sm">
                  <div className="input w200">
                    <input
                      type="text"
                      className="input__field center"
                      placeholder="이율"
                      defaultValue=""
                    />
                    <div className="input__utils">
                      <button
                        type="button"
                        className="jsInputClear input__clear ico ico--input-delete"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <span className="input-help">%</span>
                </div>
              </td>
              <th>월 이자</th>
              <td>83,333</td>
              <th>총 이자</th>
              <td>500,000</td>
            </tr>

            <tr>
              <th>대출유형</th>
              <td>
                <div className="form-option-wrap">
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup01" defaultChecked />
                      <span className="form-option__title">신규</span>
                    </label>
                  </div>
                  <div className="form-option">
                    <label className="form-option__label">
                      <input type="radio" name="radiogroup01" />
                      <span className="form-option__title">추가</span>
                    </label>
                  </div>
                </div>
              </td>
              <th>특이사항</th>
              <td colSpan="3">
                <div className="input">
                  <input type="text" className="input__field" placeholder="" defaultValue="" />
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
      </div>

      <div className="container__btns">
        <button
          className="btn btn--light"
          type="button"
          onClick={() => {
            window.location.href = "m3.jsp";
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

      {/*
        <div className="container__btns">
          <button className="btn btn--light" type="button">취소</button>
          <button className="btn btn--primary" type="button" disabled>확인</button>
          <button className="btn btn--primary" type="button">확인</button>
        </div>
        */}

      {/* 차량 선택 모달 */}
      <CarGoodsRegisterModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSelect={handleCarSelect}
      />
    </main>
  );
}
