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

    ...prefix("events", [
      index("./routes/events/_index.jsx"),
      route("new", "./routes/events/new.jsx"),
      ...prefix(":eventId", [
        index("./routes/events/$eventId.jsx"),
        route("edit", "./routes/events/$eventId.edit.jsx"),
        ...prefix("photos", [
          index(
            "./routes/events/photos/_index.jsx"
          ),
          route(
            "face-filtered",
            "./routes/events/photos/face-filtered.jsx"
          ),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
