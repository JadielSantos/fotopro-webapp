// Tipos de usuário do sistema
export enum UserRole {
  PHOTOGRAPHER = 'photographer',
  CLIENT = 'client'
}

// Interface base para usuários
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Interface específica para fotógrafos
export interface Photographer extends User {
  role: UserRole.PHOTOGRAPHER;
  businessName?: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

// Interface específica para clientes
export interface Client extends User {
  role: UserRole.CLIENT;
  phone?: string;
  lastAccess?: string;
}

// Dados para login
export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

// Dados para registro de fotógrafo
export interface PhotographerRegistration {
  email: string;
  password: string;
  name: string;
  businessName?: string;
  phone?: string;
}

// Dados para registro de cliente
export interface ClientRegistration {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// Resposta de autenticação
export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}
