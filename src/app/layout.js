// app/layout.js
import "@/public/globals.scss";
import TopHeader from "@/components/layout/TopHeader";
import LogoSearchBar from "@/components/layout/LogoSearchBar";
import NavTabs from "@/components/layout/NavTabs";
export const metadata = {
  title: "똑순이 2.0",
  description: "중고차 세무/정산 솔루션",
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <TopHeader />
        <div className="main">
          <LogoSearchBar />
          <NavTabs />
          {children}
        </div>
      </body>
    </html>
  );
}
