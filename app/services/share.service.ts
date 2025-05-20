import {
  type ShareLink,
  ShareType,
  ShareStatus,
  type CreateShareLinkRequest,
  type PasswordAccessRequest,
  type AccessResponse,
  type ShareStats,
} from "~/models/share";

// Classe de serviço para gerenciamento de compartilhamento
class ShareService {
  private apiBaseUrl: string;

  constructor() {
    // Em um ambiente real, isso viria de variáveis de ambiente
    this.apiBaseUrl = "/api";
  }

  // Criar um novo link de compartilhamento
  async createShareLink(request: CreateShareLinkRequest): Promise<ShareLink> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro ao criar link de compartilhamento"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao criar link de compartilhamento:", error);
      throw error;
    }
  }

  // Obter links de compartilhamento de um álbum
  async getShareLinks(albumId: string): Promise<ShareLink[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/albums/${albumId}/share`,
        {
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro ao obter links de compartilhamento"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao obter links de compartilhamento:", error);
      throw error;
    }
  }

  // Revogar um link de compartilhamento
  async revokeShareLink(shareId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/share/${shareId}/revoke`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro ao revogar link de compartilhamento"
        );
      }
    } catch (error) {
      console.error("Erro ao revogar link de compartilhamento:", error);
      throw error;
    }
  }

  // Acessar um álbum compartilhado com senha
  async accessWithPassword(
    slug: string,
    request: PasswordAccessRequest
  ): Promise<AccessResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/share/${slug}/access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Senha incorreta ou link inválido",
        };
      }

      const data = await response.json();
      return {
        success: true,
        ...data,
      };
    } catch (error) {
      console.error("Erro ao acessar álbum compartilhado:", error);
      return {
        success: false,
        message: "Erro ao processar solicitação de acesso",
      };
    }
  }

  // Verificar se um link de compartilhamento é válido
  async validateShareLink(
    slug: string
  ): Promise<{ valid: boolean; type: ShareType }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/share/${slug}/validate`);

      if (!response.ok) {
        return { valid: false, type: ShareType.PUBLIC };
      }

      const data = await response.json();
      return {
        valid: true,
        type: data.type,
      };
    } catch (error) {
      console.error("Erro ao validar link de compartilhamento:", error);
      return { valid: false, type: ShareType.PUBLIC };
    }
  }

  // Obter estatísticas de um link de compartilhamento
  async getShareStats(shareId: string): Promise<ShareStats> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/share/${shareId}/stats`,
        {
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro ao obter estatísticas de compartilhamento"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao obter estatísticas de compartilhamento:", error);
      throw error;
    }
  }

  // Gerar URL pública para um link de compartilhamento
  getShareUrl(slug: string): string {
    // Em um ambiente real, isso usaria a URL base do site
    return `${window.location.origin}/s/${slug}`;
  }

  // Método auxiliar para obter o token de autenticação
  private getAuthToken(): string {
    // Em um ambiente real, isso viria do serviço de autenticação
    return localStorage.getItem("auth_token") || "";
  }
}

// Exporta uma instância única do serviço
export const shareService = new ShareService();
