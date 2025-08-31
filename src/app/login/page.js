"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Experience from "@/components/modal/ExperienceModal";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberId, setRememberId] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const userIdInputRef = useRef(null);
  const userPwInputRef = useRef(null);
  const [showExperience, setShowExperience] = useState(false);

  const openExperience = () => setShowExperience(true);
  const closeExperience = () => setShowExperience(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginId: userId, password: userPw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data?.error || "로그인 실패");
      } else if (data?.success) {
        if (data.csrf) {
          localStorage.setItem("csrf", data.csrf);
        }
        router.push("/purchases");
      } else {
        setLoginError(data?.error || "로그인 실패");
      }
    } catch (err) {
      setLoginError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const clearInput = (field) => {
    if (field === "userId") {
      setUserId("");
      userIdInputRef.current?.focus();
    }
    if (field === "userPw") {
      setUserPw("");
      userPwInputRef.current?.focus();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="wrap">
      {/* header :: s */}
      <header className="header">
        <div className="header__inner">
          <h1 className="header__title">중고자동차 세무/정산 솔루션</h1>
          <nav className="header__nav">
            <a className="header__nav-menu remote" href="#">
              <span>원격지원</span>
            </a>
          </nav>
        </div>
      </header>
      {/* header :: e */}

      {/* Content */}
      <main className="container">
        <div className="login-form">
          <h1 className="login-form__logo">
            <Image
              src="/images/logo_155100.png"
              alt="똑순이 2.0"
              width={155}
              height={100}
            />{" "}
          </h1>
          <form onSubmit={handleSubmit}>
            <ul className="login-form__list">
              <li>
                <label className="login-form__title" htmlFor="userid">
                  아이디
                </label>
                <div
                  className={`input input--lg ${
                    userId.length > 0 ? "input--typing" : ""
                  }`}
                >
                  <input
                    ref={userIdInputRef}
                    type="text"
                    id="userid"
                    className="input__field"
                    placeholder="아이디 입력"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                  <div className="input__utils">
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => clearInput("userId")}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </li>
              <li>
                <label className="login-form__title" htmlFor="userpw">
                  비밀번호
                </label>
                <div
                  className={`input input--lg ${
                    userPw.length > 0 ? "input--typing" : ""
                  }`}
                >
                  <input
                    ref={userPwInputRef}
                    type={showPassword ? "text" : "password"}
                    id="userpw"
                    className="input__field"
                    placeholder="비밀번호 입력"
                    value={userPw}
                    onChange={(e) => setUserPw(e.target.value)}
                  />
                  <div className="input__utils">
                    <button
                      type="button"
                      className="jsInputClear input__clear ico ico--input-delete"
                      onClick={() => clearInput("userPw")}
                    >
                      삭제
                    </button>
                    <button
                      type="button"
                      className={`jsInputTypeToggle input__toggle ico ico--view ${
                        showPassword ? "on" : ""
                      }`}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    </button>
                  </div>
                </div>
              </li>
            </ul>

            <div className="login-form__option">
              <div className="form-option">
                <label className="form-option__label">
                  <input
                    type="checkbox"
                    checked={rememberId}
                    onChange={(e) => setRememberId(e.target.checked)}
                  />
                  <span className="form-option__title">아이디 저장</span>
                </label>
              </div>
            </div>

            <div className="login-form__btn">
              <button
                className="btn btn--lg btn--primary"
                type="submit"
                disabled={!userId || !userPw || loading}
              >
                로그인
              </button>
            </div>
            {loginError && (
              <div
                className="login-form__error"
                role="alert"
                style={{ color: "red", marginTop: 8 }}
              >
                {loginError}
              </div>
            )}
          </form>

          <div className="login-form__nav">
            <a className="login-form__nav-link" href="#">
              아이디 찾기
            </a>
            <span className="login-form__nav-divi"></span>
            <a className="login-form__nav-link" href="#">
              비밀번호 찾기
            </a>
            <span className="login-form__nav-divi"></span>
            <a
              className="login-form__nav-link"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                openExperience();
              }}
            >
              체험등록 신청
            </a>
          </div>
          {showExperience && (
            <Experience open={showExperience} onClose={closeExperience} />
          )}
        </div>
      </main>

      {/* footer :: s */}
      <footer className="footer">
        <p>
          고객센터 : 1599-1579 (상담시간 10:00 ~ 17:00) / 이메일 :
          aibiz@aibiz.co.kr / 팩스 : 031-630-3774
        </p>
        <p>Copyrights © 2017 AIBIZ All Rights Reserved.</p>
      </footer>
      {/* footer :: e */}
    </div>
  );
}
