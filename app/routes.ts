import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes = [
  index("routes/home.tsx"),
  route("login/user", "routes/login.client.tsx"),
  route("login/photographer", "routes/login.photographer.tsx"),
  route("register/user", "routes/register.client.tsx"),
  route("register/photographer", "routes/register.photographer.tsx"),
  route("dashboard/photographer", "routes/dashboard.photographer._index.tsx"),
  route("dashboard/user", "routes/dashboard.client._index.tsx"),
  route("dashboard/photographer/albums/:id", "routes/dashboard.photographer.albums.$albumId.process.tsx"),
  route("dashboard/photographer/albums/:id/share", "routes/dashboard.photographer.albums.$albumId.share.tsx"),
  route("access-denied", "routes/access-denied.tsx"),
];

export default routes satisfies RouteConfig;
