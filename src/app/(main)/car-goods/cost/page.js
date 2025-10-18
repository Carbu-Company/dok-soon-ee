import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import ListPage from "@/app/(main)/car-goods/cost/ListPage";
import { getGoodsFeeList, getGoodsFeeCarSummary } from "./api";
import { getDealerList, getCDList } from "@/app/(main)/common/api";

// Server Action 정의
async function searchGoodsFeeList(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getGoodsFeeList(searchParamsWithPage);

    console.log('서버 액션 결과*******************:', { 
      goodsFeeListLength: result?.data?.carlist?.length, 
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
async function searchGoodsFeeCarSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getGoodsFeeCarSummary(searchParamsWithPage);

    return result;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}


// Server Action 정의
async function searchGoodsFeeListAndSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const [listResult, summaryResult] = await Promise.all([
      getGoodsFeeList(searchParamsWithPage),
      getGoodsFeeCarSummary(searchParamsWithPage)
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

export default async function CarSelList() {
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
    dtlOldCarNo: '',
    dtlNewCarNo: '',
    dtlExpdItem: '',
    dtlTaxGubun: '',
    dtlExpdGubun: '',
    dtlExpdEvdc: '',
    dtlRmrk: '',
    dtlAdjInclusYN: '',
    orderItem: '제시일', 
    ordAscDesc: 'desc'
  };

  const goodsFeeList = await searchGoodsFeeList({ ...defaultParams, ...searchParams });
  const dealerList = await getDealerList(session.agentId);
  const expdItemList = await getCDList('08');   // 지출 항목 코드목록
  const expdEvdcList = await getCDList('07');   // 지출 증빙 코드목록
  const goodsFeeCarSummary = await searchGoodsFeeCarSummary({ ...defaultParams, ...searchParams });

  console.log(goodsFeeList.data.carlist);


  return <ListPage session={session}
                   carList={goodsFeeList}
                   dealerList={dealerList.data}
                   expdItemList={expdItemList.data}
                   expdEvdcList={expdEvdcList.data}
                   searchAction={searchGoodsFeeListAndSummary}
                   carSummary={goodsFeeCarSummary}
   />;
}