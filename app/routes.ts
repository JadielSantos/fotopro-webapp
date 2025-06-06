import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.jsx", [
    index("./routes/_index.jsx"),

    route("access/:accessHash", "./routes/access/$accessHash.jsx"),
    route("access/access-denied", "./routes/access/access-denied.jsx"),
    route("not-found", "./routes/not-found.jsx"),
    route("profile", "./routes/profile.jsx"),

    ...prefix("auth", [
      route("login", "./routes/auth/login.jsx"),
      route("register", "./routes/auth/register.jsx"),
    ]),

    layout("./routes/dashboard/layout.jsx", [
      ...prefix("events", [
        index("./routes/dashboard/events/_index.jsx"),
        route("new", "./routes/dashboard/events/new.jsx"),
        ...prefix(":eventId", [
          index("./routes/dashboard/events/$eventId.jsx"),
          route("edit", "./routes/dashboard/events/edit.jsx"),
          ...prefix("photos", [
            index(
              "./routes/dashboard/events/photos/_index.jsx"
            ),
            route(
              "face-filtered",
              "./routes/dashboard/events/photos/face-filtered.jsx"
            ),
          ]),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
