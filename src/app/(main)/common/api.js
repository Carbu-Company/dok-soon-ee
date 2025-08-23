"use server";

import sql from "mssql";
import { getPool } from "@/lib/mssql/pool";

export async function getCommonDealers(agent_id) {
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("agent_id", sql.VarChar(200), agent_id);

    const query = `
      SELECT *
        FROM CJB_USR
       WHERE AGENT_ID = @agent_id
         AND USR_GRADE_CD = '0'  -- 딜러 권한  (9: 사무장장, 0: 딜러)
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

