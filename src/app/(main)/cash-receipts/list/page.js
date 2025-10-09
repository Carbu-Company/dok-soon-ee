import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import ListPage from "@/app/(main)/cash-receipts/list/ListPage";
import { getCarCashList, getCarCashSummary } from "./api";
import { getDealerList, getCDList } from "@/app/(main)/common/api";

// Server Action 정의
async function searchCarCashList(searchParamsWithPage) {
  "use server";

  try {
    const result = await getCarCashList(searchParamsWithPage);

    console.log('서버 액션 결과*******************:', { 
      carCashListLength: result?.data?.carlist?.length, 
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
async function searchCarCashSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getCarCashSummary(searchParamsWithPage);

    return result;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}


// Server Action 정의
async function searchCarCashListAndSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const [listResult, summaryResult] = await Promise.all([
      getCarCashList(searchParamsWithPage),
      getCarCashSummary(searchParamsWithPage)
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

export default async function CarCashList() {
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
    dtlCustomerName: '',
    dtlSaleItem: '',
    dtlMemo: '',
    dtlTradeProcNm: '',
    dtlTradeSctGubun: '',
    dtlCrStat: [],
    dtlRcgnNo: '',
    dtlNtsConfNo: '',
    orderItem: '01',        // 거래발생일일
    ordAscDesc: 'desc'
  };

  const carCashList = await searchCarCashList({ ...defaultParams, ...searchParams });
  const dealerList = await getDealerList(session.agentId);
  const saleItemList = await getCDList('21');   // 매출품명목록
  const crStatList = await getCDList('22');   // 현금영수증 전송 상태 목록 
  const carCashSummary = await searchCarCashSummary({ ...defaultParams, ...searchParams });

  return <ListPage session={session}
                   carList={carCashList}
                   dealerList={dealerList.data}
                   saleItemList={saleItemList.data}
                   crStatList={crStatList.data}
                   searchAction={searchCarCashListAndSummary}
                   carSummary={carCashSummary}
   />;
}