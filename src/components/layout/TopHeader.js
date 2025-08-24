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
    // 서버의 로그아웃 엔드포인트를 호출하여 쿠키를 삭제한 뒤 로그인 페이지로 이동
    startTransition(async () => {
      try {
        // CSRF 토큰을 double-submit cookie 방식으로 전달
        const csrfMatch = document.cookie
          .split("; ")
          .find((c) => c.startsWith("csrf="));
        const csrf = csrfMatch ? csrfMatch.split("=")[1] : null;

        await fetch("/api/auth/logout", {
          method: "POST",
          headers: csrf ? { "x-csrf-token": csrf } : {},
        });
        router.push("/login");
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
