import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
  useLoaderData,
  useLocation,
} from "react-router";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import "../app.css";
import logo from "../assets/logo_fotopro_centered.png";
import { getAuthToken } from "../utils/auth.server";
import { userController } from "../controllers/user.controller";
import { UserRole } from "../enums/user.enum";

export async function loader({ request, params }) {
  const token = await getAuthToken(request);

  if (!token) {
    return {
      isLoggedIn: false,
    };
  }

  const validationResponse = await userController.validateToken(token);

  if (validationResponse.status !== 200) {
    return {
      isLoggedIn: false,
    };
  }

  const user = validationResponse.data;

  // Fetch additional user details if needed
  const userDetails = await userController.getById(user.id);

  if (userDetails.error) {
    console.error("Error fetching user details:", userDetails.message);
    return { isLoggedIn: false };
  }

  return { isLoggedIn: true, user: userDetails?.data };
}

export default function Layout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NavbarMenu />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function NavbarMenu() {
  const { user, isLoggedIn } = useLoaderData();
  const location = useLocation(); // Hook para obter o path atual
  const isActive = (path) => location.pathname === path; // Função para verificar se o path está ativo

  return (
    <Navbar fluid={true} className="bg-primary-600 text-secondary-50">
      <NavbarBrand href="/">
        <img src={logo} className="rounded-full mr-3 h-6 sm:h-9" alt="Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold">
          FotoPro
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink href="/" active={isActive("/")}>
          Home
        </NavbarLink>
        <NavbarLink href="/events" active={isActive("/events")}>
          Eventos
        </NavbarLink>
        {(user?.role == UserRole.PHOTOGRAPHER || user?.role == UserRole.ADMIN) && <NavbarLink href="/events/new" active={isActive("/events/new")}>
          Criar Evento
        </NavbarLink>}
        {isLoggedIn ? (
          <NavbarLink href="/profile" active={isActive("/profile")}>
            Perfil
          </NavbarLink>
        ) : (
          <>
            <NavbarLink href="/auth/login" active={isActive("/auth/login")}>
              Login
            </NavbarLink>
            <NavbarLink href="/auth/register" active={isActive("/auth/register")}>
              Registrar
            </NavbarLink>
          </>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}