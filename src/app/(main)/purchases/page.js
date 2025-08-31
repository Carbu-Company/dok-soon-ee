import Image from "next/image";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import PurchasesPage from "@/components/purchases/Page";

export default async function Purchases() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get("session")?.value).catch(console.error);

  console.log(session);
  
  return <PurchasesPage session={session} />;
}
