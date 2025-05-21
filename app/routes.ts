import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),

  layout("./routes/auth/layout.tsx", [
    route("login", "./routes/auth/login.tsx"),
    route("register", "./routes/auth/register.tsx"),
  ]),

  layout("./routes/dashboard/layout.tsx", [
    index("./routes/dashboard/_index.tsx"),
    ...prefix("events", [
      index("./routes/dashboard/events/_index.tsx"),
      route("new", "./routes/dashboard/events/new.tsx"),
      layout("./routes/dashboard/events/$eventId/layout.tsx", [
        index("./routes/dashboard/events/$eventId/_index.tsx"),
        route("edit", "./routes/dashboard/events/$eventId/edit.tsx"),
        ...prefix("albums", [
          index("./routes/dashboard/events/$eventId/albums/_index.tsx"),
          route("new", "./routes/dashboard/events/$eventId/albums/new.tsx"),
          layout(
            "./routes/dashboard/events/$eventId/albums/$albumId/layout.tsx",
            [
              index(
                "./routes/dashboard/events/$eventId/albums/$albumId/_index.tsx"
              ),
              route(
                "edit",
                "./routes/dashboard/events/$eventId/albums/$albumId/edit.tsx"
              ),
              ...prefix("photos", [
                index(
                  "./routes/dashboard/events/$eventId/albums/$albumId/photos/_index.tsx"
                ),
                route(
                  "new",
                  "./routes/dashboard/events/$eventId/albums/$albumId/photos/new.tsx"
                ),
              ]),
            ]
          ),
        ]),
      ]),
    ]),
  ]),

  route("access/:accessHash", "./routes/access/$accessHash.tsx"),
] satisfies RouteConfig;
