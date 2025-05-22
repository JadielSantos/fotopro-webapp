// Tipos de usuário do sistema
export enum UserRole {
  PHOTOGRAPHER = "photographer",
  CUSTOMER = "customer",
}

// Interface base para usuários
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  lastAccess?: Date;
  isBlocked?: boolean;
  createdAt: Date;
}

// Interface específica para fotógrafos
export interface Photographer extends User {
  role: UserRole.PHOTOGRAPHER;
  businessName?: string;
  bio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  websiteUrl?: string;
  instagramUsername?: string;
  facebookUsername?: string;
  xUsername?: string;
}

// Interface específica para clientes
export interface Customer extends User {
  role: UserRole.CUSTOMER;
}

// Dados para login
export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

// Resposta de autenticação
export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}
