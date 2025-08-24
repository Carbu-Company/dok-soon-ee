import { SignJWT, jwtVerify } from "jose";

const DEFAULT_EXPIRES = "7d";

function getSecret() {
  const secret = process.env.JWT_SECRET || "change_this_secret";
  return new TextEncoder().encode(secret);
}

export async function signSession(payload, expires = DEFAULT_EXPIRES) {
  const alg = "HS256";
  const secret = getSecret();

  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(secret);
}

export async function verifySession(token) {
  const secret = getSecret();
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.split("=");
      return [k.trim(), decodeURIComponent(v.join("="))];
    })
  );
}

export async function getSessionFromRequest(req) {
  const cookieHeader = req.headers?.get("cookie");
  const cookies = parseCookies(cookieHeader);
  const token = cookies.session;
  if (!token) return null;
  try {
    const payload = await verifySession(token);
    return payload;
  } catch (err) {
    return null;
  }
}
