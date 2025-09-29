import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import ListPage from "@/app/(main)/inventory-finance/interest-list/ListPage";
import { getCarLoanList, getCarLoanSummary } from "./api";
import { getDealerList, getCDList } from "@/app/(main)/common/api";

// Server Action 정의
async function searchCarLoanList(searchParamsWithPage) {
  "use server";

  try {
    const result = await getCarLoanList(searchParamsWithPage);

    console.log('서버 액션 결과*******************:', { 
      carCashListLength: result?.data?.carCashList?.length, 
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
async function searchCarLoanSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getCarLoanSummary(searchParamsWithPage);

    return result;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}


// Server Action 정의
async function searchCarLoanListAndSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const [listResult, summaryResult] = await Promise.all([
      getCarLoanList(searchParamsWithPage),
      getCarLoanSummary(searchParamsWithPage)
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

export default async function CarLoanList() {
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
    dtlNewCarNo: '',
    dtlOldCarNo: '',
    dtlCapital: '',
    dtlLoanMemo: '',
    orderItem: '제시일', 
    ordAscDesc: 'desc'
  };

  const carLoanList = await searchCarLoanList({ ...defaultParams, ...searchParams });
  const dealerList = await getDealerList(session.agentId);
  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록
  const carLoanSummary = await searchCarLoanSummary({ ...defaultParams, ...searchParams });

  return <ListPage session={session}
                   carList={carLoanList}
                   dealerList={dealerList.data}
                   evdcCdList={evdcCDList.data}
                   searchAction={searchCarLoanListAndSummary}
                   carSummary={carLoanSummary}
   />;
}