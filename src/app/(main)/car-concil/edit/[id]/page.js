import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import EditPage from "@/app/(main)/car-concil/edit/[id]/EditPage";
import { getDealerList, getCDList } from "@/app/(main)/common/api";
import { getCarConcilDetail } from "@/app/(main)/car-concil/edit/[id]/api";

export default async function EditorPage({ params }) {
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
  const dealerList = await getDealerList(session.agentId);
  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록
  const tradeItemCDList = await getCDList('23');   // 알선거래항목
  const carKndList = await getCDList('92');   // 차량 종류 코드 목록

  const { id } = await params;
  const carConcilDetail = await getCarConcilDetail(id);

  // 차량 등록 번호
  /** 
  const carConcilDetail = {
    data: {
      id: id,
      offerType: '상사매입',
      modelName: '그랜저(승용)',
      carNo: '123가1234 (123허1234)',
      dealerName: '홍길동',
      purchaseDate: '2025-08-01',
      purchaseAmount: 100000000 
    }
  }
  */

  return <EditPage session={session}
                   dealerList={dealerList.data}
                   carKndList={carKndList.data}
                   evdcCdList={evdcCDList.data}
                   tradeItemCDList={tradeItemCDList.data}
                   carConcilDetail={carConcilDetail}
   />;
}
