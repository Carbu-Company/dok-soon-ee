"use client";

import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <div>
      <footer className="footer">
        <p>고객센터 : 1599-1579 (상담시간 10:00 ~ 17:00) / 이메일 : aibiz@aibiz.co.kr / 팩스 : 031-630-3774</p>
        <p>Copyrights © 2017 AIBIZ All Rights Reserved.</p>
      </footer>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
        <button
          type="button"
          className="btn btn--white btn--padding--r30"
          onClick={() => {
            router.push("/sys-admin/use-req/list");
          }}
          style={{ marginRight: "30px" }}
        >
          <span className="ico ico--add"></span>상사관리
        </button>
        <button
          type="button"
          className="btn btn--white btn--padding--r30"
          onClick={() => {
            router.push("/sys-admin/use-req/list");
          }}
          style={{ marginBottom: "30px" }}
        >
          <span className="ico ico--add"></span>사무장관리
        </button>
      </div>
    </div>
  );
}


