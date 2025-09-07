import React from "react";

// Next.js/React 컴포넌트로 변환된 JSX
// 사용법: 페이지 또는 컴포넌트에서 <PurchaseVehicleDetail openModal={(id) => console.log(id)} />
// openModal prop을 전달하지 않으면 기본 console.log로 동작합니다.

export default function PurchaseVehicleDetail({ openModal }: { openModal?: (id: string) => void }) {
  const handleOpen = (id: string) => {
    if (openModal) return openModal(id);
    // 기본 동작: 콘솔 로그 (필요시 모달 로직으로 교체)
    // eslint-disable-next-line no-console
    console.log("openModal:", id);
  };

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">매입차량 상세보기</h2>

        <div className="guidebox">
          <p className="guidebox__title">도움말</p>
          <p className="guidebox__desc">
            도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다.
            도움말 안내 텍스트 문구가 들어갑니다. 도움말 안내 텍스트 문구가 들어갑니다.
          </p>
        </div>
      </div>

      {/* 탭 메뉴 필요 시 */}
      <div className="tab-menu">
        <ul className="tab-menu__list">
          <li>
            <a href="#section1" className="tab-menu__menu on">
              제시(매입)정보
            </a>
          </li>
          <li>
            <a href="#section2" className="tab-menu__menu">
              상품화비용
            </a>
          </li>
          <li>
            <a href="#section3" className="tab-menu__menu">
              재고금융
            </a>
          </li>
          <li>
            <a href="#section4" className="tab-menu__menu">
              매도(판매)정보
            </a>
          </li>
          <li>
            <a href="#section5" className="tab-menu__menu">
              정산내역
            </a>
          </li>
        </ul>
      </div>

      <div className="table-wrap">
        <h2 className="table-wrap__title">기본정보</h2>
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

              <th>차량명</th>
              <td>그랜저(승용)</td>

              <th>차량번호</th>
              <td>123가1234 (123허1234)</td>

              <th>매입딜러</th>
              <td>홍길동</td>

              <th>매입일</th>
              <td>2025-08-01</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="table-wrap" id="section1">
        <h2 className="table-wrap__title">
          매입정보
          {/* <a href="javascript:openModal('1');" className="table-wrap__more">자세히보기</a> */}
        </h2>
        <table className="table">
          <colgroup>
            <col style={{ width: "160px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            <tr>
              <th>매입금액</th>
              <td>100,000,000원</td>
              <th>상사매입비</th>
              <td>165,000원 (입금일 : 2025-08-01)</td>
              <th>취득세</th>
              <td>300,000원</td>
              <th>계약서번호</th>
              <td>343543543543</td>
            </tr>
            <tr>
              <th>이전일</th>
              <td>2025-07-25</td>
              <th>매도자(전소유자)</th>
              <td>개인-홍길순</td>
              <th>주민(법인)등록번호</th>
              <td></td>
              <th>사업자등록번호</th>
              <td></td>
            </tr>
            <tr>
              <th>연락처</th>
              <td></td>
              <th>e메일주소</th>
              <td></td>
              <th>주소</th>
              <td colSpan={3}>경기 수원시</td>
            </tr>
            <tr>
              <th>매입(세금)계산서</th>
              <td></td>
              <th>매입계산서발행일</th>
              <td></td>
              <th>사실확인서</th>
              <td></td>
              <th></th>
              <td></td>
            </tr>
            <tr>
              <th>관련첨부서류</th>
              <td colSpan={7}></td>
            </tr>
            <tr>
              <th>조합제시메모</th>
              <td colSpan={7}></td>
            </tr>
            <tr>
              <th>특이사항</th>
              <td colSpan={7}></td>
            </tr>
            <tr>
              <th>주차위치</th>
              <td>위치코드-위치내용</td>
              <th>Key번호</th>
              <td>1256</td>
              <th></th>
              <td></td>
              <th></th>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div className="table-wrap__utils">
          <button type="button" className="btn btn--light" onClick={() => handleOpen("1")}>
            <span className="ico ico--print"></span>
            인쇄
          </button>
        </div>
      </div>

      <div className="table-wrap" id="section2">
        <h2 className="table-wrap__title">
          상품화비용
          {/* <a href="javascript:openModal('1');" className="table-wrap__more">자세히보기</a> */}
        </h2>
        <table className="table">
          <thead>
            <tr>
              <th>지급일</th>
              <th>지출처</th>
              <th>금액</th>
              <th>과세 여부</th>
              <th>등록일</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-07-01</td>
              <td>홍길동광택</td>
              <td>1,000,000</td>
              <td>과세</td>
              <td>2025-07-10</td>
              <td>비고내용입니다.</td>
            </tr>
          </tbody>
        </table>
        <div className="table-wrap__utils">
          <button type="button" className="btn btn--light">
            <span className="ico ico--print"></span>
            인쇄
          </button>
        </div>
      </div>

      <div className="table-wrap" id="section3">
        <h2 className="table-wrap__title">
          재고금융
          {/* <a href="javascript:openModal('1');" className="table-wrap__more">자세히보기</a> */}
        </h2>
        <table className="table">
          <thead>
            <tr>
              <th>지급일</th>
              <th>지출처</th>
              <th>금액</th>
              <th>과세 여부</th>
              <th>등록일</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-07-01</td>
              <td>홍길동광택</td>
              <td>1,000,000</td>
              <td>과세</td>
              <td>2025-07-10</td>
              <td>비고내용입니다.</td>
            </tr>
          </tbody>
        </table>
        <div className="table-wrap__utils">
          <button type="button" className="btn btn--light">
            <span className="ico ico--print"></span>
            인쇄
          </button>
        </div>
      </div>

      <div className="table-wrap" id="section4">
        <h2 className="table-wrap__title">
          매도(판매)정보
          {/* <a href="javascript:openModal('1');" className="table-wrap__more">자세히보기</a> */}
        </h2>
        <table className="table">
          <colgroup>
            <col style={{ width: "160px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "auto" }} />
          </colgroup>
          <tbody>
            <tr>
              <th>매입금액</th>
              <td>100,000,000원</td>
              <th>상사매입비</th>
              <td>165,000원 (입금일 : 2025-08-01)</td>
              <th>취득세</th>
              <td>300,000원</td>
              <th>계약서번호</th>
              <td>343543543543</td>
            </tr>
            <tr>
              <th>이전일</th>
              <td>2025-07-25</td>
              <th>매도자(전소유자)</th>
              <td>개인-홍길순</td>
              <th>주민(법인)등록번호</th>
              <td></td>
              <th>사업자등록번호</th>
              <td></td>
            </tr>
            <tr>
              <th>연락처</th>
              <td></td>
              <th>e메일주소</th>
              <td></td>
              <th>주소</th>
              <td colSpan={3}>경기 수원시</td>
            </tr>
            <tr>
              <th>매입(세금)계산서</th>
              <td></td>
              <th>매입계산서발행일</th>
              <td></td>
              <th>사실확인서</th>
              <td></td>
              <th></th>
              <td></td>
            </tr>
            <tr>
              <th>관련첨부서류</th>
              <td colSpan={7}></td>
            </tr>
            <tr>
              <th>조합제시메모</th>
              <td colSpan={7}></td>
            </tr>
            <tr>
              <th>특이사항</th>
              <td colSpan={7}></td>
            </tr>
            <tr>
              <th>주차위치</th>
              <td>위치코드-위치내용</td>
              <th>Key번호</th>
              <td>1256</td>
              <th></th>
              <td></td>
              <th></th>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div className="table-wrap__utils">
          <button type="button" className="btn btn--light">
            <span className="ico ico--print"></span>
            인쇄
          </button>
        </div>
      </div>

      <div className="table-wrap" id="section5">
        <h2 className="table-wrap__title">정산내역{/* <a href=\"javascript:openModal('1');\" className=\"table-wrap__more\">자세히보기</a> */}</h2>
        <table className="table">
          <thead>
            <tr>
              <th>지급일</th>
              <th>지출처</th>
              <th>금액</th>
              <th>과세 여부</th>
              <th>등록일</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-07-01</td>
              <td>홍길동광택</td>
              <td>1,000,000</td>
              <td>과세</td>
              <td>2025-07-10</td>
              <td>비고내용입니다.</td>
            </tr>
          </tbody>
        </table>

        <div className="table-wrap__utils">
          <button type="button" className="btn btn--light">
            <span className="ico ico--print"></span>
            인쇄
          </button>
          <button type="button" className="btn btn--light">
            <span className="ico ico--add-black"></span>
            상품화비 등록
          </button>
          <button type="button" className="btn btn--light">
            <span className="ico ico--reset"></span>
            매입 취소
          </button>
          <button type="button" className="btn btn--light">
            <span className="ico ico--reset"></span>
            매도 취소
          </button>
          <button type="button" className="btn btn--light">
            <span className="ico ico--reset"></span>
            정산 취소
          </button>
        </div>
      </div>

      <div className="container__btns">
        <a href="m1.jsp" className="btn btn--light">
          목록으로 돌아가기
        </a>
      </div>
    </main>
  );
}
