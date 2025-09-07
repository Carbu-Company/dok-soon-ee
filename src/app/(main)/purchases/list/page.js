import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import ListPage from "@/app/(main)/purchases/list/ListPage";
import { getPurchasesListNew, getDealerList } from "./api";

// Server Action 정의
async function searchPurchasesList(searchParamsWithPage) {
  "use server";
  
  try {
    console.log('서버 액션 호출됨:', searchParamsWithPage);

    const result = await getPurchasesListNew(searchParamsWithPage);

    console.log('서버 액션 결과:', { 
      dataLength: result?.length, 
      page: searchParamsWithPage.page,
      pageSize: searchParamsWithPage.pageSize 
    });

    return { success: true, data: result };
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
    ordAscDesc: 'desc', 
    listCount: 10, 
  };


  const purchasesList = await searchPurchasesList({ ...defaultParams, ...searchParams });
  const dealerList = await getDealerList(session.agentId);

  console.log(purchasesList.data);
  //console.log(dealerList.data);

  return <ListPage session={session}
                   carList={purchasesList.data}
                   dealerList={dealerList.data}
                   page={1}
                   pageSize={10}
                   searchAction={searchPurchasesList}

   />;
}