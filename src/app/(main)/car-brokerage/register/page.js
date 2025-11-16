import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import RegPage from "@/app/(main)/car-brokerage/register/RegPage";
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
  agentBrno : 상사 사업자번호
  empBrno : 사원 사업자번호
  } 
  */  

  //console.log(session.agentId);
  const dealerList = await getDealerList(session.agentId);
  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록
  const tradeItemCDList = await getCDList('23');   // 알선거래항목
  const parkingLocationList = await getCDList('91');   // 주차위치 코드 목록
  const carKndList = await getCDList('92');   // 차량 종류 코드 목록

  return <RegPage session={session}
                   dealerList={dealerList.data}
                   evdcCdList={evdcCDList.data}
                   tradeItemCDList={tradeItemCDList.data}
                   carKndList={carKndList.data}
   />;
}
