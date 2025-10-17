import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import EditPage from "@/app/(main)/car-goods/edit/[id]/[goodsfee]/EditPage";
import { getCarPurInfo, getCDList, getGoodsFeeDetail, updateGoodsFee } from "@/app/(main)/api/carApi";

export default async function EditorPage({ params }) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get("session")?.value).catch(console.error);

  const { id } = await params;
  const { goodsfee } = await params;

  const carPurInfo = await getCarPurInfo(id);
  const expdCdList = await getCDList('08');
  const goodsFeeDetail = await getGoodsFeeDetail(goodsfee);

  async function updateGoodsFeeAction(data) {
    "use server";
    return updateGoodsFee(data);
  }

  console.log('goodsFeeDetail**********', goodsFeeDetail);


  return <EditPage session={session}
                   carPurInfo={carPurInfo.data}
                   expdCdList={expdCdList.data}
                   goodsFeeDetail={goodsFeeDetail.data}
                   updateGoodsFee={updateGoodsFeeAction}
   />;
}
