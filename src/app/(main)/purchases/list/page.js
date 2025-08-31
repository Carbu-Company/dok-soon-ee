import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import PurchasesPage from "@/app/(main)/purchases/list/PurchasesPage";
import { getPurchasesListNew } from "./api";

export default async function Purchases() {
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
  const res = await getPurchasesListNew(session.agentId, 1, 10);

  console.log(res);
  return <PurchasesPage session={session} />;
}