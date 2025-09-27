import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import RegPage from "@/app/(main)/car-goods/register/RegPage";
import { getSuggestOne } from "./api";
import { getDealerList, getCDList } from "@/app/(main)/common/api";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get("session")?.value).catch(console.error);

  /* 쿠키에서 세션 정보 가져오기
  {
  usrId: '005110001',
  agentId: '00002',
  usrNm: '김규식',
  iat: 1756640299,
  exp: 1757245099
  } 
  */  

  //console.log(session.agentId);
  
  const carPurDetail = await getSuggestOne('0001120250910010').catch(error => {
    console.error('매입차량 정보 조회 실패:', error);
    return null; // 에러 발생 시 null 반환
  });



  const dealerList = await getDealerList(session.agentId);
  const expdCdList = await getCDList('08');   // 상품화비 지출 항목 코드 목록

  return <RegPage session={session}
                  carPurDetail={carPurDetail}
                  dealerList={dealerList.data}
                  expdCdList={expdCdList.data}
   />;
}
