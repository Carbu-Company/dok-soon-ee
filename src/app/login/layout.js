import Script from "next/script";


export default function LoginLayout({ children }) {
  // 로그인 페이지는 전역 헤더/푸터를 사용하지 않도록 간단한 레이아웃으로 감쌉니다.
  return (
    <div>{children}
      <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css" />
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="afterInteractive" />
      <Script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js" strategy="afterInteractive" />
      <Script src="/js/main.js" strategy="afterInteractive" />
    </div>
  )

}