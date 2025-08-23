import DashboardPage from "@/app/(main)/dashboard/listPage";
import { getTaxCashNoList, getInventoryFinanceStatus, getInquiryStatus, getNoticeStatus } from "./api";
import { getCommonDealers } from "../common/api";

// 검색 항목 초기화
export default async function List() {
    //const userInfo = await getUserInfo();
    const dealers = await getCommonDealers("00002"); 

    // 목록
    const taxCashNoList = await getTaxCashNoList("00002");
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
    )
}
