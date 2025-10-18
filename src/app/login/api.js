"use server";

import sql from "mssql";
import { getPool } from "@/lib/mssql/pool";

// 인증번호 조회
export async function getPhoneAuthNumber({ representativePhone }) {
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("AUTH_PHONE", sql.VarChar, representativePhone);

    const query = `SELECT FLOOR(RAND() * 9000 + 1000) AS NUM;`;
    const result = await request.query(query);
    return result.recordset[0].NUM;
  } catch (err) {
    console.error("Error fetching auth number:", err);
    throw err;
  }
}

// 인증번호 확인 조회
export async function checkPhoneAuthNumber({
  representativePhone,
  authNumber,
}) {
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("AUTH_PHONE", sql.VarChar, representativePhone);
    request.input("CERT_NO", sql.Int, authNumber);

    const query = `SELECT top 1 cert_no FROM CJB_CERT_NO_REG where cell_no = @AUTH_PHONE and cert_no = @CERT_NO order by strt_dtime DESC `;

    const result = await request.query(query);
    return result.recordset[0]?.cert_no ?? null;
  } catch (err) {
    console.error("Error fetching auth number:", err);
    throw err;
  }
}

export async function getSystemUseRequest({ agentId }) {
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("CAR_AGENT", sql.VarChar, agentId);

    const query = `SELECT DBO.SMJ_FN_MK_AGENT() as agent,
                            CONVERT(VARCHAR(10), DATEADD(DAY, 3650, GETDATE()), 21) as alive_dt,
                            COUNT(*) cnt
                       FROM SMJ_USER
                      WHERE LOGINID = 'SS';
                      `;

    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error("Error fetching system use request:", err);
    throw err;
  }
}
