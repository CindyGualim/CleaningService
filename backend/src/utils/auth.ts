import { verifyJWT } from "./jwt";

export async function requireAuth(request: Request, env: any) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: true, response: new Response("Unauthorized", { status: 401 }) };
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const jwt = await verifyJWT(token);
    return { error: false, jwt };
  } catch (err) {
    return { error: true, response: new Response("Invalid token", { status: 401 }) };
  }
}
