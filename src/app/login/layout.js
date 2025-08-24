export default function LoginLayout({ children }) {
  // 로그인 페이지는 전역 헤더/푸터를 사용하지 않도록 간단한 레이아웃으로 감쌉니다.
  return <div>{children}</div>;
}
