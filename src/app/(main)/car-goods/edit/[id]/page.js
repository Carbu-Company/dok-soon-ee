import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import EditPage from "@/app/(main)/car-goods/edit/[id]/EditPage";
import { getCarPurInfo, getCDList, updateGoodsFee, getCarGoodsInfo } from "@/app/(main)/api/carApi";

export default async function EditorPage({ params }) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get("session")?.value).catch(console.error);

  const { id } = await params;

  const carPurInfo = await getCarPurInfo(id);
  const carGoodsInfo = await getCarGoodsInfo(id);
  const expdCdList = await getCDList('08');
  const evdcCDList = await getCDList('07');   // 매입 증빙 코드 목록

  async function updateGoodsFeeAction(data) {
    "use server";
    return updateGoodsFee(data);
  }

//   console.log('carPurInfo**********', carPurInfo);
  console.log('carGoodsInfo**********', carGoodsInfo);

  return <EditPage session={session}
                   carPurInfo={carPurInfo.data}
                   carGoodsInfo={carGoodsInfo.data}
                   expdCdList={expdCdList.data}
                   evdcCdList={evdcCDList.data}
                   goodsFeeDetail={[]}
                   updateGoodsFee={updateGoodsFeeAction}
   />;
}
