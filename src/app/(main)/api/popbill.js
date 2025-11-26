import { getCashMgmtKey } from "./search";

export const putReceiptRegisterIssue = async (userData, formData) => {
    try {
      
      /**
       * 현금영수증 발행 키값 조회
       */
      const mgtKey = await getCashMgmtKey(userData.agentId);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/cashbill/registIssue/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CorpNum: "5258103621", // "5258103621", //userData.agentBrno,
            Cashbill: {
              mgtKey: mgtKey,
              tradeType: "승인거래",
              tradeUsage: formData.tradeSctCd === '0' ? "소득공제용" : "지출증빙용",
              tradeOpt: "일반",
              taxationType: "과세",
              totalAmount: formData.tradeAmt,
              supplyCost: formData.tradeSupPrc,
              tax: formData.tradeVat,
              serviceFee: "0",
              franchiseCorpNum: "5258103621",     // userData.agentBrno,
              identityNum: formData.rcgnNo,       // 식별번호      
            },
            memo: "즉시 발행 테스트",
            UserID: "aibzcokr",                // aibzcokr, ------------ userData.usrId,
            EmailSubject: "발행 안내메일",
          }),
        }
      );
  
      if (!res.ok) {
        throw new Error("발행 처리에 실패했습니다");
      }
  
      const data = await res.json();
      console.log("발행 결과:", data);
      return data;
    } catch (error) {
      console.error("발행 처리 오류:", error);
      throw new Error(`발행 처리에 실패했습니다: ${error.message}`);
    }
  };
  
  // 현금영수증 발행취소
  export const cancelCashReceipt = async (userData, receiptData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/cashbill/revokeRegistIssue`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CorpNum: userData.EMPID || "8218701635",
            MgtKey: receiptData.MgtKey || "2025040101-002",
            OrgConfirmNum: receiptData.OrgConfirmNum || "TB0000073",
            OrgTradeDate: receiptData.OrgTradeDate || "20250401",
            SMSSendYN: receiptData.SMSSendYN || false,
            Memo: receiptData.Memo || "거래 취소로 인한 발행",
            IsPartCancel: receiptData.IsPartCancel || false,
            CancelType: receiptData.CancelType || 1,
            SupplyCost: receiptData.SupplyCost || "90909",
            Tax: receiptData.Tax || "9091",
            ServiceFee: receiptData.ServiceFee || "0",
            TotalAmount: receiptData.TotalAmount || "100000",
            UserID: userData.EMPID || "sbs_ifbs99",
            EmailSubject: receiptData.EmailSubject || "취소 현금영수증 발행 안내"
          }),
        }
      );

      if (!res.ok) {
        throw new Error("현금영수증 발행취소에 실패했습니다");
      }

      const data = await res.json();
      console.log("현금영수증 발행취소 결과:", data);
      return data;
    } catch (error) {
      console.error("현금영수증 발행취소 오류:", error);
      throw new Error(`현금영수증 발행취소에 실패했습니다: ${error.message}`);
    }
  };


  // 현금영수증 상태 확인   
  export const checkCashReceiptStatus = async (userData, receiptData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/cashbill/getInfo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CorpNum: userData.EMPID || "8218701635",
            MgtKey: receiptData.MgtKey || "2025040101-002",
            UserID: userData.EMPID || "sbs_ifbs99"
          }),
        }
      );

      if (!res.ok) {
        throw new Error("현금영수증 상태 확인에 실패했습니다");
      }

      const data = await res.json();
      console.log("현금영수증 상태 확인 결과:", data);
      return data;
    } catch (error) {
      console.error("현금영수증 상태 확인 오류:", error);
      throw new Error(`현금영수증 상태 확인에 실패했습니다: ${error.message}`);
    }
  };


  // 현금영수증 인쇄 팝업 URL 생성
  export const createCashReceiptPrintURL = async (userData, receiptData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/cashbill/getPrintURL`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CorpNum: userData.EMPID || "8218701635",
            MgtKey: receiptData.MgtKey || "2025040101-003",
            UserID: userData.EMPID || "sbs_ifbs99"
          }),
        }
      );

      if (!res.ok) {
        throw new Error("현금영수증 인쇄 팝업 URL 생성에 실패했습니다");
      }

      const data = await res.json();
      console.log("현금영수증 인쇄 팝업 URL 생성 결과:", data);
      return data;
    } catch (error) {
      console.error("현금영수증 인쇄 팝업 URL 생성 오류:", error);
      throw new Error(`현금영수증 인쇄 팝업 URL 생성에 실패했습니다: ${error.message}`);
    }
  };

  // 계좌등록
  // 계좌등록 함수
  export const registerBankAccount = async (userData, bankAccountData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/easyfinbank/registBankAccount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CorpNum: userData?.EMPID || "8218701635",
            BankAccountInfo: {
              BankCode: bankAccountData?.BankCode || "0004",
              AccountNumber: bankAccountData?.AccountNumber || "92380100062281",
              AccountPWD: bankAccountData?.AccountPWD || "9148",
              AccountType: bankAccountData?.AccountType || "법인",
              IdentityNumber: bankAccountData?.IdentityNumber || "8218701635",
              AccountName: bankAccountData?.AccountName || "업무용 계좌",
              BankID: bankAccountData?.BankID || "LEESH0564",
              UsePeriod: bankAccountData?.UsePeriod || 1,
              Memo: bankAccountData?.Memo || "추가 메모 내용"
            },
            UserID: userData?.EMPID || "sbs_ifbs99"
          }),
        }
      );

      if (!res.ok) {
        throw new Error("계좌등록에 실패했습니다");
      }

      const data = await res.json();
      console.log("계좌등록 결과:", data);
      return data;
    } catch (error) {
      console.error("계좌등록 오류:", error);
      throw new Error(`계좌등록에 실패했습니다: ${error.message}`);
    }
  };


// 계좌정보수정 
export const updateBankAccount = async (userData, bankAccountData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/easyfinbank/updateBankAccount`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          BankCode: bankAccountData?.BankCode || "0004",
          AccountNumber: bankAccountData?.AccountNumber || "92380100062281",
          UpdateEasyFinBankAccountForm: {
            AccountPWD: bankAccountData?.AccountPWD || "9148",
            AccountName: bankAccountData?.AccountName || "국민은행 수정된 계좌 별칭",
            BankID: bankAccountData?.BankID || "LEESH0564",
            Memo: bankAccountData?.Memo || "계좌 정보 수정 요청222"
          },
          UserID: userData?.EMPID || "sbs_ifbs99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("계좌정보수정에 실패했습니다");
    }

    const data = await res.json();
    console.log("계좌정보수정 결과:", data);
    return data;
  } catch (error) {
    console.error("계좌정보수정 오류:", error);
    throw new Error(`계좌정보수정에 실패했습니다: ${error.message}`);
  }
};

// 계좌 수집 요청
export const requestAccountCollection = async (userData, bankAccountData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/easyfinbank/requestJob`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          BankCode: bankAccountData?.BankCode || "0004",
          AccountNumber: bankAccountData?.AccountNumber || "92380100062281",
          SDate: bankAccountData?.SDate || "20250321",
          EDate: bankAccountData?.EDate || "20250331",
          UserID: userData?.EMPID || "sbs_ifbs99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("계좌 수집 요청에 실패했습니다");
    }

    const data = await res.json();
    console.log("계좌 수집 요청 결과:", data);
    return data;
  } catch (error) {
    console.error("계좌 수집 요청 오류:", error);
    throw new Error(`계좌 수집 요청에 실패했습니다: ${error.message}`);
  }
};


// 계좌 수집내역 확인 
export const checkAccountCollectionHistory = async (userData, jobID) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/easyfinbank/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          JobID: jobID || "025040119000000025",
          TradeType: ["I", "O"],
          Page: 1,
          PerPage: 500,
          Order: "D",
          UserID: userData?.EMPID || "sbs_ifbs99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("계좌 수집내역 확인에 실패했습니다");
    }

    const data = await res.json();
    console.log("계좌 수집내역 확인 결과:", data);
    return data;
  } catch (error) {
    console.error("계좌 수집내역 확인 오류:", error);
    throw new Error(`계좌 수집내역 확인에 실패했습니다: ${error.message}`);
  }
};



// 계좌 목록 조회
export const getAccountList = async (userData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/easyfinbank/listBankAccount`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          UserID: userData?.EMPID || "sbs_ifbs99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("계좌 목록 조회에 실패했습니다");
    }

    const data = await res.json();
    console.log("계좌 목록 조회 결과:", data);
    return data;
  } catch (error) {
    console.error("계좌 목록 조회 오류:", error);
    throw new Error(`계좌 목록 조회에 실패했습니다: ${error.message}`);
  }
};


//카카오톡 채널 목록 
  export const getKakaoChannelList = async (userData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/kakao/listPlusFriendID`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CorpNum: userData?.EMPID || "8218701635",
            UserID: userData?.EMPID || "sbs_ifbs99"
          }),
        }
      );

      if (!res.ok) {
        throw new Error("카카오톡 채널 목록 조회에 실패했습니다");
      }

      const data = await res.json();
      console.log("카카오톡 채널 목록 조회 결과:", data);
      return data;
    } catch (error) {
      console.error("카카오톡 채널 목록 조회 오류:", error);
      throw new Error(`카카오톡 채널 목록 조회에 실패했습니다: ${error.message}`);
    }
  };

// 카카오톡 채널관리 팝업 URL 생성
export const createKakaoChannelPopupURL = async (userData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/kakao/getPlusFriendURL`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "5258103621",
          UserID: userData?.EMPID || "AIBZCOKR"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("카카오톡 채널관리 팝업 URL 생성에 실패했습니다");
    }

    const data = await res.json();
    console.log("카카오톡 채널관리 팝업 URL 생성 결과:", data);
    return data;
  } catch (error) {
    console.error("카카오톡 채널관리 팝업 URL 생성 오류:", error);
    throw new Error(`카카오톡 채널관리 팝업 URL 생성에 실패했습니다: ${error.message}`);
  }
};


// 카카오톡 템플릿 관리 팝업 URL 생성
export const createKakaoTemplatePopupURL = async (userData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/kakao/getTemplateURL`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "5258103621",
          UserID: userData?.EMPID || "AIBZCOKR"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("카카오톡 템플릿 관리 팝업 URL 생성에 실패했습니다");
    }   

    const data = await res.json();
    console.log("카카오톡 템플릿 관리 팝업 URL 생성 결과:", data);
    return data;
  } catch (error) {
    console.error("카카오톡 템플릿 관리 팝업 URL 생성 오류:", error);
    throw new Error(`카카오톡 템플릿 관리 팝업 URL 생성에 실패했습니다: ${error.message}`);
  }
};

// 카카오톡 알림톡 단건 전송
  export const sendKakaoMessage = async (userData, messageData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/kakao/sendATS_one`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CorpNum: "5258103621",
            templateCode: "025050000297",
            Sender:  "01033500564",
            content: messageData.content || `[똑순이] 상사이용신청이 등록되었습니다.

- 상사명 : ${messageData.agentNm}
- 상사코드 : ${messageData.agentRegNo}
- 연락처 : ${userData.UsrTel}
- 조합명 : ${messageData.cmbtCd}
- 신청일시 : ${new Date().toLocaleString()}
`,
            receiver: messageData.receiver || "01033500564"
          }),
        }
      );
  
      if (!res.ok) {
        throw new Error("카카오 메시지 발송에 실패했습니다");
      }
  
      const data = await res.json();
      console.log("카카오 메시지 발송 결과:", data);
      return data;
    } catch (error) {
      console.error("카카오 메시지 발송 오류:", error);
      throw new Error(`카카오 메시지 발송에 실패했습니다: ${error.message}`);
    }
  };
  

// 카카오톡 알림톡 대량 전송 취소
export const cancelKakaoBulkMessage = async (userData, messageData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/kakao/cancelBulkMessage/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData.EMPID || "5258103621",
          templateCode: messageData.templateCode || "019021000000",
          Sender: messageData.Sender || "07012345678",
          altSendType: messageData.altSendType || "A",
          sndDT: messageData.sndDT || "20250101123000",
          msgs: messageData.msgs || [
            {
              receiver: "01012345678",
              receiverName: "홍길동",
              content: "주문하신 #{상품}이 금일 발송 처리되었습니다.",
              altSubject: "대체문자 제목",
              altContent: "주문하신 상품이 발송되었습니다."
            }
          ],
          UserID: userData.EMPID || "AIBZCOKR",
          requestNum: messageData.requestNum || "REQ001",
          btns: messageData.btns || [
            {
              n: "주문 상세",
              t: "WL",
              u1: "https://m.example.com",
              u2: "https://www.example.com"
            }
          ]
        }),
      }
    );

    if (!res.ok) {
      throw new Error("카카오 대량 메시지 취소에 실패했습니다");
    }

    const data = await res.json();
    console.log("카카오 대량 메시지 취소 결과:", data);
    return data;
  } catch (error) {
    console.error("카카오 대량 메시지 취소 오류:", error);
    throw new Error(`카카오 대량 메시지 취소에 실패했습니다: ${error.message}`);
  }
};


// 세금계산서 즉시발행
export const issueTaxInvoice = async (userData, invoiceData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/taxinvoice/registIssue`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData.EMPID || "8218701635",
          Taxinvoice: {
            issueType: invoiceData.issueType || "정발행",
            taxType: invoiceData.taxType || "과세",
            chargeDirection: invoiceData.chargeDirection || "정과금",
            serialNum: invoiceData.serialNum || "SN2025401",
            kwon: invoiceData.kwon || 1,
            ho: invoiceData.ho || 15,
            writeDate: invoiceData.writeDate || "20250401",
            purposeType: invoiceData.purposeType || "영수",
            supplyCostTotal: invoiceData.supplyCostTotal || "150000",
            taxTotal: invoiceData.taxTotal || "15000",
            totalAmount: invoiceData.totalAmount || "165000",
            invoicerMgtKey: invoiceData.invoicerMgtKey || "INV-20250401-002",
            invoicerCorpNum: userData.EMPID || "8218701635",
            invoicerTaxRegID: invoiceData.invoicerTaxRegID || "0001",
            invoicerCorpName: invoiceData.invoicerCorpName || "에이치제이브레인 주식회사",
            invoicerCEOName: invoiceData.invoicerCEOName || "홍길동",
            invoicerAddr: invoiceData.invoicerAddr || "서울특별시 중구 을지로 100",
            invoicerBizType: invoiceData.invoicerBizType || "도소매",
            invoicerBizClass: invoiceData.invoicerBizClass || "컴퓨터, 전자제품",
            invoicerContactName: invoiceData.invoicerContactName || "김담당",
            invoicerDeptName: invoiceData.invoicerDeptName || "영업팀",
            invoicerTEL: invoiceData.invoicerTEL || "02-123-4567",
            invoicerHP: invoiceData.invoicerHP || "010-9999-8888",
            invoicerEmail: invoiceData.invoicerEmail || "ifbs99@naver.com",
            invoicerSMSSendYN: invoiceData.invoicerSMSSendYN || false,
            invoiceeType: invoiceData.invoiceeType || "사업자",
            invoiceeCorpNum: invoiceData.invoiceeCorpNum || "6212074461",
            invoiceeTaxRegID: invoiceData.invoiceeTaxRegID || "0002",
            invoiceeCorpName: invoiceData.invoiceeCorpName || "공급받는자 주식회사",
            invoiceeCEOName: invoiceData.invoiceeCEOName || "손봉수",
            invoiceeAddr: invoiceData.invoiceeAddr || "부산광역시 금정구 장전로12번길 24(장전동)",
            detailList: invoiceData.detailList || [
              {
                serialNum: 1,
                itemName: "노트북",
                qty: "5",
                unitCost: "30000",
                supplyCost: "150000",
                tax: "15000"
              }
            ],
            addContactList: invoiceData.addContactList || [
              {
                serialNum: 1,
                contactName: "손봉수",
                email: "ifbs99@naver.com"
              }
            ],
            businessLicenseYN: invoiceData.businessLicenseYN || false,
            bankBookYN: invoiceData.bankBookYN || false,
            memo: invoiceData.memo || "거래명세서 동봉하였습니다.",
            emailSubject: invoiceData.emailSubject || "세금계산서 발행 안내"
          },
          forceIssue: invoiceData.forceIssue || false,
          memo: invoiceData.memo || "즉시 발행 요청드립니다.",
          UserID: userData.EMPID || "sbs_ifbs99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("세금계산서 즉시발행에 실패했습니다");
    }

    const data = await res.json();
    console.log("세금계산서 즉시발행 결과:", data);
    return data;
  } catch (error) {
    console.error("세금계산서 즉시발행 오류:", error);
    throw new Error(`세금계산서 즉시발행에 실패했습니다: ${error.message}`);
  }
};

// 세금계산서 즉시발행 취소
export const cancelTaxInvoice = async (userData, invoiceData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/taxinvoice/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          KeyType: invoiceData?.KeyType || "SELL",
          MgtKey: invoiceData?.MgtKey || "INV-20250401-001",
          Memo: invoiceData?.Memo || "발행 오류로 취소 요청",
          UserID: userData?.EMPID || "SBS_IFBS99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("세금계산서 발행취소에 실패했습니다");
    }

    const data = await res.json();
    console.log("세금계산서 발행취소 결과:", data);
    return data;
  } catch (error) {
    console.error("세금계산서 발행취소 오류:", error);
    throw new Error(`세금계산서 발행취소에 실패했습니다: ${error.message}`);
  }
};


// 인증서등록 팝업 URL 생성
export const createCertPopupURL = async (userData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/cert/getURL`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          UserID: userData?.EMPID || "sbs_ifbs99",
          TOGO: "CERT"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("인증서등록 팝업 URL 생성에 실패했습니다");
    }

    const data = await res.json();
    console.log("인증서등록 팝업 URL 생성 결과:", data);
    return data;
  } catch (error) {
    console.error("인증서등록 팝업 URL 생성 오류:", error);
    throw new Error(`인증서등록 팝업 URL 생성에 실패했습니다: ${error.message}`);
  }
};

// 세금계산서 인쇄 팝업 URL 생성
export const createTaxInvoicePrintURL = async (userData, invoiceData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/taxinvoice/getPrintURL`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          KeyType: invoiceData?.KeyType || "SELL",
          MgtKey: invoiceData?.MgtKey || "INV-20250401-002",
          UserID: userData?.EMPID || "sbs_ifbs99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("세금계산서 인쇄 팝업 URL 생성에 실패했습니다");
    }

    const data = await res.json();
    console.log("세금계산서 인쇄 팝업 URL 생성 결과:", data);
    return data;
  } catch (error) {
    console.error("세금계산서 인쇄 팝업 URL 생성 오류:", error);
    throw new Error(`세금계산서 인쇄 팝업 URL 생성에 실패했습니다: ${error.message}`);
  }
};


// 연관회원 신규가입
export const registerRelatedCorporation = async (userData, corporationData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/bizinfo/joinMember`,
       {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          JoinForm: {
            ID: corporationData?.ID || "",
            Password: corporationData?.Password || "winesoft!1",
            LinkID: corporationData?.LinkID || "AIBIZCOKR",
            CorpNum: corporationData?.CorpNum || "1448122074",
            CEOName: corporationData?.CEOName || "최승훈",
            CorpName: corporationData?.CorpName || "위넥스소프트(주)",
            Addr: corporationData?.Addr || "사업장 주소",
            BizType: corporationData?.BizType || "서비스",
            BizClass: corporationData?.BizClass || "소트프웨어개발및",
            ContactName: corporationData?.ContactName || "손봉수",
            ContactEmail: corporationData?.ContactEmail || "ifbs99@naver.com",
            ContactTEL: corporationData?.ContactTEL || "01033500564"
          }
        }),
      }
    );

    if (!res.ok) {
      throw new Error("연관회원 신규가입에 실패했습니다");
    }

    const data = await res.json();
    console.log("연관회원 신규가입 결과:", data);
    return data;
  } catch (error) {
    console.error("연관회원 신규가입 오류:", error);
    throw new Error(`연관회원 신규가입에 실패했습니다: ${error.message}`);
  }
};



// 연관회원 탈퇴
export const withdrawRelatedCorporation = async (userData, corporationData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/bizinfo/quitMember`,
       {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            CorpNum: corporationData?.CorpNum || "1448122074",
            QuitReason: corporationData?.QuitReason || "회원 탈퇴 사유",
            UserID: userData?.EMPID || "winesoft99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("연관회원 탈퇴에 실패했습니다");
    }

    const data = await res.json();
    console.log("연관회원 탈퇴 결과:", data);
    return data;
  } catch (error) {
    console.error("연관회원 탈퇴 오류:", error);
    throw new Error(`연관회원 탈퇴에 실패했습니다: ${error.message}`);
  }
};




// 회사 정보 조회
export const getCompanyInfo = async (userData, corporationData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/bizinfo/getInfo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          UserID: userData?.EMPID || "sbs_ifbs99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("회사 정보 조회에 실패했습니다");
    }

    const data = await res.json();
    console.log("회사 정보 조회 결과:", data);
    return data;
  } catch (error) {
    console.error("회사 정보 조회 오류:", error);
    throw new Error(`회사 정보 조회에 실패했습니다: ${error.message}`);
  }
};


// Fax 발신번호 등록여부 확인   
export const checkFaxSenderNumber = async (userData, faxData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/faxService/checkSenderNumber`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          SenderNumber: faxData?.SenderNumber || "0318313880",
          UserID: userData?.EMPID || "sbs_ifbs99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Fax 발신번호 등록여부 확인에 실패했습니다");
    }

    const data = await res.json();
    console.log("Fax 발신번호 등록여부 확인 결과:", data);
    return data;
  } catch (error) {
    console.error("Fax 발신번호 등록여부 확인 오류:", error);
    throw new Error(`Fax 발신번호 등록여부 확인에 실패했습니다: ${error.message}`);
  }
};


// Fax 발신번호 관리 팝업 URL
export const createFaxSenderNumberPopupURL = async (userData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/faxService/getSenderNumberMgtURL`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          UserID: userData?.EMPID || "sbs_ifbs99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Fax 발신번호 관리 팝업 URL 생성에 실패했습니다");
    }

    const data = await res.json();
    console.log("Fax 발신번호 관리 팝업 URL 생성 결과:", data);
    return data;
  } catch (error) {
    console.error("Fax 발신번호 관리 팝업 URL 생성 오류:", error);
    throw new Error(`Fax 발신번호 관리 팝업 URL 생성에 실패했습니다: ${error.message}`);
  }
};


// Fax 발신번호 목록 확인
export const getFaxSenderNumberList = async (userData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/faxService/getSenderNumberList`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({      
          CorpNum: userData?.EMPID || "8218701635",
          UserID: userData?.EMPID || "sbs_ifbs99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Fax 발신번호 목록 확인에 실패했습니다");
    }

    const data = await res.json();
    console.log("Fax 발신번호 목록 확인 결과:", data);
    return data;
  } catch (error) {
    console.error("Fax 발신번호 목록 확인 오류:", error);
    throw new Error(`Fax 발신번호 목록 확인에 실패했습니다: ${error.message}`);
  }
};


// Fax 전송 
export const sendFax = async (userData, faxData) => { 
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/faxService/sendFax`,
      {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          Sender: faxData.Sender,
          Receiver: faxData.Receiver,
          ReceiverName: faxData.ReceiverName,
          FilePaths: faxData.FilePaths,
          SenderName: faxData.SenderName,
          AdsYN: faxData.AdsYN,
          Title: faxData.Title,
          RequestNum: faxData.RequestNum,
          UserID: userData?.EMPID || "sbs_ifbs99"
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Fax 전송에 실패했습니다");
    }

    const data = await res.json();
    console.log("Fax 전송 결과:", data);
    return data;
  } catch (error) {
    console.error("Fax 전송 오류:", error);
    throw new Error(`Fax 전송에 실패했습니다: ${error.message}`);
  }
};


// Fax 전송 (동보전송)
export const sendFaxBulk = async (userData, faxData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/faxService/sendFaxBulk`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          SendNum: faxData.Sender,
          SenderName: faxData.SenderName,
          Receivers: faxData.Receivers,
          FilePaths: faxData.FilePaths,
          ReserveDT: faxData.ReserveDT,
          UserID: userData?.EMPID || "sbs_ifbs99",
          AdsYN: faxData.AdsYN,
          Title: faxData.Title,
          RequestNum: faxData.RequestNum
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Fax 동보전송에 실패했습니다");
    }

    const data = await res.json();
    console.log("Fax 동보전송 결과:", data);
    return data;
  } catch (error) {
    console.error("Fax 동보전송 오류:", error);
    throw new Error(`Fax 동보전송에 실패했습니다: ${error.message}`);
  }
};


// Fax 재전송 (접수번호)
export const resendFax = async (userData, faxData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/popbill/v1/faxService/resendFax`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorpNum: userData?.EMPID || "8218701635",
          ReceiptNum: faxData.ReceiptNum,
          UserID: userData?.EMPID || "sbs_ifbs99" 
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Fax 재전송에 실패했습니다");
    }

    const data = await res.json();
    console.log("Fax 재전송 결과:", data);
    return data;
  } catch (error) {
    console.error("Fax 재전송 오류:", error);
    throw new Error(`Fax 재전송에 실패했습니다: ${error.message}`);
  }
};


