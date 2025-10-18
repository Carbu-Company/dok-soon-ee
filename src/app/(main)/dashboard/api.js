"use server";

import sql from "mssql";
import { getPool } from "@/lib/mssql/pool";

/* 현금/세금계산서 미발행 리스트 */
export const getTaxCashNoList = async (agentId) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getTaxCashNoList?agentId=${agentId}`).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getTaxCashNoList Error:", error);
    return { success: false, data: [], error: error.message };
  }
};

/* 재고금융 이용 현황 */
export const getInventoryFinanceStatus = async (agentId) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getInventoryFinanceStatus?agentId=${agentId}`).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getInventoryFinanceStatus Error:", error);
    return { success: false, data: [], error: error.message };
  }
};

/* 매입/매출 현황 */
export const getSalesPurchaseSummary = async (agentId) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getSalesPurchaseSummary?agentId=${agentId}`).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getSalesPurchaseSummary Error:", error);
    return { success: false, data: [], error: error.message };
  }
};


/* 문의 현황 */
export const getInquiryStatus = async (agentId) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getInquiryStatus?agentId=${agentId}`).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getInquiryStatus Error:", error);
    return { success: false, data: [], error: error.message };
  }
};

/* 공지사항 */
export const getNoticeStatus = async (agentId) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getNoticeStatus?agentId=${agentId}`).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getNoticeStatus Error:", error);
    return { success: false, data: [], error: error.message };
  }
};
