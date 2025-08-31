import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import RegPage from "@/app/(main)/purchases/register/RegPage";
import { getPurchasesListNew } from "./api";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get("session")?.value).catch(console.error);

  return <RegPage session={session}

   />;
}
