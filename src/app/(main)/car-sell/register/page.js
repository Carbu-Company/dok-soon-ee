import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import RegPage from "@/app/(main)/car-sell/register/RegPage";
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

  // 테스트를 위해 차량 정보를 null로 설정 (모달이 항상 열리도록)
  const carPurInfo = null;

  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록
  const parkingLocationList = await getCDList('91');   // 주차위치 코드 목록
  const carKndList = await getCDList('92');   // 차량 종류 코드 목록

  const dealerList = await getDealerList(session.agentId);
  const sellTpList = await getCDList('03');   // 판매유형 목록

  //console.log(sellTpList.data);

  return <RegPage session={session}
                  dealerList={dealerList.data}
                  carKndList={carKndList.data}
                  evdcCdList={evdcCDList.data}
                  parkingLocationList={parkingLocationList.data}
                  sellTpList={sellTpList.data}
                  carPurInfo={carPurInfo}
                  searchAction={getCarPurInfo}
  />;
}
