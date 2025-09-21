// lib/carApi.js

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function ok(data) {
  return { success: true, data, error: null };
}
function fail(error) {
  const msg = error instanceof Error ? error.message : String(error);
  return { success: false, data: null, error: msg };
}

async function apiGet(path, params) {
  try {
    const qs = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).reduce((acc, [k, v]) => {
            if (v !== undefined && v !== null) acc[k] = String(v);
            return acc;
          }, {})
        ).toString()
      : "";
    const res = await fetch(`${API_BASE}/api/${path}${qs}`, { method: "GET" });
    const data = await res.json();
    return ok(data);
  } catch (e) {
    console.error(`${path} GET Error:`, e);
    return fail(e);
  }
}

async function apiPost(path, body) {
  try {
    const res = await fetch(`${API_BASE}/api/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
    });
    const data = await res.json();
    return ok(data);
  } catch (e) {
    console.error(`${path} POST Error:`, e);
    return fail(e);
  }
}

/* ----------------------------- 사용 요청 ----------------------------- */
export const insertUserRequest = (payload) =>
  apiPost("insertUserRequest", payload);

export const registerUser = (payload) => apiPost("registerUser", payload);

export const getSystemUseRequest = (carAgent) =>
  apiPost("getSystemUseRequest", { carAgent });

export const checkSangsaCode = (SangsaCode) =>
  apiGet("checkSangsaCode", { SangsaCode });

export const getPhoneAuthNumber = (representativePhone) =>
  apiPost("getPhoneAuthNumber", { representativePhone });

export const checkPhoneAuthNumber = (representativePhone, authNumber) =>
  apiPost("checkPhoneAuthNumber", { representativePhone, authNumber });

/* ---------------------------- 제시 2.0 ---------------------------- */
export const getCarPurList = (payload) => apiPost("getCarPurList", payload);
export const getCarPurSummary = (payload) =>
  apiPost("getCarPurSummary", payload);
export const getCarPurDetail = (car_regid) =>
  apiGet("getCarPurDetail", { car_regid });
export const insertCarPur = (payload) => apiPost("insertCarPur", payload);
export const updateCarPur = (payload) => apiPost("updateCarPur", payload);
export const deleteCarPur = (car_regid, flag_type) =>
  apiGet("deleteCarPur", { car_regid, flag_type });

/* ---------------------------- 매도 2.0 ---------------------------- */
export const getCarSelList = (payload) => apiPost("getCarSelList", payload);
export const getCarSelSummary = (payload) =>
  apiPost("getCarSelSummary", payload);
export const updateCarSel = (payload) => apiPost("updateCarSel", payload);
export const deleteCarSel = (car_regid, flag_type) =>
  apiGet("deleteCarSel", { car_regid, flag_type });

/* -------------------------- 매입 매도비 --------------------------- */
export const getBuySellFeeList = (payload) =>
  apiPost("getBuySellFeeList", payload);
export const getBuySellFeeSum = (carAgent) =>
  apiPost("getBuySellFeeSum", { carAgent });
export const getBuySellFeeDetail = (car_regid) =>
  apiGet("getBuySellFeeDetail", { car_regid });

export const getBuyInfoList = (fee_car_regid) =>
  apiGet("getBuyInfoList", { fee_car_regid });

export const getTaxCashNoList = (agent_id) =>
  apiGet("getTaxCashNoList", { agent_id });

export const getInventoryFinanceStatus = (agent_id) =>
  apiGet("getInventoryFinanceStatus", { agent_id });

export const getCarLoanInfo = (car_regid) =>
  apiGet("getCarLoanInfo", { car_regid });

export const getSalesPurchaseSummary = (agent_id) =>
  apiGet("getSalesPurchaseSummary", { agent_id });

export const getInquiryStatus = (agent_id) =>
  apiGet("getInquiryStatus", { agent_id });

export const getNoticeStatus = (agent_id) =>
  apiGet("getNoticeStatus", { agent_id });

export const getBuyFeeList = (fee_car_regid) =>
  apiGet("getBuyFeeList", { fee_car_regid });

export const insertBuyFee = (payload) => apiPost("insertBuyFee", payload);
export const updateBuyFee = (payload) => apiPost("updateBuyFee", payload);

export const getSellInfoList = (fee_car_regid) =>
  apiGet("getSellInfoList", { fee_car_regid });

export const getSellFeeList = (fee_car_regid) =>
  apiGet("getSellFeeList", { fee_car_regid });

export const insertSellFee = (payload) => apiPost("insertSellFee", payload);

export const updateBuyFeeSum = (payload) => apiPost("updateBuyFeeSum", payload);

/* --------------------------- 상품화비 2.0 --------------------------- */
export const getGoodsFeeList = (payload) => apiPost("getGoodsFeeList", payload);
export const getGoodsFeeCarSumList = (payload) =>
  apiPost("getGoodsFeeCarSumList", payload);
export const getGoodsFeeDetail = (goodsFeeSeq) =>
  apiGet("getGoodsFeeDetail", { goodsFeeSeq });
export const getGoodsFeeDetailList = (carRegId) =>
  apiGet("getGoodsFeeDetailList", { carRegId });
export const getGoodsFeeCarSummary = (payload) =>
  apiPost("getGoodsFeeCarSummary", payload);
export const insertGoodsFee = (payload) => apiPost("insertGoodsFee", payload);

/* --------------------------- 재고금융 2.0 --------------------------- */
export const getCarLoanSumList = (payload) =>
  apiPost("getCarLoanSumList", payload);
export const getCarLoanList = (payload) => apiPost("getCarLoanList", payload);
export const getCarLoanSummary = (carAgent) =>
  apiGet("getCarLoanSummary", { carAgent });

/* ---------------------------- 시제(계좌) ---------------------------- */
export const insertAccountInfo = (payload) =>
  apiPost("insertAccountInfo", payload);
export const updateAccountInfo = (payload) =>
  apiPost("updateAccountInfo", payload);
export const getAccountInfo = (carAgent) =>
  apiGet("getAccountInfo", { carAgent });

export const getAssetList = (payload) => apiPost("getAssetList", payload);
export const getAssetSum = (payload) => apiPost("getAssetSum", payload);

/* ----------------------------- 재고금융 ----------------------------- */
export const getFinanceList = (carAgent) =>
  apiPost("getFinanceList", { carAgent });
export const getFinanceSum = (carAgent) =>
  apiPost("getFinanceSum", { carAgent });
export const getFinanceDetail = (carRegid) =>
  apiGet("getFinanceDetail", { carRegid });
export const getFinanceDetailCarInfo = (carRegid) =>
  apiGet("getFinanceDetailCarInfo", { carRegid });
export const getFinanceDetailList = (carRegid) =>
  apiGet("getFinanceDetailList", { carRegid });

/* ------------------------------- 알선 ------------------------------- */
export const getAlsonList = (payload) => apiPost("getAlsonList", payload);

/* ----------------------- 운영현황 - 매출관리 ------------------------ */
export const getSystemSalesList = (payload) =>
  apiPost("getSystemSalesList", payload);
export const getSystemSalesSum = (carAgent) =>
  apiPost("getSystemSalesSum", { carAgent });

/* ----------------------- 운영현황 - 매입관리 ------------------------ */
export const getSystemPurchaseList = (carAgent) =>
  apiPost("getSystemPurchaseList", { carAgent });
export const getSystemPurchaseSum = (carAgent) =>
  apiPost("getSystemPurchaseSum", { carAgent });

/* ---------------------- 운영현황 - 원천징수 ------------------------ */
export const getSystemWithholdingList = (carAgent) =>
  apiPost("getSystemWithholdingList", { carAgent });

/* ------------------------ 운영현황 - 정산내역 ----------------------- */
export const getSystemSettleList = (carAgent) =>
  apiPost("getSystemSettleList", { carAgent });
export const getSystemSettleSum = (carAgent) =>
  apiPost("getSystemSettleSum", { carAgent });

/* ------------------------ 운영현황 - 종합내역 ----------------------- */
export const getSystemOverallDealerList = (carAgent) =>
  apiPost("getSystemOverallDealerList", { carAgent });
export const getSystemOverallDealerSumList = (carAgent) =>
  apiPost("getSystemOverallDealerSumList", { carAgent });
export const getSystemOverallSuggestionList = (carAgent) =>
  apiPost("getSystemOverallSuggestionList", { carAgent });
export const getSystemOverallBuySellList = (carAgent) =>
  apiPost("getSystemOverallBuySellList", { carAgent });
export const getSystemOverallGoodsFeeList = (carAgent) =>
  apiPost("getSystemOverallGoodsFeeList", { carAgent });
export const getSystemOverallFinanceList = (carAgent) =>
  apiPost("getSystemOverallFinanceList", { carAgent });
export const getSystemOverallSellList = (carAgent) =>
  apiPost("getSystemOverallSellList", { carAgent });

/* ---------------------- 운영현황 - 월별 현황 ----------------------- */
export const getSystemMonthlyList = (carAgent) =>
  apiPost("getSystemMonthlyList", { carAgent });

/* ---------------------- 운영현황 - 예상부가세 ---------------------- */
export const getSystemVatSalesList = (carAgent) =>
  apiPost("getSystemVatSalesList", { carAgent });
export const getSystemVatPurchaseList = (carAgent) =>
  apiPost("getSystemVatPurchaseList", { carAgent });

/* ------------------------- 현금영수증 발행 ------------------------- */
export const getCashBillList = (carAgent) =>
  apiPost("getCashBillList", { carAgent });
export const getCashBillAmount = (costSeq) =>
  apiGet("getCashBillAmount", { costSeq });

/* --------------------- 현금영수증 발행 리스트 ---------------------- */
export const getReceiptIssueList = (carAgent) =>
  apiPost("getReceiptIssueList", { carAgent });
export const getReceiptIssueSummary = (carAgent) =>
  apiPost("getReceiptIssueSummary", { carAgent });

/* ---------------------- 전자세금계산서 발행 ----------------------- */
export const getTaxInvoiceList = (carAgent) =>
  apiPost("getTaxInvoiceList", { carAgent });
export const getTaxInvoiceAmount = (eInvoiceSeq) =>
  apiGet("getTaxInvoiceAmount", { eInvoiceSeq });

/* ------------------- 전자세금계산서 발행 리스트 ------------------- */
export const getTaxIssueList = (carAgent) =>
  apiPost("getTaxIssueList", { carAgent });
export const getTaxIssueSummary = (carAgent) =>
  apiPost("getTaxIssueSummary", { carAgent });

/* ----------------------------- 매도 리스트 ----------------------------- */
export const getSellList = (payload) => apiPost("getSellList", payload);
export const getSellSum = (carAgent) => apiPost("getSellSum", { carAgent });

/* ------------------------------ 매도 상세 ------------------------------ */
export const getSellDetail = (sell_car_regid) =>
  apiGet("getSellDetail", { sell_car_regid });
export const getSellFee = (sell_car_regid) =>
  apiGet("getSellFee", { sell_car_regid });
export const getFinanceInterest = (sell_car_regid) =>
  apiGet("getFinanceInterest", { sell_car_regid });
export const getSellProofList = (sell_car_regid) =>
  apiGet("getSellProofList", { sell_car_regid });
export const updateSellCancel = (sell_car_regid) =>
  apiPost("updateSellCancel", { sell_car_regid });

/* -------------------------------- 정산 -------------------------------- */
export const getBuyDetail = (sell_car_regid) =>
  apiGet("getBuyDetail", { sell_car_regid });
export const getSettlementPurchaseInfo = (carRegid) =>
  apiGet("getSettlementPurchaseInfo", { carRegid });
export const getSettlementPurchaseFee = (carRegid) =>
  apiGet("getSettlementPurchaseFee", { carRegid });
export const getSettlementPurchaseFeeDiff = (carRegid) =>
  apiGet("getSettlementPurchaseFeeDiff", { carRegid });
export const getSettlementPurchaseFeeOnePercent = (carRegid) =>
  apiGet("getSettlementPurchaseFeeOnePercent", { carRegid });
export const getSettlementGoodsFee = (params) =>
  apiGet("getSettlementGoodsFee", params);
export const getSettlementGoodsDealFee = (carRegid) =>
  apiGet("getSettlementGoodsDealFee", { carRegid });
export const getSettlementGoodsFeeSum = (carRegid) =>
  apiGet("getSettlementGoodsFeeSum", { carRegid });
export const getSettlementSellFee = (carRegid) =>
  apiGet("getSettlementSellFee", { carRegid });
export const getSettlementSellFeeStandard = (carRegid) =>
  apiGet("getSettlementSellFeeStandard", { carRegid });
export const getSoldDetail = (carRegid) =>
  apiGet("getSoldDetail", { carRegid });
export const getSettlementStockFinanceExist = (carRegid) =>
  apiGet("getSettlementStockFinanceExist", { carRegid });
export const getSettlementInterestRevenue = (carRegid) =>
  apiGet("getSettlementInterestRevenue", { carRegid });
export const getSettlementInterestRevenueSum = (carRegid) =>
  apiGet("getSettlementInterestRevenueSum", { carRegid });
export const getSettlementSellMinapSum = (carRegid) =>
  apiGet("getSettlementSellMinapSum", { carRegid });
export const getSettlementStockFinanceName = (carRegid) =>
  apiGet("getSettlementStockFinanceName", { carRegid });

/* ------------------------------ 환경설정 ------------------------------ */
export const getCompanyInfo = (carAgent) =>
  apiPost("getCompanyInfo", { carAgent });
export const getCompanySangsaDealer = (sangsaCode) =>
  apiPost("getCompanySangsaDealer", { sangsaCode });
export const getCompanyDealer = (carAgent) =>
  apiPost("getCompanyDealer", { carAgent });
export const getPurchaseCost = (carAgent) =>
  apiPost("getPurchaseCost", { carAgent });
export const getSellCostSummary = (carAgent) =>
  apiPost("getSellCostSummary", { carAgent });
export const getCompanyExpense = (carAgent) =>
  apiPost("getCompanyExpense", { carAgent });
export const getCompanyIncome = (carAgent) =>
  apiPost("getCompanyIncome", { carAgent });

/* -------------------------------- 공통 -------------------------------- */
export const getMgtKey = (carAgent) => apiGet("getMgtKey", { carAgent });
export const getDealerList = (carAgent) => apiGet("getDealerList", { carAgent });
export const getCDList = (grpCD) => apiGet("getCDList", { grpCD });
export const getCustomerList = (params) => apiGet("getCustomerList", params);
