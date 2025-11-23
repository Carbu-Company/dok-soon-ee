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
export const getCompanyLoanLimit = (agentId) =>
  apiGet("getCompanyLoanLimit", { agentId });

/* ---------------------------- 제시 2.0 ---------------------------- */
export const getCarPurList = (payload) => apiPost("getCarPurList", payload);
export const getCarPurSummary = (payload) =>
  apiPost("getCarPurSummary", payload);
export const getCarPurInfo = (carRegId) =>
  apiGet("getCarPurInfo", { carRegId });
export const insertCarPur = (payload) => apiPost("insertCarPur", payload);
export const updateCarPur = (payload) => apiPost("updateCarPur", payload);
export const deleteCarPur = (carRegId, flag_type) =>
  apiGet("deleteCarPur", { carRegId, flag_type });

/* ---------------------------- 매도 2.0 ---------------------------- */
export const getCarSelList = (payload) => apiPost("getCarSelList", payload);
export const getCarSelSummary = (payload) =>
  apiPost("getCarSelSummary", payload);
export const getCarSelInfo = (params) => apiGet("getCarSelInfo", params);
export const updateCarSel = (payload) => apiPost("updateCarSel", payload);
export const deleteCarSel = (carRegId, flag_type) =>
  apiGet("deleteCarSel", { carRegId, flag_type });
export const insertCarBuyCust = (payload) => apiPost("insertCarBuyCust", payload);

export const getTaxCashNoList = (agentId) =>
  apiGet("getTaxCashNoList", { agentId });

export const getInventoryFinanceStatus = (agentId) =>
  apiGet("getInventoryFinanceStatus", { agentId });

export const getCarLoanInfo = (carRegId) =>
  apiGet("getCarLoanInfo", { carRegId });

export const getSalesPurchaseSummary = (agentId) =>
  apiGet("getSalesPurchaseSummary", { agentId });

export const getInquiryStatus = (agentId) =>
  apiGet("getInquiryStatus", { agentId });

export const getNoticeStatus = (agentId) =>
  apiGet("getNoticeStatus", { agentId });

/* --------------------------- 상품화비 2.0 --------------------------- */
export const getGoodsFeeList = (payload) => apiPost("getGoodsFeeList", payload);
export const getGoodsFeeCarSumList = (payload) =>
  apiPost("getGoodsFeeCarSumList", payload);
export const getCarGoodsInfo = (carRegId) => apiGet("getCarGoodsInfo", { carRegId });
export const getGoodsFeeDetail = (goodsFeeSeq) =>
  apiGet("getGoodsFeeDetail", { goodsFeeSeq });
export const getGoodsFeeCarSummary = (payload) =>
  apiPost("getGoodsFeeCarSummary", payload);
export const insertGoodsFee = (payload) => apiPost("insertGoodsFee", payload);
export const updateGoodsFee = (payload) => apiPost("updateGoodsFee", payload);
export const deleteAllGoodsFee = (carRegId, usrId) => apiGet("deleteAllGoodsFee", { carRegId, usrId });
export const deleteGoodsFee = (goodsFeeSeq, usrId) => apiGet("deleteGoodsFee", { goodsFeeSeq, usrId });
/* --------------------------- 재고금융 2.0 --------------------------- */
export const getCarLoanSumList = (payload) =>
  apiPost("getCarLoanSumList", payload);
export const getCarLoanList = (payload) => apiPost("getCarLoanList", payload);
export const getCarLoanSummary = (payload) => apiPost("getCarLoanSummary", payload);
export const insertCarLoan = (payload) => apiPost("insertCarLoan", payload);
export const updateCarLoan = (payload) => apiPost("updateCarLoan", payload);
export const deleteCarLoan = (params) => apiGet("deleteCarLoan", params);
export const insertAgentLoanCorp = (payload) => apiPost("insertAgentLoanCorp", payload);
export const updateAgentLoanCorp = (payload) => apiPost("updateAgentLoanCorp", payload);
export const deleteAgentLoanCorp = (params) => apiGet("deleteAgentLoanCorp", params);
export const getCarLoanCorpList = (agentId) => apiGet("getCarLoanCorpList", { agentId });
export const getCarLoanIdOneInfo = (loanId) => apiGet("getCarLoanIdOneInfo", { loanId });

/* ------------------------------ 계좌 2.0 ------------------------------ */
// 계좌 목록 조회
export const getCarAcctList = (payload) => apiPost("getCarAcctList", payload);
export const getCarAcctSummary = (payload) => apiPost("getCarAcctSummary", payload);
export const getCarAcctDetail = (acctId) => apiGet("getCarAcctDetail", { acctId });
export const getAgentAcctList = (agentId) => apiGet("getAgentAcctList", { agentId });
export const insertCarAcctDetail = (payload) => apiPost("insertCarAcctDetail", payload);
export const updateCarAcctDetail = (payload) => apiPost("updateCarAcctDetail", payload);


/* ------------------------------- 알선 ------------------------------- */
export const getCarConcilList = (payload) => apiPost("getCarConcilList", payload);
export const getCarConcilSummary = (payload) => apiPost("getCarConcilSummary", payload);
export const insertCarConcil = (payload) => apiPost("insertCarConcil", payload);
export const getCarConcilInfo = (params) => apiGet("getCarConcilInfo", params);
export const updateCarConcil = (payload) => apiPost("updateCarConcil", payload);



/* -------------------------- 현금영수증 2.0 -------------------------- */
export const getCarCashList = (payload) => apiPost("getCarCashList", payload);
export const getCarCashSummary = (payload) => apiPost("getCarCashSummary", payload);
export const getCarCashInfo = (params) => apiGet("getCarCashInfo", params);

/* ---------------------- 전자세금계산서 2.0 ----------------------- */
export const getCarTaxList = (payload) => apiPost("getCarTaxList", payload);
export const getCarTaxSummary = (payload) => apiPost("getCarTaxSummary", payload);
export const getCarTaxInfo = (params) => apiGet("getCarTaxInfo", params);
export const getCarTaxItemInfo = (params) => apiGet("getCarTaxItemInfo", params);


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

/* ------------------------------ 환경설정 ------------------------------ */
// 환경설정 관련 함수
export const getCompanyInfo = (payload) => apiPost("getCompanyInfo", payload);

// 상사(Agent) 정보 조회/수정
export const getAgentInfo = (agentId) => apiGet("getAgentInfo", { agentId });
export const updateCarAgent = (payload) => apiPost("updateCarAgent", payload);

// 로그인 정보 조회/수정
export const getLoginInfo = (usrId) => apiGet("getLoginInfo", { usrId });
export const updateSettingLogin = (payload) => apiPost("updateSettingLogin", payload);

// 대출(캐피탈) 정보 관련
export const getCapitalInfo = (agentId) => apiGet("getCapitalInfo", { agentId });
export const getAgentLoanCorpList = (agentId) => apiGet("getAgentLoanCorpList", { agentId });
export const insertAgentLoanCorp = (payload) => apiPost("insertAgentLoanCorp", payload);
export const updateAgentLoanCorp = (payload) => apiPost("updateAgentLoanCorp", payload);
export const deleteAgentLoanCorp = (params) => apiGet("deleteAgentLoanCorp", params);

// 상사 딜러 매핑(상사 딜러 관리)
export const getCompanySangsaDealer = (agentId, sangsaCode, additionalParams = {}) => apiPost("getCompanySangsaDealer", { agentId, sangsaCode, ...additionalParams });

// 딜러 관리 (목록, 추가, 수정, 삭제)
export const getDealerList = (agentId) => apiGet("getDealerList", { agentId });
export const insertSettingDealer = (payload) => apiPost("insertSettingDealer", payload);
export const updateSettingDealer = (payload) => apiPost("updateSettingDealer", payload);
export const deleteSettingDealer = (params) => apiGet("deleteSettingDealer", params);

// 매입/매도비 설정 관련
export const getPurchaseCost = (agentId, additionalParams = {}) => apiPost("getPurchaseCost", { agentId, ...additionalParams });
export const getSellCost = (agentId, additionalParams = {}) => apiPost("getSellCost", { agentId, ...additionalParams });
export const updateSettingCost = (payload) => apiPost("updateSettingCost", payload);
export const deleteSettingCost = (params) => apiGet("deleteSettingCost", params);

// 지출/수입 항목(Expense/Income) 관리
export const getExpenseItem = (agentId, additionalParams = {}) => apiPost("getExpenseItem", { agentId, ...additionalParams });
export const insertExpenseItem = (payload) => apiPost("insertExpenseItem", payload);
export const updateExpenseItem = (payload) => apiPost("updateExpenseItem", payload);
export const deleteExpenseItem = (params) => apiGet("deleteExpenseItem", params);

export const getIncomeItem = (agentId, additionalParams = {}) => apiPost("getIncomeItem", { agentId, ...additionalParams });
export const insertIncomeItem = (payload) => apiPost("insertIncomeItem", payload);
export const updateIncomeItem = (payload) => apiPost("updateIncomeItem", payload);
export const deleteIncomeItem = (params) => apiGet("deleteIncomeItem", params);

// 계좌(Account) 관리
export const getAgentAcctList = (agentId) => apiGet("getAgentAcctList", { agentId });
export const insertAgentAcct = (payload) => apiPost("insertAgentAcct", payload);
export const updateAgentAcct = (payload) => apiPost("updateAgentAcct", payload);
export const deleteAgentAcct = (params) => apiGet("deleteAgentAcct", params);

/* -------------------------------- 공통 -------------------------------- */
export const getMgtKey = async (params = {}) => {
  return apiGet("getMgtKey", { ...params });
};

export const getCashMgmtKey = async (params = {}) => {
  return apiGet("getCashMgmtKey", { ...params });
};

export const getTaxMgmtKey = async (params = {}) => {
  return apiGet("getTaxMgmtKey", { ...params });
};

export const getCDList = (grpCD) => apiGet("getCDList", { grpCD });
export const getCustomerList = (params) => apiGet("getCustomerList", params);

/* -------------------------------- 차량 검색 -------------------------------- */
export const getCarSearchList = (agentId, carNo) => 
  apiGet("getCarSearchList", { agentId, carNo });

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
