"use client";

import React, { useState } from "react";
import { excelDownload } from "@/components/utils/ExcelDownload";
import { printTable } from "@/components/utils/PrintUtils";


import {
  CashTaxUnissuedList,
  InventoryFinanceStatus,
  SalesPurchaseSummary,
  OneToOneInquiry,
  Notices,
} from "@/components/dashboard";
import styles from "./page.module.scss";

export default function DashboardPage(props) {

    const [loading, setLoading] = useState(false);
    const [taxCashNoList, setTaxCashNoList] = useState(props.taxCashNoList?.data || []);
    const [inventoryFinanceStatus, setInventoryFinanceStatus] = useState(props.inventoryFinanceStatus?.data || []);
    const [inquiryStatus, setInquiryStatus] = useState(props.inquiryStatus?.data || []);
    const [noticeStatus, setNoticeStatus] = useState(props.noticeStatus?.data || []);

    /**
     * 엑셀 다운로드 처리
     */
    const handleExcelDownload = () => {
        excelDownload({
        data: carList,
        columns: carColumns,
        numericColumns: NUMERIC_COLUMNS,
        sheetName: "차량목록",
        filePrefix: "차량목록"
        });
    };

    /**
     * 인쇄 처리
     */
    const handlePrint = () => {
        printTable({
        data: carList,
        columns: carColumns,
        numericColumns: NUMERIC_COLUMNS,
        title: "차량 목록"
        });
    };

    /**
     * 페이지 처리
     */
    const handlePageChange = async (page) => {
        await handleSearch(page);
    };

    return (
        <main className={styles.container}>
        {/* 상단: 좌(현금/세금계산서), 우(재고금융) */}
        <div className={styles.rowTwoCol}>
          <CashTaxUnissuedList taxCashNoList={taxCashNoList} />
          <InventoryFinanceStatus inventoryFinanceStatus={inventoryFinanceStatus} />
        </div>
  
        {/* 매입/매출 현황 (전체 너비) */}
        <div className={styles.fullWidth}>
          <SalesPurchaseSummary />
        </div>
  
        {/* 1:1 문의 및 공지사항 */}
        <div className={styles.rowTwoCol}>
          <OneToOneInquiry inquiryStatus={inquiryStatus} />
          <Notices noticeStatus={noticeStatus} />
        </div>
      </main>
    );
}
