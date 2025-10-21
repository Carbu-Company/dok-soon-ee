import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import EditPage from "@/app/(main)/inventory-finance/edit/[id]/[loan]/EditPage";
import { getCarPurInfo, getDealerList, getCDList, getCompanyLoanLimit, getCarLoanIdOneInfo, updateGoodsFee } from "@/app/(main)/api/carApi";

export default async function EditorPage({ params }) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get("session")?.value).catch(console.error);

  const { id } = await params;
  const { loan } = await params;

  const carPurInfo = await getCarPurInfo(id);
  const dealerList = await getDealerList(session.agentId);
  const loanCompList = await getCarLoanCorpList(session.agentId);
  const loanDetail = await getCarLoanIdOneInfo(loan);   // 상사 대출회사 한도

  async function updateCarLoanAction(data) {
    "use server";
    return updateCarLoan(data);
  }

  return <EditPage session={session}
                   carPurDetail={carPurInfo.data}
                   dealerList={dealerList.data}
                   loanCompList={loanCompList.data}    // loanCompList 대신 사용해야 되고, 콤보에서 선택시 한도 및 잔여한도 안내
                   loanDetail={loanDetail.data}
   />;
}
