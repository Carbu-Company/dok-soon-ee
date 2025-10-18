import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import RegPage from "@/app/(main)/cash-receipts/register/RegPage";
import { getDealerList, getCDList } from "@/app/(main)/common/api";
import { getCarCashList } from "@/app/(main)/cash-receipts/list/api";

// Server Action 정의
async function searchCarCashList(searchParamsWithPage) {
  "use server";

  try {
    const result = await getCarCashList(searchParamsWithPage);
    return result;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
}

export default async function CashReceiptRegister() {
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

  // 딜러 목록 가져오기
  const dealerList = await getDealerList(session.agentId);
  
  // 현금영수증 관련 코드 목록 가져오기
  const saleItemList = await getCDList('21');   // 매출품명목록
  const crStatList = await getCDList('22');     // 현금영수증 전송 상태 목록
  const crTypeList = await getCDList('23');     // 현금영수증 유형 목록
  const crTradeTypeList = await getCDList('24'); // 현금영수증 거래유형 목록

  // 기본 파라미터로 발행대기 목록 조회
  const defaultParams = {
    agentId: session.agentId,
    page: 1,
    pageSize: 10
  };

  const carCashList = await searchCarCashList(defaultParams);

  return (
    <RegPage 
      session={session}
      dealerList={dealerList.data || []}
      saleItemList={saleItemList.data || []}
      crStatList={crStatList.data || []}
      crTypeList={crTypeList.data || []}
      crTradeTypeList={crTradeTypeList.data || []}
      carList={carCashList?.data?.carlist || []}
      pagination={carCashList?.data?.pagination || {}}
      searchAction={searchCarCashList}
    />
  );
}
