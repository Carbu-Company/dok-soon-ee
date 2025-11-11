import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import RegPage from "@/app/(main)/car-sell/register/RegPage";
import { getCarPurInfo, getAgentTradeItemInfo } from "./api";
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

  // searchParams를 await로 처리
  const resolvedSearchParams = await searchParams;

  // Server Action 정의
  async function searchCarPurInfo(carRegId) {
    "use server";
    
    try {
      const purInfo = await getCarPurInfo(carRegId);

      const agentTradeItemInfo = await getAgentTradeItemInfo(session.agentId);


      console.log('agentTradeItemInfo:********************', agentTradeItemInfo);

      return {
        success: purInfo.success,
        data: {
          purInfo: purInfo,
          agentTradeItemInfo: agentTradeItemInfo
        },
        error: purInfo.error
      };

    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      return { success: false, error: error.message };
    }
  }

  // URL 파라미터에서 carRegId를 확인하여 차량 정보 조회
  let carPurInfo = null;
  let agentTradeItemInfo = null;
  if (resolvedSearchParams?.carRegId) {
    console.log('URL에서 carRegId 발견:', resolvedSearchParams.carRegId);
    carPurInfo = await getCarPurInfo(resolvedSearchParams.carRegId).catch(error => {
      console.error('차량 정보 조회 실패:', error);
      return null; // 에러 발생 시 null 반환
    });

    agentTradeItemInfo = await getAgentTradeItemInfo(session.agentId).catch(error => {
      console.error('상사 매입비 정보 조회 실패:', error);
      return null; // 에러 발생 시 null 반환
    });

    console.log('agentTradeItemInfo:********************', agentTradeItemInfo);
  }

  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록
  const parkingLocationList = await getCDList('91');   // 주차위치 코드 목록
  const carKndList = await getCDList('92');   // 차량 종류 코드 목록

  const dealerList = await getDealerList(session.agentId);

  /**
   * 판매딜러에는 타상사딜러 항목 추가
   */
  const saleDealerList = dealerList.data.map(dealer => ({
    USR_ID: dealer.USR_ID,
    USR_NM: dealer.USR_NM
  }));
  saleDealerList.push({
    USR_ID: '000000000',
    USR_NM: '타상사딜러'
  });

  const sellTpList = await getCDList('03');   // 판매유형 목록

  //console.log(sellTpList.data);

  return <RegPage session={session}
                  dealerList={dealerList.data}
                  saleDealerList={saleDealerList}
                  carKndList={carKndList.data}
                  evdcCdList={evdcCDList.data}
                  parkingLocationList={parkingLocationList.data}
                  sellTpList={sellTpList.data}
                  carPurInfo={carPurInfo}
                  agentTradeItemInfo={agentTradeItemInfo}
                  searchAction={searchCarPurInfo}
  />;
}
