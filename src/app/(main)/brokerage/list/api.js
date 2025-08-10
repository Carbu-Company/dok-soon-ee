"use server";

import sql from "mssql";
import { getPool } from "@/lib/mssql/pool";

export async function getBrokerageDataByCellNo(kor_nm, eng_nm) {
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("kor_nm", sql.VarChar(200), kor_nm);
    request.input("eng_nm", sql.VarChar(200), eng_nm);

    const query = `
      SELECT *
      FROM CJB_WORD
      WHERE kor_nm = @kor_nm
        AND eng_nm = @eng_nm
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
