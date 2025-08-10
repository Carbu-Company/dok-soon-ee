// components/layout/LogoSearchBar.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./LogoSearchBar.module.scss";
import logo from "@/public/logo.svg";
import SearchBar from "@/components/search/SearchBar";

export default function LogoSearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    router.push(`/search?plate=${encodeURIComponent(v)}`);
  }

  return (
    <div className={styles.wrap}>
      <Link href="/" className={styles.logo} aria-label="홈으로">
        <Image
          src={logo}
          alt="똑순이 2.0"
          width={123}
          height={64}
          priority
          style={{
            position: "absolute",
            left: 0,
            top: 0,
          }}
        />
      </Link>
      <SearchBar />
      <nav aria-label="상단 바로가기" className={styles.actions}>
        <ul>
          <li className={styles.hasDot}>
            <Link href="/notice">공지사항</Link>
          </li>
          <li className={styles.hasDot}>
            <Link href="/inquiry">1:1 문의</Link>
          </li>
          <li>
            <Link href="/home">홈텍스</Link>
          </li>
          <li>
            <Link href="/owner-lookup">원부조회</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
