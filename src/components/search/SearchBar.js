"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.scss";
import searchIcon from "@/public/icon/search.svg";
import Image from "next/image";

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    router.push(`/search?plate=${encodeURIComponent(v)}`);
  }

  return (
    <form className={styles.search} role="search" onSubmit={onSubmit}>
      <div className={styles.icon}>
        <Image src={searchIcon} alt="검색" />
      </div>
      <input
        id="global-search"
        type="text"
        placeholder="차량 번호로 검색하세요."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
        className={styles.input}
      />
    </form>
  );
}
