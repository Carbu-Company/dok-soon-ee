"use server";

import sql from "mssql";
import { getPool } from "@/lib/mssql/pool";
/* 현금/세금계산서 미발행 리스트 */

export async function getTaxCashNoList(agent_id) {
  try {
    const pool = await getPool();
    const request = pool.request();

    request.input("agent_id", sql.VarChar(200), agent_id);

    const query = `
        SELECT A.COST_SEQ  -- 비용 순번
            , A.COST_PAY_METH_CD, B.CD_NM -- 결제 구분
            , A.COST_EVDC_CD, C.CD_NM -- 영수 증빙
            , E.USR_NM  -- 딜러명
            , A.COST_AMT   -- 비용 금액
            , D.PUR_AMT  -- 통지 금액
            , D.OWNR_NM  -- 고객명
        FROM dbo.CJB_COST A
            , dbo.CJB_COMM_CD B
            , dbo.CJB_COMM_CD C
            , dbo.CJB_CAR_PUR D
            , dbo.CJB_USR E
        WHERE A.COST_PAY_METH_CD = B.CD
        AND B.GRP_CD = '06'   -- 결제 구분
        AND A.COST_EVDC_CD = C.CD
        AND C.GRP_CD = '07'   -- 영수 증빙
        AND A.CAR_REG_ID = D.CAR_REG_ID
        AND D.DLR_ID = E.USR_ID
        AND A.COST_EVDC_CD IN ('001', '004')
        AND A.TAX_ISSU_YN = 'N'
        AND D.AGENT_ID = @agent_id
    `;

    const result = await request.query(query);

    return {
      success: true,
      data: result.recordset,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message || "데이터베이스 연결 오류가 발생했습니다.",
    };
  }
}

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
    return {
      success: false,
      data: null,
      error: error.message || "데이터베이스 연결 오류가 발생했습니다.",
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
           AND DEL_YN = 'N';
      `;

    const result = await request.query(query);

    return {
      success: true,
      data: result.recordset,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message || "데이터베이스 연결 오류가 발생했습니다.",
    };
  }
}

/* 공지 */

export async function getNoticeStatus(agent_id) {
  try {
    const pool = await getPool();
    const request = pool.request();

    request.input("agent_id", sql.VarChar(200), agent_id);

    const query = `
        SELECT ALL_YN, CASE WHEN ALL_YN = 'Y' THEN '전체' ELSE '개별' END GUBUN
             , NTC_NO, NTC_TIT, CONVERT(CHAR(10), REG_DTIME, 23) REG_DT
          FROM dbo.CJB_NTC
         WHERE AGENT_ID = @agent_id
           AND DEL_YN = 'N';
      `;

    const result = await request.query(query);

    return {
      success: true,
      data: result.recordset,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message || "데이터베이스 연결 오류가 발생했습니다.",
    };
  }
}

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
    return {
      success: false,
      data: null,
      error: error.message || "데이터베이스 연결 오류가 발생했습니다.",
    };
  }
}
