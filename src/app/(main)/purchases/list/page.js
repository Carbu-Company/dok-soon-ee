import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import ListPage from "@/app/(main)/purchases/list/ListPage";
import { getCarPurList, getCarPurSummary } from "./api";
import { getCDList } from "@/app/(main)/common/api";
import { getDealerList } from "@/app/(main)/api/carApi";
// Server Action 정의
async function searchCarPurList(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getCarPurList(searchParamsWithPage);

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
async function searchCarPurSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getCarPurSummary(searchParamsWithPage);

    //console.log('서버 액션 결과*******************:searchCarPurSummary');

    return result;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}


// Server Action 정의
async function searchCarPurListAndSummary(searchParamsWithPage) {
  "use server";
  
  try {
    const [listResult, summaryResult] = await Promise.all([
      getCarPurList(searchParamsWithPage),
      getCarPurSummary(searchParamsWithPage)
    ]);

    console.log('서버 액션 결과*******************:searchCarPurListAndSummary');

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

export default async function CarPurList() {
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
  const sessionToken = cookieStore.get("session")?.value;
  
  // 세션 토큰이 없거나 유효하지 않은 경우 로그인 페이지로 리다이렉트
  if (!sessionToken) {
    redirect('/login');
  }

  let session;
  try {
    session = await verifySession(sessionToken);
  } catch (error) {
    console.error('세션 검증 실패:', error);
    redirect('/login');
  }

  // 세션이 유효하지 않은 경우 로그인 페이지로 리다이렉트
  if (!session || !session.agentId) {
    redirect('/login');
  }

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

  const carPurList = await searchCarPurList({ ...defaultParams, ...searchParams });
  const dealerList = await getDealerList(session.agentId);
  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록
  const carPurSummary = await searchCarPurSummary({ ...defaultParams, ...searchParams });

  console.log('carPurSummary*******************:', carPurSummary);

  return <ListPage session={session}
                   carList={carPurList}
                   dealerList={dealerList.data}
                   evdcCdList={evdcCDList.data}
                   searchAction={searchCarPurListAndSummary}
                   carSummary={carPurSummary}
   />;
}