import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import RegPage from "@/app/(main)/purchases/register/RegPage";
import { getDealerList, getCDList } from "@/app/(main)/common/api";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get("session")?.value).catch(console.error);


  //console.log(session.agentId);
  const dealerList = await getDealerList(session.agentId);
  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록

  //console.log(evdcCDList);

  return <RegPage session={session}
                   dealerList={dealerList.data}
                   evdcCDList={evdcCDList.data}
   />;
}
