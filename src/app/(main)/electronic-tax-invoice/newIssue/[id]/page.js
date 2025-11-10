import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import IssuePage from "@/app/(main)/electronic-tax-invoice/newIssue/[id]/IssuePage";
import { getCarTaxIssueInfo, getTaxIssueInfo } from "./api";
import { getDealerList, getCDList } from "@/app/(main)/common/api";

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

  let taxIssueInfo = null;

  if (params) {
    
    const { id } = await params;

    /**
     * 건별 발행이 아니면 전자세금계산서 발행을 위한 정보 조회
     * - 건별발행시에는 파라메터 값을 0으로 처리한다.
     */
    if (id !== "0") {
      // id가 16자리 숫자면 getCarTaxIssueInfo, 아니면 getTaxIssueInfo 호출
      if (typeof id === "string" && id.length === 16 && /^\d+$/.test(id)) {
        taxIssueInfo = await getCarTaxIssueInfo(id);
      } else {
        taxIssueInfo = await getTaxIssueInfo(id);
      }
    }
  }

  return <IssuePage session={session}
                  taxIssueInfo={taxIssueInfo?.data}
  />;
}
