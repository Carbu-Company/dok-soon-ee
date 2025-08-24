import DashboardPage from "@/app/(main)/dashboard/listPage";
import {
  getTaxCashNoList,
  getInventoryFinanceStatus,
  getInquiryStatus,
  getNoticeStatus,
} from "@/app/(main)/dashboard/api";

// 검색 항목 초기화
export default async function List() {
  const taxCashNoList = await getTaxCashNoList("00002");
  console.log(taxCashNoList);
  const inventoryFinanceStatus = await getInventoryFinanceStatus("00002");
  const inquiryStatus = await getInquiryStatus("00002");
  const noticeStatus = await getNoticeStatus("00002");

  return (
    <DashboardPage
      taxCashNoList={taxCashNoList.data}
      inventoryFinanceStatus={inventoryFinanceStatus.data}
      inquiryStatus={inquiryStatus.data}
      noticeStatus={noticeStatus.data}
    />
  );
}
