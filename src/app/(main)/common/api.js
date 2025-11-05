"use server";

import sql from "mssql";
import { getPool } from "@/lib/mssql/pool";

  /* 딜러 목록 */
export async function getDealerList(agentId) {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getDealerList?agentId=${agentId}`).then(res => res.json());
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
export async function getCompanyLoanLimit(agentId) {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCompanyLoanLimit?agentId=${agentId}`).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getCompanyLoanLimit Error:", error);
    return { success: false, data: [], error: error.message };
  }
}


export async function getAgentPurCst(agentId) {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getAgentPurCst?agentId=${agentId}`).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getAgentPurCst Error:", error);
    return { success: false, data: [], error: error.message };
  }
}