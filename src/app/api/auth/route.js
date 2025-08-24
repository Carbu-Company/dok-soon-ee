"use server";

import sql from "mssql";
import { getPool } from "@/lib/mssql/pool";
import bcrypt from "bcryptjs";
import { signSession } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { loginId, password } = body || {};

    if (!loginId || !password) {
      return new Response(
        JSON.stringify({ error: "아이디와 비밀번호를 입력하세요." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const pool = await getPool();
    const request = pool.request();
    request.input("loginId", sql.VarChar(200), loginId);

    const query = `
      SELECT USR_ID, AGENT_ID, LOGIN_ID, LOGIN_PASSWD, USR_NM, USR_GRADE_CD
      FROM dbo.CJB_USR
      WHERE LOGIN_ID = @loginId
    `;

    const result = await request.query(query);
    const user = result.recordset?.[0];

    if (!user) {
      return new Response(
        JSON.stringify({ error: "사용자를 찾을 수 없습니다." }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const dbPass = user.LOGIN_PASSWD || "";
    let passwordMatches = false;
    if (
      dbPass.startsWith("$2") ||
      dbPass.startsWith("$2a") ||
      dbPass.startsWith("$2b")
    ) {
      passwordMatches = await bcrypt.compare(password, dbPass);
    } else {
      passwordMatches = password === dbPass;
    }

    if (!passwordMatches) {
      return new Response(
        JSON.stringify({ error: "비밀번호가 일치하지 않습니다." }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (String(user.USR_GRADE_CD) !== "9") {
      return new Response(JSON.stringify({ error: "권한이 없습니다." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = await signSession({
      usrId: user.USR_ID,
      agentId: user.AGENT_ID,
      usrNm: user.USR_NM,
    });
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const sessionCookie = `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

    // CSRF 토큰 생성 및 쿠키로 발행 (JS에서 읽을 수 있도록 HttpOnly 아님)
    const csrfToken = randomBytes(16).toString("hex");
    const csrfCookie = `csrf=${csrfToken}; Path=/; Secure; SameSite=Lax; Max-Age=${maxAge}`;

    return new Response(JSON.stringify({ success: true, csrf: csrfToken }), {
      status: 200,
      headers: {
        "Set-Cookie": [sessionCookie, csrfCookie],
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "서버 오류" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
