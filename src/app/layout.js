// app/layout.js;
import "/public/css/reset.css";
import "/public/css/style.css";

export const metadata = {
  title: "똑순이 2.0",
  description: "중고차 세무/정산 솔루션",
};

export default function RootLayout({ children }) {
  // 루트 레이아웃은 최소한의 HTML/Body만 제공하고, 실제 앱 UI는 (main) 레이아웃에서 렌더합니다.
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
