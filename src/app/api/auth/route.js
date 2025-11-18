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
      SELECT A.USR_ID, A.AGENT_ID, A.LOGIN_ID, A.LOGIN_PASSWD, A.USR_NM, A.USR_GRADE_CD, A.EMP_BRNO, B.BRNO AS AGENT_BRNO, A.SYS_ADMIN_YN 
      FROM dbo.CJB_USR A
	     , dbo.CJB_AGENT B
      WHERE A.LOGIN_ID = @loginId
	    AND A.AGENT_ID = B.AGENT_ID
      AND A.USR_GRADE_CD = '9'   -- 사무장 
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
      agentBrno: user.AGENT_BRNO,
      empBrno: user.EMP_BRNO,
      sysAdminYn : user.SYS_ADMIN_YN,
    });
    const maxAge = 60 * 60 * 24 * 7; // 7 days

    // 배포 환경에서만 Secure 플래그를 추가하도록 방어적 설정
    const isProduction = process.env.NODE_ENV === "production";
    // 프록시 뒤에 있을 경우 x-forwarded-proto 확인 (https인지)
    const forwardedProto = (req.headers.get("x-forwarded-proto") || "").split(",")[0];
    const isSecure = isProduction && forwardedProto === "https";
    const secureAttr = isSecure ? "; Secure" : "";

    const cookieBase = `Path=/; SameSite=Lax; Max-Age=${maxAge}${secureAttr}`;
    const sessionCookie = `session=${token}; ${cookieBase}; HttpOnly`;

    // CSRF 토큰 생성 및 쿠키로 발행 (JS에서 읽을 수 있도록 HttpOnly 아님)
    const csrfToken = randomBytes(16).toString("hex");
    const csrfCookie = `csrf=${csrfToken}; ${cookieBase}`;

    // 디버그용: 배포에서 쿠키가 설정되는지 확인 (토큰 자체는 로그에 남기지 않음)
    console.error("AUTH: setting cookies secure=", isSecure);

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
