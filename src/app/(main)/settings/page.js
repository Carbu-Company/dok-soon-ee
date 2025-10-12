import ListPage from './ListPage'
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get("session")?.value).catch(console.error);

  return <ListPage session={session} />
}