import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import ListPage from "@/app/(main)/purchases/list/ListPage";
import { getPurchasesListNew, getPurchasesSummary } from "./api";
import { getDealerList, getCDList } from "@/app/(main)/common/api";

// Server Action 정의
async function searchPurchasesList(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getPurchasesListNew(searchParamsWithPage);

    console.log('서버 액션 결과*******************:', { 
      carlistLength: result?.data?.carlist?.length, 
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
async function searchPurchasesSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getPurchasesSummary(searchParamsWithPage);

    return result;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}

export default async function Purchases() {
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
    dtlCustomerName: '', 
    dtlCustGubun: '', 
    dtlEvdcGubun: '', 
    dtlPrsnGubun: '', 
    dtlOwnerBrno: '', 
    dtlOwnerSsn: '', 
    dtlCtshNo: '' , 
    dtlCarNoBefore: '', 
    orderItem: '제시일', 
    ordAscDesc: 'desc'
  };

  const purchasesList = await searchPurchasesList({ ...defaultParams, ...searchParams });

  const dealerList = await getDealerList(session.agentId);
  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록
  const purchasesSummary = await searchPurchasesSummary({ ...defaultParams, ...searchParams });

  return <ListPage session={session}
                   carList={purchasesList}
                   dealerList={dealerList.data}
                   evdcCdList={evdcCDList.data}
                   searchAction={searchPurchasesList}
                   purchasesSummary={purchasesSummary}
   />;
}