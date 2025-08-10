"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./TopHeader.module.scss";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { BsWifi } from "react-icons/bs";
import { GoCommentDiscussion } from "react-icons/go";
import { useTransition } from "react";

export default function TopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    // 필요에 맞게 교체:
    // 1) 서버 라우트 호출: await fetch('/api/logout', { method: 'POST' })
    // 2) 전용 페이지로 이동: router.push('/logout')
    startTransition(async () => {
      try {
        // 예시: 페이지로 리다이렉트
        router.push("/logout");
        router.refresh();
      } catch (e) {
        console.error(e);
      }
    });
  };

  const navItems = [
    {
      key: "login-info",
      icon: <GoCommentDiscussion size={18} />,
      label: "로그인상사명",
      href: "/login-info",
    },
    {
      key: "settings",
      icon: <FiSettings size={18} />,
      label: "환경설정",
      href: "/settings",
    },
    {
      key: "remote-support",
      icon: <BsWifi size={18} />,
      label: "원격지원",
      href: "/remote-support",
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.title}>중고자동차 세무/정산 솔루션</div>

      <div className={styles.actions}>
        {navItems.map((item) => {
          const selected =
            item.href &&
            (pathname === item.href || pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.key}
              href={item.href}
              prefetch={false}
              className={`${styles.pillButton} ${
                selected ? styles.selected : ""
              }`}
              aria-current={selected ? "page" : undefined}
            >
              {item.icon}
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className={`${styles.pillButton} ${styles.logout}`}
          disabled={isPending}
          aria-busy={isPending}
        >
          <FiLogOut size={18} />
          <span className={styles.label}>
            {isPending ? "로그아웃 중…" : "로그아웃"}
          </span>
        </button>
      </div>
    </header>
  );
}
