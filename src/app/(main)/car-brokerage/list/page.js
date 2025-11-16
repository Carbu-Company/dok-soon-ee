import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import ListPage from "@/app/(main)/car-brokerage/list/ListPage";
import { getCarBrkTradeList, getCarBrkTradeSummary } from "./api";
import { getDealerList, getCDList } from "@/app/(main)/common/api";

// Server Action 정의
async function searchCarBrkTradeList(searchParamsWithPage) {
  "use server";
  try {
    const result = await getCarBrkTradeList(searchParamsWithPage);

    console.log('서버 액션 결과*******************:', { 
      carBrkTradeListLength: result?.data?.carlist?.length, 
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
async function searchCarBrkTradeSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getCarBrkTradeSummary(searchParamsWithPage);

    return result;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}


// Server Action 정의
async function searchCarBrkTradeListAndSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const [listResult, summaryResult] = await Promise.all([
      getCarBrkTradeList(searchParamsWithPage),
      getCarBrkTradeSummary(searchParamsWithPage)
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

export default async function CarBrkTradeList() {
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
    dtlBrkTradeItemCd: '',
    dtlBrkAgentNm: '',
    dtlCarNm: '',
    dtlCustNm: '',
    dtlEvdcGubun: '',
    dtlBrkMemo: '',
    orderItem: '01', 
    ordAscDesc: 'desc'
  };

  const carBrkTradeList = await searchCarBrkTradeList({ ...defaultParams, ...searchParams });
  const dealerList = await getDealerList(session.agentId);
  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록
  const carBrkTradeSummary = await searchCarBrkTradeSummary({ ...defaultParams, ...searchParams });


  console.log('carBrkTradeList*******************:', carBrkTradeList);

  return <ListPage session={session}
                   carList={carBrkTradeList}
                   dealerList={dealerList.data}
                   evdcCdList={evdcCDList.data}
                   searchAction={searchCarBrkTradeListAndSummary}
                   carSummary={carBrkTradeSummary}
   />;
}