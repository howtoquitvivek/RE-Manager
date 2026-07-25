import { cookies } from "next/headers";
import { encrypt, decrypt } from "./jwt";
import { cache } from "react";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "re_manager_auth";

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session) return null;
  return await decrypt(session);
});
