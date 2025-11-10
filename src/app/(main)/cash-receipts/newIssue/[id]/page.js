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
  agentBrno : 상사 사업자번호
  empBrno : 사원 사업자번호
  } 
  */  

  // 현금영수증 발행 위한 데이터 조회.

  let cashIssueInfo = null;

  if (params) {
    const { id } = await params;

    /**
     * 건별 발행이 아니면 현금영수증 발행을 위한 정보 조회
     * - 건별발행시에는 파라메터 값을 0으로 처리한다.
     */
    if (id !== "0") {
      cashIssueInfo = await getCashIssueInfo(id);
    }

  }
  return <IssuePage session={session}
                    cashIssueInfo={cashIssueInfo}
         />;
}
