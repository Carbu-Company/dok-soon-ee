import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import EditPage from "@/app/(main)/sys-admin/use-req/edit/[id]/EditPage";
import { getCDList } from "@/app/(main)/common/api";
import { getAgentInfo } from "@/app/(main)/sys-admin/use-req/edit/[id]/api";

export default async function EditorPage({ params }) {
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

  //console.log(session.agentId);
  const { id } = await params;
  const agentInfo = await getAgentInfo(id);

  console.log('agentInfo*****************', agentInfo);

  return <EditPage session={session}
                   agentInfo={agentInfo}
   />;
}
