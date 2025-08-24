"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterModal from "../../components/modal/RegisterModal";

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || "로그인 실패");
      }

      // 로그인 성공하면 루트로 이동
      router.push("/");
    } catch (err) {
      setError(err.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "3rem auto" }}>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디</label>
          <input
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: "#c00" }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
      {/* 회원 가입 */}
      <button onClick={() => setShowRegisterModal(true)}>회원가입</button>

      <RegisterModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </div>
  );
}
