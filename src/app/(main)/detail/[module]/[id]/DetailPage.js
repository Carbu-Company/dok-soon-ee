"use client";
import { useState } from "react";
import DetailModal from "../../../../../components/modal/DetailModal";

export default function DetailPage({ title, data, dataSets, moduleType, onEdit, onDelete, onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const v = (...keys) => {
    if (!data) return "";
    for (const k of keys) {
      const val = data?.[k];
      if (val !== undefined && val !== null && val !== "") return val;
    }
    return "";
  };

  const prsnGubunLabel = () => {
    const code = v("PRSN_SCT_CD", "제시구분코드");
    if (code === "0") return "상사매입";
    if (code === "1") return "직거래";
    return v("제시구분", "PRSN_SCT_NM") || "";
  };

  const fmtNumber = (num) => {
    if (num === undefined || num === null || num === "") return "";
    const n = Number(num);
    return Number.isFinite(n) ? n.toLocaleString() : String(num);
  };

  const openModal = (id) => {
    console.log("openModal", id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    console.log("Print functionality");
    // 인쇄 로직 구현
  };

  // DetailModal에서 사용할 수 있도록 데이터 변환
  const getModalData = () => {
    if (!data) return null;
    
    return {
      PRSN_SCT_CD: '0', // 상사매입
      CAR_NM: data.차량명 || '그랜저',
      CAR_NO: data.차량번호 || '123가1234',
      DLR_NM: data.담당딜러 || '홍길동',
      CAR_PUR_DT: data.매입일 || '2025-08-01',
      PUR_BEF_CAR_NO: '123허1234',
      PUR_AMT: 100000000,
      AGENT_PUR_CST: 165000,
      AGENT_PUR_CST_PAY_DT: '2025-08-01',
      GAIN_TAX: 300000,
      CTSH_NO: '343543543543',
      CAR_REG_DT: '2025-07-25',
      OWNR_TP_CD: '0',
      OWNR_NM: '홍길순',
      OWNR_SSN: '1234567890123',
      OWNR_BRNO: '',
      OWNR_PHON: '',
      OWNR_ZIP: '12345',
      OWNR_ADDR1: '경기 수원시',
      OWNR_ADDR2: '',
      TXBL_RCV_YN: 'N',
      TXBL_ISSU_DT: '',
      FCT_CNDC_YN: 'N',
      COMB_PRSN_MEMO: '',
      PUR_DESC: data.특이사항 || '',
      PARK_ZON_NM: '위치코드',
      PARK_ZON_DESC: '위치내용',
      PARK_KEY_NO: '1256'
    };
  };

  return (
    <main className="container container--page">
      <div className="container__head">
        <h2 className="container__title">상세보기</h2>

        <div className="guidebox">
          <p className="guidebox__title">
            탭 각각 별도 파일(url)로 처리하는게 나을수도. 인입되는 경로에 따라 유연성있게
          </p>
        </div>
      </div>

      {/* 탭 메뉴 필요 시 */}
      <div className="tab-menu">
        <ul className="tab-menu__list">
          <li>
            <a href="#section1" className="tab-menu__menu on">
              매입정보
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
              판매정보
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
        <h2 className="table-wrap__title">기준차량</h2>
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
              <td>{prsnGubunLabel()}</td>
              <th>차량번호</th>
              <td>{`${v("CAR_NO", "차량번호")}${v("PUR_BEF_CAR_NO") ? ` (${v("PUR_BEF_CAR_NO")})` : ""}`}</td>
              <th>매입딜러</th>
              <td>{v("DLR_NM", "담당딜러")}</td>
              <th>차량명</th>
              <td>{v("CAR_NM", "차량명")}</td>
              <th>매입일</th>
              <td>{v("CAR_PUR_DT", "매입일")}</td>
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
              <td>
                {(() => {
                  const amt = v("PUR_AMT", "매입금액");
                  const n = typeof amt === "number" ? amt : Number(String(amt).replace(/,/g, ""));
                  return isNaN(n) ? amt : n.toLocaleString();
                })()}
              </td>
              <th>상사매입비</th>
              <td>
                {(() => {
                  const cost = v("AGENT_PUR_CST");
                  const costStr = cost !== undefined && cost !== null && cost !== ""
                    ? Number(String(cost).replace(/,/g, "")).toLocaleString()
                    : "";
                  const payDt = v("AGENT_PUR_CST_PAY_DT");
                  return (
                    <>
                      {costStr}
                      {payDt && (
                        <>
                          <br />
                          (입금일 : {payDt})
                        </>
                      )}
                    </>
                  );
                })()}
              </td>
              <th>취득세</th>
              <td>
                {(() => {
                  const tax = v("GAIN_TAX");
                  const n = typeof tax === "number" ? tax : Number(String(tax).replace(/,/g, ""));
                  return isNaN(n) ? tax : n.toLocaleString();
                })()}
              </td>
              <th>계약서번호</th>
              <td>{v("CTSH_NO")}</td>
            </tr>
            <tr>
              <th>이전일</th>
              <td>{v("CAR_REG_DT")}</td>
              <th>매도자(전소유자)</th>
              <td>{`${v("OWNR_TP_CD") === "001" ? "개인" : v("OWNR_TP_CD") === "002" ? "법인" : ""}${v("OWNR_NM") ? `-${v("OWNR_NM")}` : ""}`}</td>
              <th>주민(법인)등록번호</th>
              <td>{v("OWNR_SSN")}</td>
              <th>사업자등록번호</th>
              <td>{v("OWNR_BRNO")}</td>
            </tr>
            <tr>
              <th>연락처</th>
              <td>{v("OWNR_PHON", "연락처")}</td>
              <th>e메일주소</th>
              <td>{v("OWNR_EMAIL", "이메일")}</td>
              <th>주소</th>
              <td colSpan={3}>{`${v("OWNR_ADDR1")}${v("OWNR_ADDR2") ? ` ${v("OWNR_ADDR2")}` : ""}`}</td>
            </tr>
            <tr>
              <th>매입(세금)계산서</th>
              <td>{v("TXBL_RCV_YN")}</td>
              <th>매입계산서발행일</th>
              <td>{v("TXBL_ISSU_DT")}</td>
              <th>사실확인서</th>
              <td>{v("FCT_CNDC_YN")}</td>
              <th></th>
              <td></td>
            </tr>
            <tr>
              <th>관련첨부서류</th>
              <td colSpan={7}>{v("ATTACH_DESC")}</td>
            </tr>
            <tr>
              <th>조합제시메모</th>
              <td colSpan={7}>{v("COMB_PRSN_MEMO")}</td>
            </tr>
            <tr>
              <th>특이사항</th>
              <td colSpan={7}>{v("PUR_DESC", "특이사항")}</td>
            </tr>
            <tr>
              <th>주차위치</th>
              <td>{`${v("PARK_ZON_NM")}${v("PARK_ZON_DESC") ? `-${v("PARK_ZON_DESC")}` : ""}`}</td>
              <th>Key번호</th>
              <td>{v("PARK_KEY_NO")}</td>
              <th></th>
              <td></td>
              <th></th>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div className="table-wrap__utils">
          <button
            type="button"
            className="btn btn--light "
            onClick={() => openModal("1")}
          >
            <span className="ico ico--print"></span>인쇄
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
            {(() => {
              const g = dataSets?.goods || null;
              const row = g || {};
              const empty = !g;
              return (
                <tr>
                  <td>{empty ? "" : (row.PAY_DT || row.PAY_DATE || row.REG_DT || "")}</td>
                  <td>{empty ? "" : (row.EXPENSE_NM || row.DEAL_CORP_NM || row.SUPPLY_TO || "")}</td>
                  <td>{empty ? "" : fmtNumber(row.AMT || row.TRADE_AMT || row.TOTAL_AMT)}</td>
                  <td>{empty ? "" : (row.TAX_YN || row.VAT_YN || row.TAXABLE_NM || "")}</td>
                  <td>{empty ? "" : (row.REG_DT || row.INS_DT || "")}</td>
                  <td>{empty ? "" : (row.REMARK || row.MEMO || "")}</td>
                </tr>
              );
            })()}
          </tbody>
        </table>
        <div className="table-wrap__utils">
          <button type="button" className="btn btn--light ">
            <span className="ico ico--print"></span>인쇄
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
            {(() => {
              const l = dataSets?.loan || null;
              const row = l || {};
              const empty = !l;
              return (
                <tr>
                  <td>{empty ? "" : (row.PAY_DT || row.LOAN_DT || row.REG_DT || "")}</td>
                  <td>{empty ? "" : (row.CAPITAL_NM || row.FIN_CO_NM || "")}</td>
                  <td>{empty ? "" : fmtNumber(row.LOAN_AMT || row.AMT || row.TRADE_AMT)}</td>
                  <td>{empty ? "" : (row.TAX_YN || row.VAT_YN || row.TAXABLE_NM || "")}</td>
                  <td>{empty ? "" : (row.REG_DT || row.INS_DT || "")}</td>
                  <td>{empty ? "" : (row.MEMO || row.REMARK || "")}</td>
                </tr>
              );
            })()}
          </tbody>
        </table>
        <div className="table-wrap__utils">
          <button type="button" className="btn btn--light ">
            <span className="ico ico--print"></span>인쇄
          </button>
        </div>
      </div>

      <div className="table-wrap" id="section4">
        <h2 className="table-wrap__title">
          판매정보
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
            {(() => {
              const s = dataSets?.sell || {};
              return (
                <>
                  <tr>
                    <th>매도금액</th>
                    <td>{fmtNumber(s.SELL_AMT || s.TRADE_AMT)}</td>
                    <th>매도일</th>
                    <td>{s.SELL_DT || s.TRADE_DT || ""}</td>
                    <th>구매자</th>
                    <td>{s.CUST_NM || s.BUYER_NM || ""}</td>
                    <th>계약서번호</th>
                    <td>{s.CTSH_NO || ""}</td>
                  </tr>
                  <tr>
                    <th>담당딜러</th>
                    <td>{s.DLR_NM || ""}</td>
                    <th>연락처</th>
                    <td>{s.CUST_PHON || s.PHON || ""}</td>
                    <th>비고</th>
                    <td colSpan={3}>{s.MEMO || s.REMARK || ""}</td>
                  </tr>
                </>
              );
            })()}
          </tbody>
        </table>
        <div className="table-wrap__utils">
          <button type="button" className="btn btn--light ">
            <span className="ico ico--print"></span>인쇄
          </button>
        </div>
      </div>

      <div className="table-wrap" id="section5">
        <h2 className="table-wrap__title">
          정산내역
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
            {(() => {
              const c = dataSets?.concil || {};
              const amt = c.ADJ_AMT || c.TOTAL_AMT || c.TRADE_AMT;
              return (
                <tr>
                  <td>{c.ADJ_DT || c.PAY_DT || ""}</td>
                  <td>{c.PAY_TO || c.CUST_NM || c.DLR_NM || ""}</td>
                  <td>{fmtNumber(amt)}</td>
                  <td>{c.TAX_YN || c.VAT_YN || ""}</td>
                  <td>{c.REG_DT || c.INS_DT || ""}</td>
                  <td>{c.MEMO || c.REMARK || ""}</td>
                </tr>
              );
            })()}
          </tbody>
        </table>

        <div className="table-wrap__utils">
          <button type="button" className="btn btn--light ">
            <span className="ico ico--print"></span>인쇄
          </button>
          <button type="button" className="btn btn--light ">
            <span className="ico ico--add-black"></span>상품화비 등록
          </button>
          <button type="button" className="btn btn--light ">
            <span className="ico ico--reset"></span>매입 취소
          </button>
          <button type="button" className="btn btn--light ">
            <span className="ico ico--reset"></span>매도 취소
          </button>
          <button type="button" className="btn btn--light ">
            <span className="ico ico--reset"></span>정산 취소
          </button>
        </div>
      </div>

      <div className="container__btns">
        <button type="button" className="btn btn--light" onClick={onBack}>
          목록으로 돌아가기
        </button>
      </div>

      {/* DetailModal */}
      {isModalOpen && (
        <DetailModal
          car={getModalData()}
          open={isModalOpen}
          onClose={closeModal}
          onPrint={handlePrint}
        />
      )}
    </main>
  );
}
