import Script from "next/script";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "똑순이 2.0",
  description: "중고차 세무/정산 솔루션",
};

export default async function MainLayout({ children }) {
  // 서버 사이드에서 쿠키를 확인하여 인증되지 않은 사용자는 로그인으로 리다이렉트
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) {
      redirect("/login");
    }

    // 토큰 검증; 실패하면 로그인으로 리다이렉트
    await verifySession(sessionCookie);
  } catch (err) {
    redirect("/login");
  }

  return (
    <div className="wrap">
      <Header />
      {children}
      <Footer />
      <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css" />
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="afterInteractive" />
      <Script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js" strategy="afterInteractive" />
      <Script src="/js/main.js" strategy="afterInteractive" />
    </div>
  );
}
