"use server";

import sql from "mssql";
import { getPool } from "@/lib/mssql/pool";

  /* 딜러 목록 */
export async function getDealerList(carAgent) {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getDealerList?carAgent=${carAgent}`).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getDealerList Error:", error);
    return { success: false, data: [], error: error.message };
  }
};

  /* 코드 목록 */
export async function getCDList(grpCD) {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCDList?grpCD=${grpCD}`).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getCDList Error:", error);
    return { success: false, data: [], error: error.message };
  }
}

/* 상사 대출회사 한도 */
export async function getCompanyLoanLimit(carAgent) {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCompanyLoanLimit?carAgent=${carAgent}`).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getCompanyLoanLimit Error:", error);
    return { success: false, data: [], error: error.message };
  }
}