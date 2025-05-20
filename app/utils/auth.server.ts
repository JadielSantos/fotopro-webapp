import { redirect } from "react-router";
import { UserRole } from "~/models/auth";
import { authService } from "~/services/auth.service";

// Middleware para verificar autenticação
export async function requireAuth(request: Request) {
  // Verificar se o usuário está autenticado
  const token = authService.getToken();

  if (!token) {
    // Redirecionar para a página de login
    throw redirect("/login");
  }

  return null;
}

// Middleware para verificar se o usuário é fotógrafo
export async function requirePhotographer(request: Request) {
  // Primeiro verificar autenticação
  await requireAuth(request);

  // Verificar se o usuário é fotógrafo
  if (!authService.isPhotographer()) {
    // Redirecionar para a página de acesso negado
    throw redirect("/access-denied");
  }

  return null;
}

// Middleware para verificar se o usuário é cliente
export async function requireClient(request: Request) {
  // Primeiro verificar autenticação
  await requireAuth(request);

  // Verificar se o usuário é cliente
  if (!authService.isClient()) {
    // Redirecionar para a página de acesso negado
    throw redirect("/access-denied");
  }

  return null;
}

// Middleware para verificar se o usuário NÃO está autenticado
export async function requireGuest(request: Request) {
  // Verificar se o usuário está autenticado
  const token = authService.getToken();

  if (token) {
    // Se estiver autenticado, redirecionar para a página apropriada
    const user = authService.getCurrentUser();

    if (user?.role === UserRole.PHOTOGRAPHER) {
      throw redirect("/dashboard/photographer");
    } else if (user?.role === UserRole.CLIENT) {
      throw redirect("/dashboard/client");
    } else {
      throw redirect("/");
    }
  }

  return null;
}
