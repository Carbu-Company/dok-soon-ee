import { useState } from "react";
import styles from "./modal.module.scss";

export default function RegisterModal({ open, onClose }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || "회원가입 실패");
      }

      onClose();
    } catch (err) {
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="닫기"
        >
          ×
        </button>
        <h1>회원가입</h1>
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
          <div>
            <label>비밀번호 확인</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          {error && <div style={{ color: "#c00" }}>{error}</div>}
          <div className={styles.actions}>
            <button type="button" onClick={onClose} disabled={loading}>
              취소
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "등록 중..." : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
