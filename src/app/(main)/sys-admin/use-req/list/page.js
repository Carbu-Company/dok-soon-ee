import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import ListPage from "@/app/(main)/sys-admin/use-req/list/ListPage";
import { getAdminAgentList } from "./api";
import { getCDList } from "@/app/(main)/common/api";
// Server Action 정의
async function searchAgentList(searchParamsWithPage) {
  "use server";
  
  try {
    const result = await getAdminAgentList(searchParamsWithPage);

    console.log('서버 액션 결과*******************:', {     
      agentListLength: result?.data?.agentlist?.length, 
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

export default async function AgentList() {
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
    agentNm: '',  
    combCd: '',     // 조합코드
    dtGubun: '',  
    startDt: '',  
    endDt: '',  
  };

  const agentList = await searchAgentList({ ...defaultParams, ...searchParams });





  console.log('agentList*******************:', agentList);
  const combCdList = await getCDList('31');   // 조합코드 목록

  return <ListPage session={session}
                   combCdList={combCdList.data}
                   agentList={agentList}
                   searchAction={searchAgentList}
   />;
}