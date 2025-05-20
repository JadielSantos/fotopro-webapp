import type { Route } from "./+types/home";
import HomePage from "./_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Fotopro" },
    { name: "description", content: "Welcome to our website!" },
    { name: "keywords", content: "home, fotopro" },
    { name: "author", content: "Jadiel dos Santos" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { name: "robots", content: "index, follow" },
  ];
}

export default function Home() {
  return <HomePage />;
}
