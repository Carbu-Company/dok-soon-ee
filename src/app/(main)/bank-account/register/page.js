import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegPage from "./RegPage";

export default async function BankAccountRegisterPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get("session")?.value).catch(console.error);

  if (!session) {
    redirect("/login");
  }

  try {

    return (
      <RegPage
        session={session}
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
