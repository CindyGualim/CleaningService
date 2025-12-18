import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode("supersecret-key-123"); // cambialo por algo más fuerte

export async function generateJWT(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(SECRET);
}

export async function verifyJWT(token: string) {
  return await jwtVerify(token, SECRET);
}
