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
    const res = await fetch(`${API_BASE}/api/${path}${qs}`, { 
      method: "GET",
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    // 응답 상태 확인
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // 응답 내용 확인
    const text = await res.text();
    if (!text.trim()) {
      console.warn(`${path} GET: Empty response`);
      return ok(null);
    }

    // JSON 파싱
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error(`${path} GET JSON parse error:`, parseError);
      console.error('Response text:', text);
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }

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

    // 응답 상태 확인
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // 응답 내용 확인
    const text = await res.text();
    if (!text.trim()) {
      console.warn(`${path} POST: Empty response`);
      return ok(null);
    }

    // JSON 파싱
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error(`${path} POST JSON parse error:`, parseError);
      console.error('Response text:', text);
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }

    return ok(data);
  } catch (e) {
    console.error(`${path} POST Error:`, e);
    return fail(e);
  }
}

/* ----------------------------- 사용 요청 ----------------------------- */
export const registerUser = (payload) => apiPost("registerUser", payload);

export const getSystemUseRequest = async (params = {}) => {
  return apiPost("getSystemUseRequest", { ...params });
};

export const checkSangsaCode = (SangsaCode) =>
  apiGet("checkSangsaCode", { SangsaCode });

export const getPhoneAuthNumber = (representativePhone) =>
  apiPost("getPhoneAuthNumber", { representativePhone });

export const checkPhoneAuthNumber = (representativePhone, authNumber) =>
  apiPost("checkPhoneAuthNumber", { representativePhone, authNumber });

/* ------------------------------ 공통/인증 ------------------------------ */
export const login = (payload) => apiPost("login", payload);
export const getCompanyLoanLimit = (carAgent) =>
  apiGet("getCompanyLoanLimit", { carAgent });

/* ---------------------------- 제시 2.0 ---------------------------- */
export const getCarPurList = (payload) => apiPost("getCarPurList", payload);
export const getCarPurSummary = (payload) =>
  apiPost("getCarPurSummary", payload);
export const getCarPurInfo = (carRegId) =>
  apiGet("getCarPurInfo", { carRegId });
export const insertCarPur = (payload) => apiPost("insertCarPur", payload);
export const updateCarPur = (payload) => apiPost("updateCarPur", payload);
export const deleteCarPur = (car_regid, flag_type) =>
  apiGet("deleteCarPur", { car_regid, flag_type });

/* ---------------------------- 매도 2.0 ---------------------------- */
export const getCarSelList = (payload) => apiPost("getCarSelList", payload);
export const getCarSelSummary = (payload) =>
  apiPost("getCarSelSummary", payload);
export const getCarSelInfo = (params) => apiGet("getCarSelInfo", params);
export const updateCarSel = (payload) => apiPost("updateCarSel", payload);
export const deleteCarSel = (car_regid, flag_type) =>
  apiGet("deleteCarSel", { car_regid, flag_type });
export const insertCarBuyCust = (payload) => apiPost("insertCarBuyCust", payload);

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
export const getCarGoodsInfo = (params) => apiGet("getCarGoodsInfo", params);
export const getGoodsFeeDetail = (goodsFeeSeq) =>
  apiGet("getGoodsFeeDetail", { goodsFeeSeq });
export const getGoodsFeeDetailList = (carRegId) =>
  apiGet("getGoodsFeeDetailList", { carRegId });
export const getGoodsFeeCarSummary = (payload) =>
  apiPost("getGoodsFeeCarSummary", payload);
export const insertGoodsFee = (payload) => apiPost("insertGoodsFee", payload);
export const updateGoodsFee = (payload) => apiPost("updateGoodsFee", payload);
/* --------------------------- 재고금융 2.0 --------------------------- */
export const getCarLoanSumList = (payload) =>
  apiPost("getCarLoanSumList", payload);
export const getCarLoanList = (payload) => apiPost("getCarLoanList", payload);
export const getCarLoanSummary = (carAgent) =>
  apiGet("getCarLoanSummary", { carAgent });
export const insertCarLoan = (payload) => apiPost("insertCarLoan", payload);
export const updateCarLoan = (payload) => apiPost("updateCarLoan", payload);
export const deleteCarLoan = (params) => apiGet("deleteCarLoan", params);
export const insertAgentLoanCorp = (payload) => apiPost("insertAgentLoanCorp", payload);
export const updateAgentLoanCorp = (payload) => apiPost("updateAgentLoanCorp", payload);
export const deleteAgentLoanCorp = (params) => apiGet("deleteAgentLoanCorp", params);

/* ---------------------------- 시제(계좌) ---------------------------- */
export const insertAccountInfo = (payload) =>
  apiPost("insertAccountInfo", payload);
export const updateAccountInfo = (payload) =>
  apiPost("updateAccountInfo", payload);
export const getAccountInfo = (carAgent) =>
  apiGet("getAccountInfo", { carAgent });

export const getAssetList = (payload) => apiPost("getAssetList", payload);
export const getAssetSum = (payload) => apiPost("getAssetSum", payload);

/* ------------------------------ 계좌 2.0 ------------------------------ */
// 계좌 목록 조회
export const getCarAcctList = (payload) => apiPost("getCarAcctList", payload);
export const getCarAcctSummary = (payload) => apiPost("getCarAcctSummary", payload);
export const getCarAcctDetail = (acctId) => apiGet("getCarAcctDetail", { acctId });
export const getAgentAcctList = (carAgent) => apiGet("getAgentAcctList", { carAgent });
export const insertCarAcctDetail = (payload) => apiPost("insertCarAcctDetail", payload);
export const updateCarAcctDetail = (payload) => apiPost("updateCarAcctDetail", payload);

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
export const getCarConcilList = (payload) => apiPost("getCarConcilList", payload);
export const getCarConcilSummary = (payload) => apiPost("getCarConcilSummary", payload);
export const insertCarConcil = (payload) => apiPost("insertCarConcil", payload);
export const getCarConcilInfo = (params) => apiGet("getCarConcilInfo", params);
export const updateCarConcil = (payload) => apiPost("updateCarConcil", payload);

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
export const getCashBillList = async (params = {}) => {
  return apiPost("getCashBillList", { ...params });
};
export const getCashBillAmount = (costSeq) =>
  apiGet("getCashBillAmount", { costSeq });

/* --------------------- 현금영수증 발행 리스트 ---------------------- */
export const getReceiptIssueList = async (params = {}) => {
  return apiPost("getReceiptIssueList", { ...params });
};
export const getReceiptIssueSummary = async (params = {}) => {
  return apiPost("getReceiptIssueSummary", { ...params });
};

/* -------------------------- 현금영수증 2.0 -------------------------- */
export const getCarCashList = (payload) => apiPost("getCarCashList", payload);
export const getCarCashSummary = (payload) => apiPost("getCarCashSummary", payload);
export const getCarCashInfo = (params) => apiGet("getCarCashInfo", params);

/* ---------------------- 전자세금계산서 발행 ----------------------- */
export const getTaxInvoiceList = (carAgent) =>
  apiPost("getTaxInvoiceList", { carAgent });
export const getTaxInvoiceAmount = (eInvoiceSeq) =>
  apiGet("getTaxInvoiceAmount", { eInvoiceSeq });

/* ------------------- 전자세금계산서 발행 리스트 ------------------- */
/* ---------------------- 전자세금계산서 2.0 ----------------------- */
export const getCarTaxList = (payload) => apiPost("getCarTaxList", payload);
export const getCarTaxSummary = (payload) => apiPost("getCarTaxSummary", payload);
export const getCarTaxInfo = (params) => apiGet("getCarTaxInfo", params);
export const getCarTaxItemInfo = (params) => apiGet("getCarTaxItemInfo", params);
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
/* ------------------------------ 정산 2.0 ------------------------------ */
export const getCarAdjList = (payload) => apiPost("getCarAdjList", payload);
export const getCarAdjSummary = (payload) => apiPost("getCarAdjSummary", payload);
export const getCarAdjInfo = (params) => apiGet("getCarAdjInfo", params);
export const getCarAdjDtlList = (params) => apiGet("getCarAdjDtlList", params);
export const insertCarAdj = (payload) => apiPost("insertCarAdj", payload);
export const updateCarAdj = (payload) => apiPost("updateCarAdj", payload);
export const deleteCarAdj = (params) => apiGet("deleteCarAdj", params);
export const deleteCarAdjDtl = (params) => apiGet("deleteCarAdjDtl", params);
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
export const getCompanyInfo = (payload) => apiPost("getCompanyInfo", payload);
export const getAgentInfo = async (agentId) => {
  return apiGet("getAgentInfo", { carAgent: agentId });
};
export const getCompanySangsaDealer = async (agentId, sangsaCode, additionalParams = {}) => {
  return apiPost("getCompanySangsaDealer", { agentId, sangsaCode, ...additionalParams });
};
export const getCompanyDealer = async (agentId, additionalParams = {}) => {
  return apiPost("getCompanyDealer", { agentId, ...additionalParams });
};
export const getPurchaseCost = async (agentId, additionalParams = {}) => {
  return apiPost("getPurchaseCost", { agentId, ...additionalParams });
};
export const getSellCostSummary = async (agentId, additionalParams = {}) => {
  return apiPost("getSellCostSummary", { agentId, ...additionalParams });
};
export const getCompanyExpense = async (agentId, additionalParams = {}) => {
  return apiPost("getCompanyExpense", { agentId, ...additionalParams });
};
export const getCompanyIncome = async (agentId, additionalParams = {}) => {
  return apiPost("getCompanyIncome", { agentId, ...additionalParams });
};

/* -------------------------------- 공통 -------------------------------- */
export const getMgtKey = async (params = {}) => {
  return apiGet("getMgtKey", { ...params });
};
export const getDealerList = async (agentId, additionalParams = {}) => {
  return apiGet("getDealerList", { carAgent: agentId, ...additionalParams });
};
export const getCDList = (grpCD) => apiGet("getCDList", { grpCD });
export const getCustomerList = (params) => apiGet("getCustomerList", params);

/* -------------------------------- 팝빌 API -------------------------------- */

/* 현금영수증 */
export const popbillCashbillRegistIssue = (payload) =>
  apiPost("popbill/v1/cashbill/registIssue", payload);
export const popbillCashbillRevokeRegistIssue = (payload) =>
  apiPost("popbill/v1/cashbill/revokeRegistIssue", payload);
export const popbillCashbillGetInfo = (payload) =>
  apiPost("popbill/v1/cashbill/getInfo", payload);
export const popbillCashbillGetPrintURL = (payload) =>
  apiPost("popbill/v1/cashbill/getPrintURL", payload);

/* 전자세금계산서 */
export const popbillTaxinvoiceRegistIssue = (payload) =>
  apiPost("popbill/v1/taxinvoice/registIssue", payload);
export const popbillTaxinvoiceCancelIssue = (payload) =>
  apiPost("popbill/v1/taxinvoice/cancelIssue", payload);
export const popbillTaxinvoiceGetTaxCertURL = (payload) =>
  apiPost("popbill/v1/taxinvoice/getTaxCertURL", payload);
export const popbillTaxinvoiceGetPrintURL = (payload) =>
  apiPost("popbill/v1/taxinvoice/getPrintURL", payload);

/* 계좌 조회 */
export const popbillEasyfinbankRegistBankAccount = (payload) =>
  apiPost("popbill/v1/easyfinbank/registBankAccount", payload);
export const popbillEasyfinbankUpdateBankAccount = (payload) =>
  apiPost("popbill/v1/easyfinbank/updateBankAccount", payload);
export const popbillEasyfinbankSearch = (payload) =>
  apiPost("popbill/v1/easyfinbank/search", payload);
export const popbillEasyfinbankRequestJob = (payload) =>
  apiPost("popbill/v1/easyfinbank/requestJob", payload);
export const popbillEasyfinbankListBankAccount = (payload) =>
  apiPost("popbill/v1/easyfinbank/listBankAccount", payload);

/* 카톡 */
export const popbillKakaoListPlusFriendID = (payload) =>
  apiPost("popbill/v1/kakao/listPlusFriendID", payload);
export const popbillKakaoGetPlusFriendMgtURL = (payload) =>
  apiPost("popbill/v1/kakao/getPlusFriendMgtURL", payload);
export const popbillKakaoGetATSTemplateMgtURL = (payload) =>
  apiPost("popbill/v1/kakao/getATSTemplateMgtURL", payload);
export const popbillKakaoSendATS_one = (payload) =>
  apiPost("popbill/v1/kakao/sendATS_one", payload);
export const popbillKakaoSendATS_multi = (payload) =>
  apiPost("popbill/v1/kakao/sendATS_multi", payload);

/* 문자 */
export const popbillSmsSendSMS = (payload) =>
  apiPost("popbill/v1/sms/sendSMS", payload);

/* 연동회원 */
export const popbillBizinfoJoinMember = (payload) =>
  apiPost("popbill/v1/bizinfo/joinMember", payload);
export const popbillBizinfoQuitMember = (payload) =>
  apiPost("popbill/v1/bizinfo/quitMember", payload);
export const popbillBizinfoGetCorpInfo = (payload) =>
  apiPost("popbill/v1/bizinfo/getCorpInfo", payload);

/* FAX */
export const popbillFaxServiceCheckSenderNumber = (payload) =>
  apiPost("popbill/v1/faxService/checkSenderNumber", payload);
export const popbillFaxServiceGetSenderNumberMgtURL = (payload) =>
  apiPost("popbill/v1/faxService/getSenderNumberMgtURL", payload);
export const popbillFaxServiceGetSenderNumberList = (payload) =>
  apiPost("popbill/v1/faxService/getSenderNumberList", payload);
export const popbillFaxServiceSendOneFAX = (payload) =>
  apiPost("popbill/v1/faxService/sendOneFAX", payload);

/* 홈텍스 수집 */
export const popbillHtTaxinvoiceRequestJob = (payload) =>
  apiPost("popbill/v1/htTaxinvoice/requestJob", payload);
export const popbillHtTaxinvoiceGetJobState = (payload) =>
  apiPost("popbill/v1/htTaxinvoice/GetJobState", payload);
export const popbillHtTaxinvoiceSearch = (payload) =>
  apiPost("popbill/v1/htTaxinvoice/Search", payload);
export const popbillHtTaxinvoiceGetPopUpURL = (payload) =>
  apiPost("popbill/v1/htTaxinvoice/GetPopUpURL", payload);
export const popbillHtTaxinvoiceGetTaxinvoice = (payload) =>
  apiPost("popbill/v1/htTaxinvoice/GetTaxinvoice", payload);
