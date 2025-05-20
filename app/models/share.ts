// Tipos de compartilhamento
export enum ShareType {
  PUBLIC = 'public',     // Qualquer pessoa com o link pode acessar
  PASSWORD = 'password', // Requer senha para acessar
  EMAIL = 'email'        // Apenas emails específicos podem acessar
}

// Status de compartilhamento
export enum ShareStatus {
  ACTIVE = 'active',     // Link ativo
  EXPIRED = 'expired',   // Link expirado
  REVOKED = 'revoked'    // Link revogado pelo fotógrafo
}

// Interface para link de compartilhamento
export interface ShareLink {
  id: string;
  albumId: string;
  type: ShareType;
  status: ShareStatus;
  password?: string;      // Senha para acesso (apenas para tipo PASSWORD)
  allowedEmails?: string[]; // Emails permitidos (apenas para tipo EMAIL)
  maxViews?: number;      // Número máximo de visualizações
  viewCount: number;      // Contador de visualizações
  expiresAt?: string;     // Data de expiração (ISO string)
  createdAt: string;      // Data de criação (ISO string)
  updatedAt: string;      // Data de última atualização (ISO string)
  lastAccessedAt?: string; // Data do último acesso (ISO string)
  slug: string;           // Identificador amigável para URL
}

// Interface para criação de link de compartilhamento
export interface CreateShareLinkRequest {
  albumId: string;
  type: ShareType;
  password?: string;
  allowedEmails?: string[];
  maxViews?: number;
  expiresAt?: string;
}

// Interface para acesso a link protegido por senha
export interface PasswordAccessRequest {
  password: string;
}

// Interface para resposta de acesso
export interface AccessResponse {
  success: boolean;
  message?: string;
  album?: {
    id: string;
    title: string;
    description?: string;
    photoCount: number;
  };
  token?: string; // Token temporário para acesso ao álbum
}

// Interface para estatísticas de compartilhamento
export interface ShareStats {
  totalViews: number;
  uniqueVisitors: number;
  lastAccessed?: string;
  accessByDate: {
    date: string;
    count: number;
  }[];
}
