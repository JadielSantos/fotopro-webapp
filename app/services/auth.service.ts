import {
  UserRole,
  type LoginCredentials,
  type PhotographerRegistration,
  type ClientRegistration,
  type AuthResponse,
  type User,
} from "~/models/auth";

// Classe de serviço para autenticação
class AuthService {
  // Login para ambos os tipos de usuário
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Falha na autenticação");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  // Registro de fotógrafo
  async registerPhotographer(
    data: PhotographerRegistration
  ): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/register/photographer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Falha no registro");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no registro de fotógrafo:", error);
      throw error;
    }
  }

  // Registro de cliente
  async registerClient(
    data: ClientRegistration
  ): Promise<AuthResponse | { error: string }> {
    try {
      const response = await fetch("/api/auth/register/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Falha no registro");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no registro de cliente:", error);
      return { error: (error as Error).message || "Erro desconhecido" };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Limpar token do localStorage
      localStorage.removeItem("auth_token");
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  }

  // Verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem("current_user");
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error);
      return null;
    }
  }

  // Verificar se o usuário é fotógrafo
  isPhotographer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.PHOTOGRAPHER;
  }

  // Verificar se o usuário é cliente
  isClient(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.CLIENT;
  }

  // Salvar dados de autenticação
  saveAuthData(authResponse: AuthResponse): void {
    localStorage.setItem("auth_token", authResponse.token);
    localStorage.setItem("current_user", JSON.stringify(authResponse.user));
    localStorage.setItem("token_expires", authResponse.expiresAt);
  }

  // Obter token de autenticação
  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }
}

// Exporta uma instância única do serviço
export const authService = new AuthService();
