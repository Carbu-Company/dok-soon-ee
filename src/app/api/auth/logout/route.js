"use server";

import { parseCookies } from "@/lib/auth";

function clearCookiesHeaders() {
  const expired = "Thu, 01 Jan 1970 00:00:00 GMT";
  const sessionCookie = `session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=${expired}`;
  const csrfCookie = `csrf=; Path=/; Secure; SameSite=Lax; Max-Age=0; Expires=${expired}`;
  return [sessionCookie, csrfCookie];
}

export async function POST(req) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const csrfCookie = cookies.csrf;
    const headerToken = req.headers.get("x-csrf-token");

    if (!csrfCookie || !headerToken || headerToken !== csrfCookie) {
      return new Response(JSON.stringify({ error: "Invalid CSRF token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const clearHeaders = clearCookiesHeaders();
    const response = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    // 쿠키 클리어 헤더 설정
    clearHeaders.forEach(cookie => {
      response.headers.append("Set-Cookie", cookie);
    });
    
    return response;
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "서버 오류" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("csrf");
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const csrfCookie = cookies.csrf;

    if (!csrfCookie || !token || token !== csrfCookie) {
      return new Response(JSON.stringify({ error: "Invalid CSRF token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const clearHeaders = clearCookiesHeaders();
    const response = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    // 쿠키 클리어 헤더 설정
    clearHeaders.forEach(cookie => {
      response.headers.append("Set-Cookie", cookie);
    });
    
    return response;
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "서버 오류" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
