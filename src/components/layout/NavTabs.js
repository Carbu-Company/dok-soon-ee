"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./NavTabs.module.scss";

const NavTabs = () => {
  const pathname = usePathname();

  const tabs = [
    { label: "매입/매도차량", path: "/purchases/list", key: "purchases" },
    { label: "상품화", path: "/productization/list", key: "productization" },
    {
      label: "재고금융",
      path: "/inventory-finance/list",
      key: "inventory-finance",
    },
    { label: "현금영수증", path: "/cash-receipts/list", key: "cash-receipts" },
    { label: "세금계산서", path: "/tax-invoices/list", key: "tax-invoices" },
    { label: "알선처리", path: "/brokerage/list", key: "brokerage" },
    {
      label: "종합현황",
      path: "/overview/list",
      key: "overview",
      hasIcon: true,
    },
  ];

  const isActive = (tabPath) => {
    return pathname === tabPath || pathname.startsWith(tabPath + "/");
  };

  return (
    <div className={styles.navTabsContainer}>
      <div className={styles.tabsWrapper}>
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.path}
            className={`${styles.tabItem} ${
              isActive(tab.path) ? styles.active : ""
            }`}
          >
            <div className={styles.tabContent}>
              {tab.hasIcon ? (
                <div className={styles.tabWithIcon}>
                  <div className={styles.tabLabel}>{tab.label}</div>
                  <div className={styles.iconWrapper}>
                    <div className={styles.dropdownIcon}></div>
                  </div>
                </div>
              ) : (
                <div className={styles.tabLabel}>{tab.label}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.bottomBorder}></div>
    </div>
  );
};

export default NavTabs;
