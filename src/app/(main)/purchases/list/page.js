import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import ListPage from "@/app/(main)/purchases/list/ListPage";
import { getPurchasesListNew, getDealerList } from "./api";

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
  const purchasesList = await getPurchasesListNew(session.agentId, 1, 10);
  const dealerList = await getDealerList(session.agentId);

  console.log(purchasesList);
  console.log(dealerList);

  return <ListPage session={session}
                   data={purchasesList.data}
                   dealerList={dealerList.data}
                   page={1}
                   pageSize={10}
   />;
}