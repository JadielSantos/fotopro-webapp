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

export async function getAuthToken(request) {
  const cookieHeader = request.headers.get("Cookie");
  return (await authCookie.parse(cookieHeader)) || null;
}