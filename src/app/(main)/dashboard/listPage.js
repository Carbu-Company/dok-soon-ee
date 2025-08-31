import React from "react";

import {
  CashTaxUnissuedList,
  InventoryFinanceStatus,
  SalesPurchaseSummary,
  OneToOneInquiry,
  Notices,
} from "@/components/dashboard";
import styles from "@/app/(main)/dashboard/page.module.scss";

export default function DashboardPage(props) {
  return (
    <main className={styles.container}>
      {/* 상단: 좌(현금/세금계산서), 우(재고금융) */}
      <div className={styles.rowTwoCol}>
        <CashTaxUnissuedList taxCashNoList={props.taxCashNoList || []} />
        <InventoryFinanceStatus
          inventoryFinanceStatus={props.inventoryFinanceStatus || []}
        />
      </div>

      {/* 매입/매출 현황 (전체 너비) */}
      <div className={styles.fullWidth}>
        <SalesPurchaseSummary salesPurchaseSummary={props.salesPurchaseSummary || []} />
      </div>

      {/* 1:1 문의 및 공지사항 */}
      <div className={styles.rowTwoCol}>
        <OneToOneInquiry inquiryStatus={props.inquiryStatus || []} />
        <Notices noticeStatus={props.noticeStatus || []} />
      </div>
    </main>
  );
}
