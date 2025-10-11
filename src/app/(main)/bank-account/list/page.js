import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import ListPage from "@/app/(main)/bank-account/list/ListPage";
import { getCarAcctList, getCarAcctSummary, getAgentAcctList } from "./api";
import { getDealerList, getCDList } from "@/app/(main)/common/api";

// Server Action 정의
async function searchCarAcctList(searchParamsWithPage) {
  "use server";

  try {
    const result = await getCarAcctList(searchParamsWithPage);

    console.log('서버 액션 결과*******************:', { 
      carAcctListLength: result?.data?.carAcctList?.length, 
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
async function searchCarAcctSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getCarAcctSummary(searchParamsWithPage);

    return result;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}


// Server Action 정의
async function searchCarAcctListAndSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const [listResult, summaryResult] = await Promise.all([
      getCarAcctList(searchParamsWithPage),
      getCarAcctSummary(searchParamsWithPage)
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

export default async function CarAcctList() {
  /* 쿠키에서 세션 정보 가져오기
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
    carAgent: session.agentId,
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
    dtlCarNm: '',
    dtlTradeSctNm: '',
    dtlTradeItemCd: '',
    dtlAgentAcct: '',
    dtlTradeMemo: '',
    dtlDtlMemo: '',
    orderItem: '01', 
    ordAscDesc: 'desc'
  };

  const carAcctList = await searchCarAcctList({ ...defaultParams, ...searchParams });
  const dealerList = await getDealerList(session.agentId);
  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록
  const tradeInItemCDList = await getCDList('80');   // 거래항목 코드 목록
  const tradeOutItemCDList = await getCDList('81');   // 거래항목 코드 목록
  const agentAcctList = await getAgentAcctList(session.agentId);
  const carAcctSummary = await searchCarAcctSummary({ ...defaultParams, ...searchParams });

  return <ListPage session={session}
                   carList={carAcctList}
                   dealerList={dealerList.data}
                   evdcCdList={evdcCDList.data}
                   tradeInItemCDList={tradeInItemCDList.data}
                   tradeOutItemCDList={tradeOutItemCDList.data}
                   agentAcctList={agentAcctList.data}
                   searchAction={searchCarAcctListAndSummary}
                   carSummary={carAcctSummary}
   />;
}