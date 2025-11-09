import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import RegPage from "@/app/(main)/electronic-tax-invoice/newIssue/[id]/RegPage";
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
    if (id !== "0") {
      // id가 16자리 숫자면 getCarTaxIssueInfo, 아니면 getTaxIssueInfo 호출
      if (typeof id === "string" && id.length === 16 && /^\d+$/.test(id)) {
        taxIssueInfo = await getCarTaxIssueInfo(id);
      } else {
        taxIssueInfo = await getTaxIssueInfo(id);
      }
    }
  }

  console.log('taxIssueInfo******************', taxIssueInfo);

  return <RegPage session={session}
                  taxIssueInfo={taxIssueInfo.data}
  />;
}
