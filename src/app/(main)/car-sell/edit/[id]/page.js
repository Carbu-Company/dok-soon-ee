import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import EditPage from "@/app/(main)/car-sell/edit/[id]/EditPage";
import { getSuggestOne, getCarSelInfo } from "./api";
import { getDealerList, getCDList } from "@/app/(main)/common/api";

export default async function EditorPage({ params }) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get("session")?.value).catch(console.error);

  const { id } = await params;

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
  const carPurDetail = await getSuggestOne(id);
  const carSelDetail = await getCarSelInfo(id);

  console.log('carPurDetail:', carPurDetail);

  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록
  const parkingLocationList = await getCDList('91');   // 주차위치 코드 목록
  const carKndList = await getCDList('92');   // 차량 종류 코드 목록

  const dealerList = await getDealerList(session.agentId);
  const sellTpList = await getCDList('03');   // 판매유형 목록

  //console.log(sellTpList.data);

  return <EditPage session={session}
                  dealerList={dealerList.data}
                  carKndList={carKndList.data}
                  evdcCdList={evdcCDList.data}
                  parkingLocationList={parkingLocationList.data}
                  sellTpList={sellTpList.data}
                  carPurDetail={carPurDetail}
                  carSelDetail={carSelDetail.carSelInfo}
                  carSelFileList={carSelDetail.fileList}
                  carSelCustList={carSelDetail.custList}
   />;
}
