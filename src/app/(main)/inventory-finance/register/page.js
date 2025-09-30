import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import RegPage from "@/app/(main)/inventory-finance/register/RegPage";
import { getSuggestOne } from "./api";
import { getDealerList, getCDList } from "@/app/(main)/common/api";

export default async function RegisterPage({ searchParams }) {
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

  
  // searchParams를 await로 처리
  const resolvedSearchParams = await searchParams;
  
  // URL 파라미터에서 carId를 확인하여 차량 정보 조회
  let carPurDetail = null;
  if (resolvedSearchParams?.carId) {
    carPurDetail = await getSuggestOne(resolvedSearchParams.carId).catch(error => {
      console.error('매입차량 정보 조회 실패:', error);
      return null; // 에러 발생 시 null 반환
    });
  }

  // 테스트를 위해 차량 정보를 null로 설정 (모달이 항상 열리도록)
  carPurDetail = null;

  const dealerList = await getDealerList(session.agentId);
  const loanCompList = await getCDList('05');   // 대출회사 코드 목록

  return <RegPage session={session}
                   dealerList={dealerList.data}
                   loanCompList={loanCompList.data}

   />;
}
