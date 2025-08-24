"use server";

import sql from "mssql";
import { getPool } from "@/lib/mssql/pool";

/* 현금/세금계산서 미발행 리스트 */
export const getTaxCashNoList = async (agent_id) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getTaxCashNoList?agent_id=${agent_id}`).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getTaxCashNoList Error:", error);
    return { success: false, data: [], error: error.message };
  }
};

/* 재고금융 이용 현황 */
export async function getInventoryFinanceStatus(agent_id) {
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("agent_id", sql.VarChar(200), agent_id);

    const query = `
        SELECT A.LOAN_CORP_NM
            , A.TOT_LMT_AMT
            , A.TOT_LOAN_AMT
            , FORMAT((TOT_LOAN_AMT/TOT_LMT_AMT) * 100, 'N1') + '%' AS RT
        FROM dbo.CJB_AGENT_LOAN_CORP A
        WHERE A.AGENT_ID = @agent_id
    `;

    const result = await request.query(query);

    return {
      success: true,
      data: result.recordset,
      error: null,
    };
  } catch (error) {
    console.error("getInventoryFinanceStatus Error:", error);
    return {
      success: false,
      data: [],
      error: error.message || "재고금융 데이터 조회 중 오류가 발생했습니다.",
    };
  }
}

/* 문의 현황 */
export async function getInquiryStatus(agent_id) {
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("agent_id", sql.VarChar(200), agent_id);

    const query = `
        SELECT BBC_NO, BBC_TIT, CONVERT(CHAR(10), REG_DTIME, 23) AS REG_DT
        FROM dbo.CJB_INQ_BB
        WHERE AGENT_ID = @agent_id
        AND DEL_YN = 'N'
    `;

    const result = await request.query(query);

    return {
      success: true,
      data: result.recordset,
      error: null,
    };
  } catch (error) {
    console.error("getInquiryStatus Error:", error);
    return {
      success: false,
      data: [],
      error: error.message || "문의 데이터 조회 중 오류가 발생했습니다.",
    };
  }
}

/* 공지사항 */
export async function getNoticeStatus(agent_id) {
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("agent_id", sql.VarChar(200), agent_id);

    const query = `
        SELECT ALL_YN, 
               CASE WHEN ALL_YN = 'Y' THEN '전체' ELSE '개별' END GUBUN,
               NTC_NO, NTC_TIT, 
               CONVERT(CHAR(10), REG_DTIME, 23) REG_DT
        FROM dbo.CJB_NTC
        WHERE AGENT_ID = @agent_id
        AND DEL_YN = 'N'
    `;

    const result = await request.query(query);

    return {
      success: true,
      data: result.recordset,
      error: null,
    };
  } catch (error) {
    console.error("getNoticeStatus Error:", error);
    return {
      success: false,
      data: [],
      error: error.message || "공지사항 데이터 조회 중 오류가 발생했습니다.",
    };
  }
}

/* 딜러 목록 */
export async function getDealerList(agent_id) {
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("agent_id", sql.VarChar(200), agent_id);

    const query = `
        SELECT *
        FROM CJB_USR
        WHERE AGENT_ID = @agent_id
        AND USR_GRADE_CD = '9'
    `;

    const result = await request.query(query);

    return {
      success: true,
      data: result.recordset,
      error: null,
    };
  } catch (error) {
    console.error("getDealerList Error:", error);
    return {
      success: false,
      data: [],
      error: error.message || "딜러 목록 조회 중 오류가 발생했습니다.",
    };
  }
}
