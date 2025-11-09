import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import IssuePage from "@/app/(main)/cash-receipts/newIssue/[id]/IssuePage";
import { getCashIssueInfo } from "@/app/(main)/cash-receipts/newIssue/[id]/api";

export default async function RegisterPage({ params }) {
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

  // 현금영수증 발행 위한 데이터 조회.

  let id = null;
  let cashIssueInfo = null;

  if (params && params.id) {
    id = params.id;
    if (id !== "0") {
      cashIssueInfo = await getCashIssueInfo(id);
    }
  }
  return <IssuePage session={session}
                    cashIssueInfo={cashIssueInfo}
         />;
}
