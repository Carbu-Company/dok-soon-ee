import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegPage from "./EditPage";
import { getDealerList, getCDList } from "@/app/(main)/common/api";
import { getCarAcctDetail } from "./api";

export default async function BankAccountRegisterPage({ params }) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get("session")?.value).catch(console.error);

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  try {

    const dealerList = await getDealerList(session.agentId);
    const tradeInItemCDList = await getCDList('80');   // 거래항목 코드 목록
    const tradeOutItemCDList = await getCDList('81');   // 거래항목 코드 목록
    const carAcctDetail = await getCarAcctDetail(id);

    console.log("carAcctDetail", carAcctDetail);

    return (
      <RegPage
        session={session}
        tradeInItemCDList={tradeInItemCDList.data}
        tradeOutItemCDList={tradeOutItemCDList.data}
        carAcctDetail={carAcctDetail}
      />
    );
  } catch (error) {
    console.error("계좌 등록 페이지 데이터 로딩 오류:", error);
    
    // 오류 발생 시에도 페이지는 렌더링하되 빈 데이터로 표시
    return (
      <RegPage
        session={session}
      />
    );
  }
}
