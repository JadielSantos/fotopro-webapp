import { createCookie } from "react-router";

export const authCookie = createCookie("auth", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60, // 1 hour
});

export async function createAuthCookie(token) {
  return authCookie.serialize(token);
}

export async function invalidateAuthCookie() {
  return authCookie.serialize("", {
    expires: new Date(0), // Expire the cookie immediately
    token: null,
  });
}

export async function getAuthToken(request) {
  const cookieHeader = request.headers.get("Cookie");
  return (await authCookie.parse(cookieHeader)) || null;
}