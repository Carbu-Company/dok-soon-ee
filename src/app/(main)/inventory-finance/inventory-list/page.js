import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import ListPage from "@/app/(main)/inventory-finance/inventory-list/ListPage";
import { getCarLoanCarSumList, getCarLoanSummary } from "./api";
import { getDealerList, getCDList } from "@/app/(main)/common/api";

// Server Action 정의
async function searchCarLoanCarSumList(searchParamsWithPage) {
  "use server";

  try {
    const result = await getCarLoanCarSumList(searchParamsWithPage);

    console.log('서버 액션 결과*******************:', { 
      carLoanCarSumListLength: result?.data?.loanList?.length, 
      totalCount: result?.data?.pagination?.totalCount,
      page: searchParamsWithPage.page,
      pageSize: searchParamsWithPage.pageSize 
    });

    return result;
  } catch (error) {
    console.error('getCarLoanCarSumList 검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}


// Server Action 정의
async function searchCarLoanSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getCarLoanSummary(searchParamsWithPage);

    console.log('서버 액션 결과*******************:', { 
      carLoanSummaryLength: result?.data?.length
    });


    return result;
  } catch (error) {
    console.error('searchCarLoanSummary 검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}


// Server Action 정의
async function searchCarLoanCarSumListAndSummary(searchParamsWithPage) {
  "use server";
  
  try {


    console.log('searchParamsWithPage*******************:', searchParamsWithPage);




    const [listResult, summaryResult] = await Promise.all([
      getCarLoanCarSumList(searchParamsWithPage),
      getCarLoanSummary(searchParamsWithPage)
    ]);

    console.log('***서버 액션 결과*******************:', { 
      carLoanCarSumListLength: listResult?.data?.loanList?.length,
      carLoanSummaryLength: summaryResult?.data?.length
    });

    return {
      success: listResult.success && summaryResult.success,
      data: {
        list: listResult.data,
        summary: summaryResult.data
      },
      error: listResult.error || summaryResult.error
    };
  } catch (error) {
    console.error('searchCarLoanCarSumListAndSummary 검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}

export default async function CarLoanCarSumList() {
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
    dtlLoanSctGubun: '',
    dtlLoanStatGubun: '',
    orderItem: '제시일', 
    ordAscDesc: 'desc'
  };

  const carLoanCarSumList = await searchCarLoanCarSumList({ ...defaultParams, ...searchParams });
  const dealerList = await getDealerList(session.agentId);
  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록
  const carLoanSummary = await searchCarLoanSummary({ ...defaultParams, ...searchParams });
  

  //console.log('carLoanSummary*******************:', carLoanSummary);

  return <ListPage session={session}
                   carList={carLoanCarSumList}
                   dealerList={dealerList.data}
                   evdcCdList={evdcCDList.data}
                   searchAction={searchCarLoanCarSumListAndSummary}
                   carSummary={carLoanSummary}
   />;
}