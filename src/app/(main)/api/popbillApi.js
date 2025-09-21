// popbillApi.js
// Frontend/Node 공용 사용 가능 (fetch 기반)
// 사용법:
//   const api = createPopbillApi({ baseURL: '/carbu-api', getToken: () => authToken });
//   await api.Cashbill.registIssue({ CorpNum, Cashbill, Memo, UserID, EmailSubject });

export function createPopbillApi({
    baseURL,
    getToken,          // 선택: 인증 토큰을 매 호출 시 헤더로 붙이고 싶을 때 함수로 전달
    defaultHeaders = {}, // 선택: 추가 공통 헤더
    timeoutMs = 30000,    // 선택: 요청 타임아웃
  } = {}) {
    if (!baseURL) throw new Error('createPopbillApi: baseURL is required');
  
    // 공통 POST 헬퍼
    async function post(path, body) {
      const url = `${baseURL}${path}`;
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), timeoutMs);
  
      const headers = {
        'Content-Type': 'application/json',
        ...(typeof getToken === 'function' && getToken()
          ? { Authorization: `Bearer ${getToken()}` }
          : {}),
        ...defaultHeaders,
      };
  
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body ?? {}),
          signal: controller.signal,
          credentials: 'include', // 필요 시 쿠키 기반 세션 사용
        });
  
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await res.json() : await res.text();
  
        if (!res.ok) {
          // 서버 표준 에러 형식 반영
          const err = new Error(
            typeof data === 'object' && data?.message
              ? data.message
              : `HTTP ${res.status} ${res.statusText}`
          );
          err.status = res.status;
          err.payload = data;
          throw err;
        }
  
        // 서버 성공 포맷 { success, message, data }
        return data;
      } finally {
        clearTimeout(t);
      }
    }
  
    // ===== 현금영수증 =====
    const Cashbill = {
      registIssue: (payload) =>
        post('/popbill/v1/cashbill/registIssue', payload),
      revokeRegistIssue: (payload) =>
        post('/popbill/v1/cashbill/revokeRegistIssue', payload),
      getInfo: (payload) =>
        post('/popbill/v1/cashbill/getInfo', payload),
      getPrintURL: (payload) =>
        post('/popbill/v1/cashbill/getPrintURL', payload),
    };
  
    // ===== 전자세금계산서 =====
    const Taxinvoice = {
      registIssue: (payload) =>
        post('/popbill/v1/taxinvoice/registIssue', payload),
      cancelIssue: (payload) =>
        post('/popbill/v1/taxinvoice/cancelIssue', payload),
      getTaxCertURL: (payload) =>
        post('/popbill/v1/taxinvoice/getTaxCertURL', payload),
      getPrintURL: (payload) =>
        post('/popbill/v1/taxinvoice/getPrintURL', payload),
    };
  
    // ===== 계좌 조회(EasyFinBank) =====
    const EasyFinBank = {
      registBankAccount: (payload) =>
        post('/popbill/v1/easyfinbank/registBankAccount', payload),
      updateBankAccount: (payload) =>
        post('/popbill/v1/easyfinbank/updateBankAccount', payload),
      search: (payload) =>
        post('/popbill/v1/easyfinbank/search', payload),
      requestJob: (payload) =>
        post('/popbill/v1/easyfinbank/requestJob', payload),
      listBankAccount: (payload) =>
        post('/popbill/v1/easyfinbank/listBankAccount', payload),
    };
  
    // ===== 카카오(알림톡 등) =====
    const Kakao = {
      listPlusFriendID: (payload) =>
        post('/popbill/v1/kakao/listPlusFriendID', payload),
      getPlusFriendMgtURL: (payload) =>
        post('/popbill/v1/kakao/getPlusFriendMgtURL', payload),
      getATSTemplateMgtURL: (payload) =>
        post('/popbill/v1/kakao/getATSTemplateMgtURL', payload),
      sendATS_one: (payload) =>
        post('/popbill/v1/kakao/sendATS_one', payload),
      sendATS_multi: (payload) =>
        post('/popbill/v1/kakao/sendATS_multi', payload),
    };
  
    // ===== 문자(SMS) =====
    const Sms = {
      sendSMS: (payload) =>
        post('/popbill/v1/sms/sendSMS', payload),
    };
  
    // ===== 연동회원(BizInfo) =====
    const Bizinfo = {
      joinMember: (payload) =>
        post('/popbill/v1/bizinfo/joinMember', payload),
      quitMember: (payload) =>
        post('/popbill/v1/bizinfo/quitMember', payload),
      getCorpInfo: (payload) =>
        post('/popbill/v1/bizinfo/getCorpInfo', payload),
    };
  
    // ===== FAX =====
    const Fax = {
      checkSenderNumber: (payload) =>
        post('/popbill/v1/faxService/checkSenderNumber', payload),
      getSenderNumberMgtURL: (payload) =>
        post('/popbill/v1/faxService/getSenderNumberMgtURL', payload),
      getSenderNumberList: (payload) =>
        post('/popbill/v1/faxService/getSenderNumberList', payload),
      sendOneFAX: (payload) =>
        post('/popbill/v1/faxService/sendOneFAX', payload),
      // 필요 시 서버에 정의된 sendFAX도 노출
      sendFAX: (payload) =>
        post('/popbill/v1/faxService/sendOneFAX', payload), // 서버에 별도 엔드포인트가 있다면 경로 수정
    };
  
    // ===== 홈택스 수집(HTTaxinvoice) =====
    const HtTaxinvoice = {
      requestJob: (payload) =>
        post('/popbill/v1/htTaxinvoice/requestJob', payload),
      getJobState: (payload) =>
        post('/popbill/v1/htTaxinvoice/GetJobState', payload),
      search: (payload) =>
        post('/popbill/v1/htTaxinvoice/Search', payload),
      getPopUpURL: (payload) =>
        post('/popbill/v1/htTaxinvoice/GetPopUpURL', payload),
      getTaxinvoice: (payload) =>
        post('/popbill/v1/htTaxinvoice/GetTaxinvoice', payload),
    };
  
    return {
      Cashbill,
      Taxinvoice,
      EasyFinBank,
      Kakao,
      Sms,
      Bizinfo,
      Fax,
      HtTaxinvoice,
      // 공통 유틸을 노출하고 싶다면:
      _post: post,
    };
  }
  
  // === 간단 예시 ===
  // import { createPopbillApi } from './popbillApi';
  // const api = createPopbillApi({ baseURL: '/carbu-api', getToken: () => window.sessionStorage.getItem('token') });
  // const res = await api.Cashbill.getInfo({ CorpNum: '1234567890', MgtKey: 'cb-2025-0001', UserID: 'tester' });
  // if (res.success) console.log(res.data);
  