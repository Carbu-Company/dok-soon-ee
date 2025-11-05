import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import RegPage from "@/app/(main)/cash-receipts/register/RegPage";
import { getDealerList, getCDList } from "@/app/(main)/common/api";
import { getTradeIssueList, getTradeIssueSummary } from "@/app/(main)/cash-receipts/register/api";

// Server Action 정의
async function searchTradeIssueList(searchParamsWithPage) {
  "use server";

  try {
    const result = await getTradeIssueList(searchParamsWithPage);

    console.log('서버 액션 결과*******************:', { 
      TAX_TRADE_ISSUE_LIST_LENGTH: result?.data?.carlist?.length, 
      totalCount: result?.data?.pagination?.totalCount,
      page: searchParamsWithPage.page,
      pageSize: searchParamsWithPage.pageSize 
    });

    return result;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}


// Server Action 정의
async function searchTradeIssueSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getTradeIssueSummary(searchParamsWithPage);

    return result;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}


// Server Action 정의
async function searchTradeIssueListAndSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const [listResult, summaryResult] = await Promise.all([
      getTradeIssueList(searchParamsWithPage),
      getTradeIssueSummary(searchParamsWithPage)
    ]);

    return {
      success: listResult.success && summaryResult.success,
      data: {
        list: listResult.data,
        summary: summaryResult.data
      },
      error: listResult.error || summaryResult.error
    };
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}

export default async function CashReceiptRegister() {
  /* 쿠키에서 세션 정보 가져오기
  {
  usrId: '005110001',
  agentId: '00002',
  usrNm: '김규식',
  iat: 1756640299,
  exp: 1757245099
  } 
  *//* 쿠키에서 세션 정보 가져오기
  {
  usrId: '005110001',
  agentId: '00002',
  usrNm: '김규식',
  iat: 1756640299,
  exp: 1757245099
  } 
  */
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get("session")?.value).catch(console.error);

  // 기본 파라미터
  const defaultParams = {
    agentId: session.agentId,
    page: 1,
    pageSize: 10
  };

  // 검색 파라미터
  const searchParams = {
    carNo: '',  
    dealer: '',  
    dtGubun: '',  
    startDt: '',  
    endDt: '',  
    dtlNewCarNo: '',
    dtlOldCarNo: '',
    dtlCustomerName: '',
    dtlSaleItem: '',
    dtlMemo: '',
    dtlTradeProcNm: '',
    dtlTradeSctGubun: '',
    dtlCrStat: [],
    dtlRcgnNo: '',
    dtlNtsConfNo: '',
    orderItem: '01',        // 거래발생일일
    ordAscDesc: 'desc',
    taxGubun: '004'      // 004: 현금영수증, 001: 전자세금계산서
  };

  const tradeIssueList = await searchTradeIssueList({ ...defaultParams, ...searchParams });
  const dealerList = await getDealerList(session.agentId);
  const saleItemList = await getCDList('21');   // 매출품명목록
  const crStatList = await getCDList('22');   // 현금영수증 전송 상태 목록 
  const tradeIssueSummary = await searchTradeIssueSummary({ ...defaultParams, ...searchParams });

  return (
    <RegPage 
      session={session}
      carList={tradeIssueList.data?.carlist || []}
      dealerList={dealerList.data || []}
      saleItemList={saleItemList.data || []}
      crStatList={crStatList.data || []}
      pagination={tradeIssueList.data?.pagination || {}}
      searchAction={searchTradeIssueList}
    />
  );
}
