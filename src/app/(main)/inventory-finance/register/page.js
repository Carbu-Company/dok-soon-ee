import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import RegPage from "@/app/(main)/inventory-finance/register/RegPage";
import { getCarPurInfo } from "./api";
import { getDealerList } from "@/app/(main)/common/api";
import { getCarLoanCorpList } from "@/app/(main)/api/carApi";

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

  // searchParams를 await로 처리
  const resolvedSearchParams = await searchParams;

  // Server Action 정의
  async function getCarPurInfo(carRegId) {
    "use server";
    
    try {
      const purInfo = await getSuggestOne(carRegId);

      console.log('서버 액션 결과*******************:getSuggestOne' + purInfo);

      return {
        success: purInfo.success,
        data: {
          purInfo: purInfo
        },
        error: purInfo.error
      };

    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      return { success: false, error: error.message };
    }
  }
  
  // URL 파라미터에서 carId를 확인하여 차량 정보 조회
  let carPurDetail = null;
  if (resolvedSearchParams?.carRegId) {
    carPurDetail = await getCarPurInfo(resolvedSearchParams.carRegId).catch(error => {
      console.error('차량 정보 조회 실패:', error);
      return null; // 에러 발생 시 null 반환
    });
  }

  // 테스트를 위해 차량 정보를 null로 설정 (모달이 항상 열리도록)
  // carPurDetail = null;

  const dealerList = await getDealerList(session.agentId);
  const loanCompList = await getCarLoanCorpList(session.agentId);

  return <RegPage session={session}
                  carPurDetail={carPurDetail} 
                  dealerList={dealerList.data}
                  loanCompList={loanCompList.data}
   />;
}
