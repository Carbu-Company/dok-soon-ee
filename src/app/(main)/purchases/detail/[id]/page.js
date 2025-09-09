import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import DetailPage from "@/app/(main)/purchases/detail/[id]/DetailPage";
import { getSuggestOne } from "@/app/(main)/purchases/detail/[id]/api";

export default async function Detail({ params }) {
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

  // 차량 등록 번호
  const { id } = await params;
  const carPurDetail = await getSuggestOne(id);

  //console.log(id);
  console.log('carPurDetail', carPurDetail);
  console.log('carPurDetail.data-------------dfsfsf-----------------------------------------');

  return <DetailPage session={session}
                     carPurDetail={carPurDetail}
   />;
}
